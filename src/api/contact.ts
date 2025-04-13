import { z } from "zod";
import { supabase, useLocalStorageFallback } from "../lib/supabase";

// Define the contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  website: z.string().optional(),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Please tell us how we can help you (min 10 characters)",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Database function to save contact form data
export const saveContactForm = async (
  data: ContactFormValues,
): Promise<{ id: string }> => {
  console.log("Saving contact form data to database:", data);

  try {
    // Check if Supabase is configured, otherwise use localStorage
    if (useLocalStorageFallback()) {
      // Fallback to localStorage
      const existingData = localStorage.getItem("contactSubmissions");
      const submissions = existingData ? JSON.parse(existingData) : [];

      const newSubmission = {
        id: `contact-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        status: "new",
      };

      submissions.push(newSubmission);
      localStorage.setItem("contactSubmissions", JSON.stringify(submissions));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { id: newSubmission.id };
    } else {
      // Use Supabase
      const { data: insertedData, error } = await supabase
        .from("contact_submissions")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website || null,
          budget: data.budget,
          company: data.company || null,
          message: data.message,
          created_at: new Date().toISOString(),
          status: "new",
        })
        .select("id")
        .single();

      if (error) throw error;
      return { id: insertedData.id };
    }
  } catch (error) {
    console.error("Error saving contact form data:", error);
    throw new Error("Failed to save contact form data");
  }
};

// Function to send email notification
export const sendEmailNotification = async (
  data: ContactFormValues,
): Promise<void> => {
  console.log("Sending email notification for:", data);

  try {
    // Import the email service
    const { sendEmail, formatContactEmail } = await import(
      "../utils/emailService"
    );

    // Format the email content
    const emailOptions = formatContactEmail(data);

    // Send the email
    const success = await sendEmail(emailOptions);

    if (!success) {
      throw new Error("Failed to send email");
    }

    console.log("Email notification sent successfully");

    // Store in localStorage for demo purposes
    const existingEmails = localStorage.getItem("sentEmails");
    const emails = existingEmails ? JSON.parse(existingEmails) : [];
    emails.push({
      ...emailOptions,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem("sentEmails", JSON.stringify(emails));
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw new Error("Failed to send email notification");
  }
};

// Main handler function for contact form submissions
export const handleContactFormSubmission = async (data: ContactFormValues) => {
  try {
    // Validate the data
    contactFormSchema.parse(data);

    // Save to database
    const result = await saveContactForm(data);

    // Send email notification
    await sendEmailNotification(data);

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    throw error;
  }
};
