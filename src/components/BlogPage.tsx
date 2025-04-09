import React from "react";
import { Button } from "./ui/button";
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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of AI in Design",
    excerpt:
      "Exploring how artificial intelligence is transforming the design industry and what it means for designers.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Jane Smith",
    date: "May 15, 2023",
    category: "Technology",
    tags: ["AI", "Design", "Future"],
    imageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  },
  {
    id: "2",
    title: "Sustainable Web Development Practices",
    excerpt:
      "How to reduce the carbon footprint of your web applications while maintaining performance.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "John Doe",
    date: "June 2, 2023",
    category: "Development",
    tags: ["Sustainability", "Web Development", "Performance"],
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  },
  {
    id: "3",
    title: "User Experience in the Age of Voice Interfaces",
    excerpt:
      "How voice-controlled interfaces are changing the way we think about user experience design.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Alex Johnson",
    date: "July 10, 2023",
    category: "UX Design",
    tags: ["Voice UI", "UX", "Design Trends"],
    imageUrl:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800&q=80",
  },
];

const BlogPage = () => {
  const handleContactClick = () => {
    console.log("Contact clicked");
    // Will implement modal opening logic later
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Insights, thoughts and perspectives on design, technology, and
            innovation.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MOCK_POSTS.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      By {post.author}
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:w-1/4">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-800 hover:text-gray-600">
                        Technology (5)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-800 hover:text-gray-600">
                        Design (8)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-800 hover:text-gray-600">
                        Development (12)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-800 hover:text-gray-600">
                        UX (4)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-800 hover:text-gray-600">
                        Innovation (7)
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Design
                    </Button>
                    <Button variant="outline" size="sm">
                      AI
                    </Button>
                    <Button variant="outline" size="sm">
                      Web
                    </Button>
                    <Button variant="outline" size="sm">
                      UX
                    </Button>
                    <Button variant="outline" size="sm">
                      Mobile
                    </Button>
                    <Button variant="outline" size="sm">
                      Trends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
