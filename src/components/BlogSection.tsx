import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  image: string;
  readTime: number;
}

interface BlogSectionProps {
  posts?: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts = defaultPosts }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "technology", "design", "business", "development"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleReadArticle = (postId: string) => {
    // Use navigate instead of direct window.location to ensure proper routing
    navigate(`/blog/${postId}`);
  };

  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Blog
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Insights, thoughts and stories from our team
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
              <Button variant="ghost" size="icon" className="ml-1">
                <Filter className="h-4 w-4" />
              </Button>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full overflow-hidden border-0 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="capitalize">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {post.author.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {post.publishDate}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleReadArticle(post.id)}
                      >
                        Read <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-12">
              <p className="text-muted-foreground">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="gap-2">
              View all articles <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2023",
    excerpt:
      "Explore the cutting-edge technologies and methodologies that are shaping the future of web development.",
    content: "",
    publishDate: "May 15, 2023",
    author: {
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    category: "technology",
    tags: ["webdev", "trends", "technology"],
    image:
      "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&q=80",
    readTime: 6,
  },
  {
    id: "2",
    title: "Designing for Accessibility: Best Practices for Inclusive UX",
    excerpt:
      "Learn how to create digital experiences that are accessible to all users, regardless of ability or disability.",
    content: "",
    publishDate: "June 3, 2023",
    author: {
      name: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha",
    },
    category: "design",
    tags: ["accessibility", "ux", "design"],
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
    readTime: 8,
  },
  {
    id: "3",
    title: "How AI is Transforming Digital Marketing Strategies",
    excerpt:
      "Discover the ways artificial intelligence is revolutionizing how businesses approach digital marketing.",
    content: "",
    publishDate: "June 22, 2023",
    author: {
      name: "Marcus Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    },
    category: "business",
    tags: ["ai", "marketing", "business"],
    image:
      "https://images.unsplash.com/photo-1581089781785-603411fa81e5?w=800&q=80",
    readTime: 5,
  },
  {
    id: "4",
    title: "Building Scalable Applications with Microservices Architecture",
    excerpt:
      "A comprehensive guide to implementing microservices for more resilient and scalable applications.",
    content: "",
    publishDate: "July 8, 2023",
    author: {
      name: "Priya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    },
    category: "development",
    tags: ["microservices", "architecture", "development"],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    readTime: 10,
  },
  {
    id: "5",
    title: "The Psychology of Color in Digital Branding",
    excerpt:
      "Understanding how color choices impact user perception and brand identity in the digital space.",
    content: "",
    publishDate: "July 19, 2023",
    author: {
      name: "David Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    category: "design",
    tags: ["branding", "psychology", "design"],
    image:
      "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800&q=80",
    readTime: 7,
  },
  {
    id: "6",
    title: "Securing Your Web Applications: Essential Practices",
    excerpt:
      "Learn the critical security measures every developer should implement to protect web applications.",
    content: "",
    publishDate: "August 5, 2023",
    author: {
      name: "Jordan Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    },
    category: "development",
    tags: ["security", "webdev", "development"],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    readTime: 9,
  },
];

export default BlogSection;
