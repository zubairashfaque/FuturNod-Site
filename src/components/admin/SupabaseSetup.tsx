import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckCircle, AlertCircle, Database, Table, Code } from "lucide-react";
import { isSupabaseConfigured } from "../../lib/supabase";
import SupabaseMigration from "../SupabaseMigration";
import EmailSettings from "./EmailSettings";
import AdminUserSettings from "./AdminUserSettings";

const SupabaseSetup = () => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" /> Supabase Setup
          </h1>
          <p className="text-gray-500 mt-2">
            Configure and manage your Supabase database connection
          </p>
        </div>

        <Tabs defaultValue="status">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="status">Connection Status</TabsTrigger>
            <TabsTrigger value="tables">Database Tables</TabsTrigger>
            <TabsTrigger value="migration">Data Migration</TabsTrigger>
            <TabsTrigger value="email">Email Settings</TabsTrigger>
            <TabsTrigger value="admin">Admin Users</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Check your Supabase connection status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConfigured ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Connected to Supabase
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your application is successfully connected to Supabase.
                      All data will be stored in your Supabase database.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">
                      Not Connected
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Your application is not connected to Supabase. Please set
                      the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
                      environment variables.
                      <div className="mt-2">
                        Currently using localStorage as a fallback for data
                        storage.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-6 rounded-md border p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Environment Variables</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div>
                      <span className="text-gray-500">VITE_SUPABASE_URL:</span>{" "}
                      <span>{isConfigured ? "✓ Set" : "✗ Not Set"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        VITE_SUPABASE_ANON_KEY:
                      </span>{" "}
                      <span>{isConfigured ? "✓ Set" : "✗ Not Set"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Status
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" /> Required Database Tables
                </CardTitle>
                <CardDescription>
                  These tables need to be created in your Supabase database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Blog System Tables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">
                          blog_categories
                        </h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>name (text, not null)</li>
                          <li>slug (text, not null)</li>
                          <li>description (text)</li>
                          <li>created_at (timestamp with time zone)</li>
                        </ul>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">blog_tags</h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>name (text, not null)</li>
                          <li>slug (text, not null)</li>
                          <li>created_at (timestamp with time zone)</li>
                        </ul>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">blog_posts</h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>title (text, not null)</li>
                          <li>slug (text, not null)</li>
                          <li>excerpt (text, not null)</li>
                          <li>content (text, not null)</li>
                          <li>author_id (uuid, references authors.id)</li>
                          <li>published_at (timestamp with time zone)</li>
                          <li>updated_at (timestamp with time zone)</li>
                          <li>created_at (timestamp with time zone)</li>
                          <li>status (text, not null)</li>
                          <li>
                            category_id (uuid, references blog_categories.id)
                          </li>
                          <li>featured_image (text)</li>
                          <li>read_time (integer)</li>
                        </ul>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">
                          blog_posts_tags
                        </h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>post_id (uuid, references blog_posts.id)</li>
                          <li>tag_id (uuid, references blog_tags.id)</li>
                          <li>Primary key: (post_id, tag_id)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Other Required Tables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">authors</h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>name (text, not null)</li>
                          <li>avatar (text)</li>
                          <li>created_at (timestamp with time zone)</li>
                        </ul>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">
                          contact_submissions
                        </h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>name (text, not null)</li>
                          <li>email (text, not null)</li>
                          <li>phone (text, not null)</li>
                          <li>website (text)</li>
                          <li>budget (text, not null)</li>
                          <li>company (text)</li>
                          <li>message (text, not null)</li>
                          <li>created_at (timestamp with time zone)</li>
                          <li>status (text, not null)</li>
                        </ul>
                      </div>
                      <div className="rounded-md border p-3">
                        <h4 className="font-medium text-sm mb-2">usecases</h4>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>id (uuid, primary key)</li>
                          <li>title (text, not null)</li>
                          <li>description (text, not null)</li>
                          <li>content (text, not null)</li>
                          <li>industry (text, not null)</li>
                          <li>category (text, not null)</li>
                          <li>image_url (text)</li>
                          <li>status (text, not null)</li>
                          <li>created_at (timestamp with time zone)</li>
                          <li>updated_at (timestamp with time zone)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">SQL Script</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                      <pre>
                        {`-- Create authors table
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES authors(id),
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  featured_image TEXT,
  read_time INTEGER
);

-- Create blog_posts_tags junction table
CREATE TABLE blog_posts_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  budget TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL
);

-- Create usecases table
CREATE TABLE usecases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration" className="mt-6">
            <SupabaseMigration />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailSettings />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminUserSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupabaseSetup;
