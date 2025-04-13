import { handleContactFormSubmission, ContactFormValues } from "./contact";
import { Category, Tag } from "../types/blog";

// This file simulates a backend server for local development
// In a real application, these would be actual API endpoints

// Mock categories
export const mockCategories: Category[] = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Business", slug: "business" },
  { id: "3", name: "Design", slug: "design" },
  { id: "4", name: "Marketing", slug: "marketing" },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: "1", name: "React", slug: "react" },
  { id: "2", name: "JavaScript", slug: "javascript" },
  { id: "3", name: "UI/UX", slug: "ui-ux" },
  { id: "4", name: "Web Development", slug: "web-development" },
  { id: "5", name: "Mobile", slug: "mobile" },
];

// Setup mock API handlers
export const setupMockServer = () => {
  // Mock fetch for contact form submissions
  const originalFetch = window.fetch;
  window.fetch = async (url, options) => {
    if (url === "/api/contact" && options?.method === "POST") {
      try {
        const data = JSON.parse(options.body as string) as ContactFormValues;
        const result = await handleContactFormSubmission(data);

        return {
          ok: true,
          status: 200,
          json: async () => result,
        } as Response;
      } catch (error) {
        console.error("Mock server error:", error);
        return {
          ok: false,
          status: 400,
          json: async () => ({ error: "Invalid form data" }),
        } as Response;
      }
    }

    // For all other requests, use the original fetch
    return originalFetch(url, options);
  };

  console.log("Mock API server initialized");
};
