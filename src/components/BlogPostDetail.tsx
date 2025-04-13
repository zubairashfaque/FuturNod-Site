import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import { getBlogPostBySlug } from "../api/blog";
import { BlogPost } from "../types/blog";
// Import React Markdown and only the essential plugins
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
// Import markdown styles
import '../styles/markdown.css';

interface BlogPostDetailProps {
  slug?: string;
}

const BlogPostDetail = (props: BlogPostDetailProps) => {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = props?.slug || slugParam;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        setPost(fetchedPost);
      } catch (err) {
        console.error(`Error fetching post with slug ${slug}:`, err);
        setError("Failed to load blog post. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to determine if content is mostly HTML
  const isHtmlContent = (content: string): boolean => {
    if (!content) return false;
    // More sophisticated check for HTML content
    const htmlTagCount = (content.match(/<[^>]+>/g) || []).length;
    const markdownSyntaxCount = (
      (content.match(/#{1,6}\s+/g) || []).length + // headings
      (content.match(/\*\*.*?\*\*/g) || []).length + // bold
      (content.match(/\*.*?\*/g) || []).length + // italic
      (content.match(/\[.*?\]\(.*?\)/g) || []).length + // links
      (content.match(/```[\s\S]*?```/g) || []).length + // code blocks
      (content.match(/^\s*-\s+/gm) || []).length // list items
    );
    
    return htmlTagCount > markdownSyntaxCount;
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

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error || !post ? (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">
              {error || "Blog post not found"}
            </h1>
            <p className="mb-8 text-gray-600">
              We couldn't find the blog post you're looking for.
            </p>
            <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
          </div>
        ) : (
          <article className="max-w-4xl mx-auto">
            {post.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden h-[400px]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>

              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{post.category.name}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              {/* Conditionally render content based on whether it's HTML or Markdown */}
              {post.content && isHtmlContent(post.content) ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <ReactMarkdown
                  className="markdown-body" // Use your markdown-body class
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {post.content}
                </ReactMarkdown>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
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
