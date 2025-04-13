import React from "react";
import { isSupabaseConfigured } from "../lib/supabase";

const EnvVariablesNotice = () => {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        Supabase Configuration Required
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        To use Supabase for database storage, please set the following
        environment variables:
      </p>
      <ul className="list-disc pl-5 text-sm text-yellow-700 mb-4">
        <li>VITE_SUPABASE_URL - Your Supabase project URL</li>
        <li>VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key</li>
      </ul>
      <p className="text-sm text-yellow-700">
        Currently using localStorage as a fallback.
      </p>
    </div>
  );
};

export default EnvVariablesNotice;
