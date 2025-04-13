import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Calculates estimated reading time in minutes
 * @param content The content to calculate reading time for
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  const wordCount = textOnly.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime > 0 ? readTime : 1; // Minimum 1 minute
}
