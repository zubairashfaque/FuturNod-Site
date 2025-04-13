import { ContactFormValues } from "../api/contact";

// This is a utility service for sending emails
// In a production environment, you would integrate with a real email service
// like SendGrid, Mailgun, AWS SES, etc.

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

// Mock function to simulate sending an email
// In production, replace this with actual email service API calls
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  console.log("SENDING EMAIL:", options);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In production, you would call your email service API here
  // For example, with SendGrid:
  // return sendgrid.send(options);

  // For now, we'll just log and return success
  return true;
};

// Helper function to format contact form data into an email
export const formatContactEmail = (data: ContactFormValues): EmailOptions => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@futurnod.com";

  const text = `
    New Contact Form Submission
    --------------------------
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Website: ${data.website || "Not provided"}
    Budget: ${data.budget}
    Company: ${data.company || "Not provided"}
    
    Message:
    ${data.message}
    
    Submitted at: ${new Date().toLocaleString()}
  `;

  const html = `
    <h2>New Contact Form Submission</h2>
    <table border="0" cellpadding="5">
      <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
      <tr><td><strong>Website:</strong></td><td>${data.website || "Not provided"}</td></tr>
      <tr><td><strong>Budget:</strong></td><td>${data.budget}</td></tr>
      <tr><td><strong>Company:</strong></td><td>${data.company || "Not provided"}</td></tr>
    </table>
    
    <h3>Message:</h3>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
    
    <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
  `;

  return {
    to: adminEmail,
    from: "noreply@futurnod.com",
    subject: `New Contact Form Submission from ${data.name}`,
    text,
    html,
  };
};
