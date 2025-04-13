import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Database,
  FileText,
} from "lucide-react";
import { getBlogPosts, deleteBlogPost } from "../../api/blog";
import { BlogPost } from "../../types/blog";
import { useAuth } from "../auth/AuthContext";
import Header from "../header";
import Footer from "../footer";
import ContactModal from "../ContactModal";

const BlogAdmin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getBlogPosts();
      // Filter by status if tab is not 'all'
      const filteredPosts =
        activeTab === "all"
          ? fetchedPosts
          : fetchedPosts.filter((post) => post.status === activeTab);

      // Filter by search term if provided
      const searchFilteredPosts = searchTerm
        ? filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              post.tags.some((tag) =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
              ),
          )
        : filteredPosts;

      setPosts(searchFilteredPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBlogPost(postToDelete);
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPost = (postId: string) => {
    navigate(`/admin/blog/edit/${postId}`);
  };

  const handleViewPost = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4 p-2"
              onClick={() => navigate("/admin/AdminDashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Blog Post Management</h1>
              <p className="text-gray-500">
                Create, edit, and manage your blog posts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 mr-2">
              Logged in as <span className="font-medium">{user?.username}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/supabase")}
              className="gap-2"
            >
              <Database className="h-4 w-4" /> Database Setup
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search blog posts..."
              className="pl-10 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <Button onClick={() => navigate("/admin/blog/new")} className="gap-2">
            <Plus className="h-4 w-4" /> New Blog Post
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No blog posts found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "No blog posts match your search criteria"
                    : activeTab !== "all"
                      ? `You don't have any ${activeTab} blog posts yet`
                      : "You haven't created any blog posts yet"}
                </p>
                <Button
                  onClick={() => navigate("/admin/blog/new")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Create your first blog post
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Author
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">
                    Created
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <div className="h-10 w-10 overflow-hidden rounded">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "outline"
                        }
                        className={
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <div className="h-6 w-6 rounded-full overflow-hidden">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {post.category.name}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleViewPost(post.slug)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleEditPost(post.id)}
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <AlertDialog
                          open={postToDelete === post.id}
                          onOpenChange={(open) =>
                            !open && setPostToDelete(null)
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setPostToDelete(post.id)}
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the blog post "{post.title}"
                                and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeletePost}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default BlogAdmin;
