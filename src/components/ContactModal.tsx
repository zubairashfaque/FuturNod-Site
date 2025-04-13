import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

interface ContactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ContactModal = ({
  isOpen = false,
  onClose = () => {},
}: ContactModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      budget: "",
      company: "",
      message: "",
    },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check if using localStorage fallback
  useEffect(() => {
    import("../lib/supabase").then(({ useLocalStorageFallback }) => {
      setIsUsingLocalStorage(useLocalStorageFallback());
    });
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Import the contact API handler
      const { handleContactFormSubmission } = await import("../api/contact");

      // Send data to the API handler
      const result = await handleContactFormSubmission(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit form");
      }

      console.log("Form submitted successfully:", data);
      console.log("Response:", result);

      // Show success state
      setIsSuccess(true);

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIsSuccess(false);
      onClose();
    }
  };

  const handleClearForm = () => {
    form.reset();
  };

  const budgetOptions = [
    { value: "under-5k", label: "Under $5,000" },
    { value: "5k-10k", label: "$5,000 - $10,000" },
    { value: "10k-25k", label: "$10,000 - $25,000" },
    { value: "25k-50k", label: "$25,000 - $50,000" },
    { value: "50k-plus", label: "$50,000+" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-none bg-white p-6 shadow-xl"
          >
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Let's talk!</h2>
              <p className="text-sm text-gray-600">
                The goal of this call is to understand your business and discuss
                how tailored AI solutions can enhance it.
              </p>
              {isUsingLocalStorage && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
                  Note: Currently using local storage. Set up Supabase for
                  database storage.
                </div>
              )}
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for reaching out. We'll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Name *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Phone *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          What is your budget for this project? *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount in USD" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Company (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          How can we help you? *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                      {submitError}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearForm}
                      className="text-sm"
                      disabled={isSubmitting}
                    >
                      Clear form
                    </Button>
                    <Button
                      type="submit"
                      className="bg-black hover:bg-black/90 text-white px-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span>Submit</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
