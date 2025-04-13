// src/components/CreateBlog.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import EnvVariablesNotice from "./EnvVariablesNotice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X, Calendar, Image, AlertTriangle } from "lucide-react";
import { createBlogPost, getCategories, getTags } from "../api/blog";
import { Category, Tag, BlogPostFormData } from "../types/blog";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    }
  }, [user, navigate]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [],
    featuredImage:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    status: "draft",
    publishedAt: null,
  });

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        console.log("Fetching categories and tags...");
        const [fetchedCategories, fetchedTags] = await Promise.all([
          getCategories(),
          getTags(),
        ]);

        console.log("Categories:", fetchedCategories);
        console.log("Tags:", fetchedTags);

        setCategories(fetchedCategories);
        setTags(fetchedTags);

        // Set default category if available
        if (fetchedCategories.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({
            ...prev,
            categoryId: fetchedCategories[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
        setError("Failed to load categories and tags. Please try again.");
      }
    };

    fetchCategoriesAndTags();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tagIds: selectedTags }));
  }, [selectedTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.excerpt.trim()) {
        throw new Error("Excerpt is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }
      if (!formData.categoryId) {
        throw new Error("Category is required");
      }

      console.log("Submitting form data:", formData);

      // Save featured image to localStorage for persistence
      try {
        if (formData.featuredImage) {
          localStorage.setItem("lastUsedFeaturedImage", formData.featuredImage);
        }
      } catch (storageError) {
        console.warn(
          "Could not save featured image to localStorage:",
          storageError,
        );
        // Continue anyway - this is not critical
      }

      // Clear localStorage if it might be corrupted
      try {
        const testStorage = localStorage.getItem("blog_posts");
        if (
          testStorage &&
          (testStorage === "undefined" || testStorage === "null")
        ) {
          console.warn("Detected corrupted localStorage, clearing it");
          localStorage.removeItem("blog_posts");
        }
      } catch (e) {
        console.warn("Error checking localStorage:", e);
      }

      console.log("Calling createBlogPost with data:", {
        ...formData,
        content:
          formData.content.length > 100
            ? `${formData.content.substring(0, 100)}... (truncated for logging)`
            : formData.content,
      });

      const newPost = await createBlogPost(formData);
      console.log("Created post successfully:", newPost.id);

      // Navigate to the blog post
      navigate(`/blog/${newPost.slug}`);
    } catch (error) {
      console.error("Error creating blog post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create blog post. Please try again with a smaller image or less content.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <EnvVariablesNotice />
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Blog Post
            </CardTitle>
          </CardHeader>

          {error && (
            <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
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
                  placeholder="Brief summary of your blog post"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="min-h-[300px] border rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleEditorChange}
                    placeholder="Write your blog content here..."
                    modules={modules}
                    className="h-[250px] mb-12"
                  />
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Use fewer images to reduce content size</span>
                  <span>
                    Size:{" "}
                    {formData.content
                      ? (new Blob([formData.content]).size / 1024).toFixed(2)
                      : 0}
                    KB
                    {formData.content &&
                      new Blob([formData.content]).size > 800 * 1024 && (
                        <span className="text-amber-600 ml-2">
                          ⚠️ Approaching size limit
                        </span>
                      )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Convert to base64 for storage
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              // Check if image is too large
                              if (result.length > 1000000) {
                                // Use a smaller version
                                const img = new Image();
                                img.onload = function () {
                                  const canvas =
                                    document.createElement("canvas");
                                  const ctx = canvas.getContext("2d");
                                  // Resize to smaller dimensions
                                  const maxWidth = 800;
                                  const maxHeight = 600;
                                  let width = img.width;
                                  let height = img.height;

                                  if (width > height) {
                                    if (width > maxWidth) {
                                      height *= maxWidth / width;
                                      width = maxWidth;
                                    }
                                  } else {
                                    if (height > maxHeight) {
                                      width *= maxHeight / height;
                                      height = maxHeight;
                                    }
                                  }

                                  canvas.width = width;
                                  canvas.height = height;
                                  ctx?.drawImage(img, 0, 0, width, height);

                                  // Get compressed image
                                  const compressedImage = canvas.toDataURL(
                                    "image/jpeg",
                                    0.7,
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    featuredImage: compressedImage,
                                  }));
                                };
                                img.src = result;
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  featuredImage: result,
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="relative z-0 flex items-center gap-1"
                      >
                        <Image className="h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter a URL or upload an image file (max 2MB)
                  </p>
                </div>
                {formData.featuredImage && (
                  <div className="mt-2 border rounded-md overflow-hidden h-40">
                    <img
                      src={formData.featuredImage}
                      alt="Featured preview"
                      className="w-full h-full object-cover"
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
                    {categories.length === 0 ? (
                      <SelectItem value="loading" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[60px]">
                  {tags.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">
                      No tags available
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          selectedTags.includes(tag.id) ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleTagSelect(tag.id)}
                      >
                        {tag.name}
                        {selectedTags.includes(tag.id) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))
                  )}
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

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/blog")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Blog Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default CreateBlog;
