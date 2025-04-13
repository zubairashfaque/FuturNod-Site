import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, ArrowRight, Plus } from "lucide-react";
import { getBlogPosts, getCategories } from "../api/blog";
import { BlogPost, Category } from "../types/blog";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import BlogHeader from "./BlogHeader";

const BlogList = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedPosts, fetchedCategories] = await Promise.all([
          getBlogPosts({
            status: "published",
            search: searchTerm,
            categoryId: activeCategory !== "all" ? activeCategory : undefined,
          }),
          getCategories(),
        ]);
        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, activeCategory]);

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
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No posts match your search criteria"
                : activeCategory !== "all"
                  ? "No posts in this category"
                  : "There are no published posts yet"}
            </p>
            <Button onClick={() => navigate("/blog/create")}>
              Create your first post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {post.featuredImage && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {post.category.name}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {post.readTime} min read
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{post.author.name}</p>
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
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <span className="text-sm font-medium">Read Article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
