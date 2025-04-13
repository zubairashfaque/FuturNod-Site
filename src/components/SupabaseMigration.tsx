import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { CheckCircle, AlertCircle, ArrowRight, Database } from "lucide-react";
import {
  migrateDataToSupabase,
  MigrationStatus,
  hasMigratableData,
} from "../utils/migrationUtils";
import { isSupabaseConfigured } from "../lib/supabase";

const SupabaseMigration = () => {
  const [migrationStatus, setMigrationStatus] =
    useState<MigrationStatus | null>(null);
  const [canMigrate, setCanMigrate] = useState<boolean>(false);
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(false);

  useEffect(() => {
    // Check if Supabase is configured
    setIsSupabaseReady(isSupabaseConfigured());

    // Check if there's data to migrate
    setCanMigrate(hasMigratableData());
  }, []);

  const handleMigration = async () => {
    if (!isSupabaseReady) {
      alert("Please configure Supabase before migrating data.");
      return;
    }

    try {
      await migrateDataToSupabase(setMigrationStatus);
    } catch (error) {
      console.error("Migration failed:", error);
      setMigrationStatus((prev) =>
        prev
          ? {
              ...prev,
              inProgress: false,
              error: error instanceof Error ? error.message : String(error),
            }
          : null,
      );
    }
  };

  const getTotalMigratedItems = () => {
    if (!migrationStatus) return 0;
    const { blogPosts, categories, tags, contactSubmissions } =
      migrationStatus.stats;
    return blogPosts + categories + tags + contactSubmissions;
  };

  if (!canMigrate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Migration</CardTitle>
          <CardDescription>
            Migrate localStorage data to Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No data to migrate</AlertTitle>
            <AlertDescription>
              There is no data in localStorage that needs to be migrated to
              Supabase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> Data Migration
        </CardTitle>
        <CardDescription>
          Migrate your data from localStorage to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseReady ? (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Supabase not configured
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              Please set up your Supabase credentials in the environment
              variables before migrating data.
            </AlertDescription>
          </Alert>
        ) : null}

        {migrationStatus?.error ? (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Migration Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {migrationStatus.error}
            </AlertDescription>
          </Alert>
        ) : null}

        {migrationStatus?.completed ? (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Migration Complete
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully migrated {getTotalMigratedItems()} items to Supabase.
            </AlertDescription>
          </Alert>
        ) : null}

        {migrationStatus?.inProgress ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Migration in progress...</span>
                <span>Please don't close this page</span>
              </div>
              <Progress
                value={migrationStatus.completed ? 100 : 50}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Blog Categories</p>
                <p className="text-gray-500">
                  {migrationStatus.stats.categories} migrated
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Blog Tags</p>
                <p className="text-gray-500">
                  {migrationStatus.stats.tags} migrated
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Blog Posts</p>
                <p className="text-gray-500">
                  {migrationStatus.stats.blogPosts} migrated
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Contact Submissions</p>
                <p className="text-gray-500">
                  {migrationStatus.stats.contactSubmissions} migrated
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!migrationStatus?.inProgress && !migrationStatus?.completed ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You have data stored in localStorage that can be migrated to your
              Supabase database. This includes blog posts, categories, tags, and
              contact form submissions.
            </p>

            <div className="rounded-md border p-4 bg-gray-50">
              <h4 className="font-medium mb-2 text-sm">Data to be migrated:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Blog categories and tags
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Blog posts and their
                  relationships
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Contact form submissions
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleMigration}
          disabled={
            !isSupabaseReady ||
            migrationStatus?.inProgress ||
            migrationStatus?.completed
          }
        >
          {migrationStatus?.completed
            ? "Migration Complete"
            : migrationStatus?.inProgress
              ? "Migrating..."
              : "Start Migration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseMigration;
