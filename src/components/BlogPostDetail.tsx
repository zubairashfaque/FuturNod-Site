import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import { getBlogPostBySlug } from "../api/blog";
import { BlogPost } from "../types/blog";

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Post not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header onContactClick={handleContactClick} />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            {error || "Post not found"}
          </h1>
          <p className="mb-8 text-gray-600">
            We couldn't find the blog post you're looking for.
          </p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
        <Footer />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    );
  }

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

        <article className="max-w-4xl mx-auto">
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                {post.category.name}
              </Badge>
              {post.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(
                    post.publishedAt || post.createdAt,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div>{post.readTime} min read</div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex items-center gap-4 mb-8">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">Written by {post.author.name}</h3>
                <p className="text-gray-600">
                  {post.author.bio || "Author at Futurnod"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">
                Subscribe to our newsletter
              </h3>
              <p className="mb-6">
                Stay updated with our latest insights and news delivered
                straight to your inbox.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleContactClick}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </article>
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
