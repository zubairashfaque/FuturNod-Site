import React from "react";
import { isSupabaseConfigured } from "../lib/supabase";

const EnvVariablesNotice = () => {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Supabase Configuration Required
      </h3>
      <p className="text-sm text-red-700 mb-4">
        This application requires Supabase for database storage. Please set the
        following environment variables:
      </p>
      <ul className="list-disc pl-5 text-sm text-red-700 mb-4">
        <li>VITE_SUPABASE_URL - Your Supabase project URL</li>
        <li>VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key</li>
      </ul>
      <p className="text-sm text-red-700 font-semibold">
        The application will not function correctly without these settings.
      </p>
    </div>
  );
};

export default EnvVariablesNotice;
