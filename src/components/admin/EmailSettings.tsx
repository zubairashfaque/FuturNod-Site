import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Mail, Send, Settings, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { formatContactEmail, sendEmail } from "../../utils/emailService";

const EmailSettings = () => {
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("adminEmail") || "",
  );
  const [testEmailStatus, setTestEmailStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveEmail = () => {
    localStorage.setItem("adminEmail", adminEmail);
    alert("Admin email saved successfully!");
  };

  const handleSendTestEmail = async () => {
    if (!adminEmail) {
      setErrorMessage("Please enter an admin email address first");
      setTestEmailStatus("error");
      return;
    }

    setTestEmailStatus("sending");
    setErrorMessage("");

    try {
      // Create a test contact form submission
      const testData = {
        name: "Test User",
        email: "test@example.com",
        phone: "+1 555-123-4567",
        website: "https://example.com",
        budget: "$5,000 - $10,000",
        company: "Test Company",
        message:
          "This is a test message to verify email notifications are working correctly.",
      };

      // Format the email
      const emailOptions = formatContactEmail(testData);

      // Override the recipient with the admin email
      emailOptions.to = adminEmail;

      // Send the test email
      const success = await sendEmail(emailOptions);

      if (success) {
        setTestEmailStatus("success");
      } else {
        throw new Error("Failed to send test email");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      setTestEmailStatus("error");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Email Notifications
        </CardTitle>
        <CardDescription>
          Configure email settings for contact form submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Admin Email Address</Label>
          <div className="flex gap-2">
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@yourcompany.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveEmail}>Save</Button>
          </div>
          <p className="text-xs text-gray-500">
            Contact form submissions will be sent to this email address
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Test Email Configuration</h3>
          <p className="text-xs text-gray-500">
            Send a test email to verify your configuration is working correctly
          </p>

          {testEmailStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <Send className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Test Email Sent
              </AlertTitle>
              <AlertDescription className="text-green-700">
                A test email has been sent to {adminEmail}. Please check your
                inbox.
              </AlertDescription>
            </Alert>
          )}

          {testEmailStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                Error Sending Email
              </AlertTitle>
              <AlertDescription className="text-red-700">
                {errorMessage ||
                  "Failed to send test email. Please check your configuration."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSendTestEmail}
            disabled={testEmailStatus === "sending"}
            className="w-full gap-2"
          >
            {testEmailStatus === "sending" ? (
              <>
                <span className="animate-spin">⏳</span> Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Test Email
              </>
            )}
          </Button>
        </div>

        <Separator />

        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1">
                Email Service Integration
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                For production use, integrate with an email service provider
                like SendGrid, Mailgun, or AWS SES.
              </p>
              <p className="text-xs text-gray-500">
                Edit the{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">
                  src/utils/emailService.ts
                </code>{" "}
                file to configure your email service provider.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
