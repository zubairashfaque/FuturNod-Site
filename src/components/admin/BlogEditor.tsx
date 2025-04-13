import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, AlertCircle, Save, Trash, Eye } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import EnvVariablesNotice from "../EnvVariablesNotice";
import { BlogPostFormData } from "../../types/blog";
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  getCategories,
  getTags,
} from "../../api/blog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Checkbox } from "../ui/checkbox";

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [],
    featuredImage: "",
    status: "draft",
    publishedAt: null,
  });

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
        setError("Failed to load categories and tags. Please try again later.");
      }
    };

    fetchCategoriesAndTags();
  }, []);

  // Fetch blog post data if editing
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/admin/login");
      return;
    }

    if (isEditing && id) {
      const fetchBlogPost = async () => {
        try {
          setIsLoading(true);
          const post = await getBlogPostById(id);
          if (post) {
            setFormData({
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              categoryId: post.category.id,
              tagIds: post.tags.map((tag) => tag.id),
              featuredImage: post.featuredImage,
              status: post.status,
              publishedAt: post.publishedAt,
            });
          } else {
            setError("Blog post not found");
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          setError("Failed to load blog post. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogPost();
    } else {
      setIsLoading(false);
    }
  }, [id, isEditing, navigate, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, tagIds: [...prev.tagIds, tagId] };
      } else {
        return { ...prev, tagIds: prev.tagIds.filter((id) => id !== tagId) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing && id) {
        await updateBlogPost(id, formData);
        setSuccess("Blog post updated successfully!");
      } else {
        await createBlogPost(formData);
        setSuccess("Blog post created successfully!");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      setError("Failed to save blog post. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Implement preview functionality
    console.log("Preview:", formData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Safety check - if no user is found after loading
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <EnvVariablesNotice />
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            You must be logged in to access this page. Redirecting to login...
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/admin/login")} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <EnvVariablesNotice />
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4 p-2"
          onClick={() => navigate("/admin/blog")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-gray-500">
            {isEditing
              ? "Update your blog post content and settings"
              : "Create a new blog post for your website"}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Enter a brief summary of your post"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="min-h-[300px]">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["blockquote", "code-block"],
                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  placeholder="Write your blog post content here..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
              {formData.featuredImage && (
                <div className="mt-2 border rounded-md overflow-hidden w-full max-w-xs">
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleSelectChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={formData.tagIds.includes(tag.id)}
                      onCheckedChange={(checked) =>
                        handleTagChange(tag.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange(
                    "status",
                    value as "draft" | "published" | "scheduled",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <div className="space-x-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
