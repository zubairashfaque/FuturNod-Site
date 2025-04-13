import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { FileText, Users, Settings, ArrowLeft } from "lucide-react";
import Header from "../header";
import Footer from "../footer";
import ContactModal from "../ContactModal";
import { useAuth } from "../auth/AuthContext";
import BlogDashboard from "./BlogDashboard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("blog");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Logged in as {user?.username || "admin"}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/supabase")}
            >
              Database Setup
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/login")}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="blog"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Blog Post Management
            </TabsTrigger>
            <TabsTrigger value="usecases" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Use Case Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                  <span>Blog Post Management</span>
                  <Button
                    onClick={() => navigate("/admin/blog")}
                    className="flex items-center gap-2"
                  >
                    Manage Blog Posts
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    Manage your blog posts, create new content, and organize
                    your articles
                  </p>
                  <Button
                    onClick={() => navigate("/admin/blog")}
                    className="mx-auto"
                  >
                    Go to Blog Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usecases">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                  <span>Use Case Management</span>
                  <Button
                    onClick={() => navigate("/admin/usecases/new")}
                    className="flex items-center gap-2"
                  >
                    New Use Case
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Button
                    onClick={() => navigate("/admin/usecases")}
                    className="mx-auto"
                  >
                    Go to Use Cases Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
