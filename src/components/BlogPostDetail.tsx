import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";

interface BlogPostDetailProps {
  slug?: string;
}

const BlogPostDetail = (props: BlogPostDetailProps) => {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = props?.slug || slugParam;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <main className="container mx-auto px-4 py-32">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Button>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">
            Blog Post Detail is being rebuilt
          </h1>
          <p className="mb-8 text-gray-600">
            We're currently rebuilding our blog system to provide you with a
            better experience. Please check back soon.
          </p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </main>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default BlogPostDetail;
