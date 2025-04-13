import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Create a single supabase client for interacting with your database
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

// Flag to track if we're using real credentials or placeholders
const usingPlaceholders =
  !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (usingPlaceholders) {
  console.warn(
    "Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for database functionality.",
  );
}

// Create the client with either real or placeholder values
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !usingPlaceholders;
};

// Fallback to localStorage if Supabase is not configured
export const useLocalStorageFallback = (): boolean => {
  return usingPlaceholders;
};
