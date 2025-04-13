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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { UserPlus, AlertCircle, CheckCircle, User, Key } from "lucide-react";
import { createAdminUser } from "../../lib/dbAuth";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const AdminUserSettings = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    setIsSupabaseConnected(isSupabaseConfigured());
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsCreating(true);

    try {
      // Validate inputs
      if (!username.trim()) {
        throw new Error("Username is required");
      }

      if (!password.trim()) {
        throw new Error("Password is required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Create the admin user
      const result = await createAdminUser({
        username,
        password,
        role: "admin",
      });

      if (result.success) {
        setSuccess("Admin user created successfully!");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(
          "Failed to create admin user. Username may already exist.",
        );
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Admin User Management
        </CardTitle>
        <CardDescription>
          Create and manage admin users for your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupabaseConnected && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Using Local Storage
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              You are currently using localStorage for admin user storage.
              Connect to Supabase for persistent database storage.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isCreating}>
            {isCreating ? (
              <>
                <span className="animate-spin">⏳</span> Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Create Admin User
              </>
            )}
          </Button>
        </form>

        <Separator />

        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1">
                Default Admin Credentials
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                For demo purposes, the default admin credentials are:
              </p>
              <div className="font-mono text-xs bg-gray-200 p-2 rounded">
                <p>Username: admin</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUserSettings;
