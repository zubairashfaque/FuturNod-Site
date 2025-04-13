import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import BlogHeader from "./BlogHeader";
import { Search, ArrowRight } from "lucide-react";
import { getBlogPosts } from "../api/blog";
import { BlogPost } from "../types/blog";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Only fetch published posts for the public blog page
        const fetchedPosts = await getBlogPosts({
          status: "published",
          search: searchTerm,
          categoryId: activeCategory !== "all" ? activeCategory : undefined,
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, activeCategory]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  // Extract unique categories from posts
  const categories = [
    "all",
    ...new Set(posts.map((post) => post.category.slug.toLowerCase())),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "all" ||
      post.category.slug.toLowerCase() === activeCategory.toLowerCase();

    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} isOnBlogPage={true} />

      <main className="container mx-auto px-4 py-16">
        <BlogHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center">
            Insights, thoughts and perspectives on design, technology, and
            innovation.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 md:flex md:flex-row gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">Loading articles...</h3>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gray-50">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="capitalize bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {post.category.name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {post.readTime} min read
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-3 mt-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            post.publishedAt || post.createdAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group p-0 h-auto"
                      onClick={() => {
                        // Navigate to the blog post page using react-router
                        navigate(`/blog/${post.slug}`);
                      }}
                    >
                      <span className="text-sm font-medium">Read Article</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">No articles found</h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            className="gap-2 border-gray-300 hover:bg-gray-50"
            onClick={() => {
              // In a real implementation, this would load more articles
              console.log("Loading more articles...");
              // For now, just scroll to top as a placeholder action
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Load More Articles <ArrowRight className="h-4 w-4" />
          </Button>
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

export default BlogPage;
