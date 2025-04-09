import React, { useState } from "react";
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
import { Search, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: number;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of AI in Design",
    excerpt:
      "Exploring how artificial intelligence is transforming the design industry and what it means for designers.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    date: "May 15, 2023",
    category: "Technology",
    tags: ["AI", "Design", "Future"],
    imageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    readTime: 5,
  },
  {
    id: "2",
    title: "Sustainable Web Development Practices",
    excerpt:
      "How to reduce the carbon footprint of your web applications while maintaining performance.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    date: "June 2, 2023",
    category: "Development",
    tags: ["Sustainability", "Web Development", "Performance"],
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    readTime: 7,
  },
  {
    id: "3",
    title: "User Experience in the Age of Voice Interfaces",
    excerpt:
      "How voice-controlled interfaces are changing the way we think about user experience design.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    date: "July 10, 2023",
    category: "UX Design",
    tags: ["Voice UI", "UX", "Design Trends"],
    imageUrl:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800&q=80",
    readTime: 4,
  },
  {
    id: "4",
    title: "The Rise of AI-Powered Automation",
    excerpt:
      "How businesses are leveraging artificial intelligence to automate processes and increase efficiency.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    date: "August 5, 2023",
    category: "Technology",
    tags: ["AI", "Automation", "Business"],
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    readTime: 6,
  },
  {
    id: "5",
    title: "Designing for Accessibility",
    excerpt:
      "Best practices for creating inclusive digital experiences that work for everyone.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "Michael Wong",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    date: "September 12, 2023",
    category: "Design",
    tags: ["Accessibility", "Inclusive Design", "UX"],
    imageUrl:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    readTime: 8,
  },
  {
    id: "6",
    title: "The Future of Web3 and Decentralized Applications",
    excerpt:
      "Exploring the potential of blockchain technology and decentralized applications in reshaping the internet.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "David Park",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    date: "October 3, 2023",
    category: "Blockchain",
    tags: ["Web3", "Blockchain", "Decentralization"],
    imageUrl:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
    readTime: 9,
  },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    "all",
    "technology",
    "development",
    "design",
    "ux design",
    "blockchain",
  ];

  const handleContactClick = () => {
    console.log("Contact clicked");
    // Will implement modal opening logic later
  };

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      activeCategory === "all" ||
      post.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <main className="container mx-auto px-4 py-16">
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

        {filteredPosts.length > 0 ? (
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
                      src={post.imageUrl}
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
                        {post.category}
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
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group p-0 h-auto"
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
          >
            Load More Articles <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
