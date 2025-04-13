import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search } from "lucide-react";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import BlogHeader from "./BlogHeader";

const BlogList = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} isOnBlogPage={true} />

      <div className="container mx-auto px-4 py-32">
        <BlogHeader />

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 md:flex md:flex-row gap-1">
              <TabsTrigger key="all" value="all">
                All
              </TabsTrigger>
              <TabsTrigger key="technology" value="technology">
                Technology
              </TabsTrigger>
              <TabsTrigger key="design" value="design">
                Design
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Blog System Under Construction
          </h3>
          <p className="text-gray-600 mb-6">
            We're currently rebuilding our blog system to provide you with a
            better experience. Please check back soon.
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default BlogList;
