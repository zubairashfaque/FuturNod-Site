import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ArrowLeft, Save, Image, Calendar } from "lucide-react";
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  getCategories,
  getTags,
} from "../../api/blog";
import { BlogPostFormData, Category, Tag } from "../../types/blog";

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

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "color",
  "background",
  "link",
  "image",
];

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and tags
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        // If editing, fetch the post data
        if (isEditing && id) {
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
            setSelectedTags(post.tags);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "draft" | "published" | "scheduled",
    }));
  };

  const handleTagToggle = (tag: Tag) => {
    const isSelected = formData.tagIds.includes(tag.id);
    let newTagIds: string[];

    if (isSelected) {
      newTagIds = formData.tagIds.filter((id) => id !== tag.id);
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      newTagIds = [...formData.tagIds, tag.id];
      setSelectedTags([...selectedTags, tag]);
    }

    setFormData((prev) => ({ ...prev, tagIds: newTagIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSaving(false);
      return;
    }

    if (!formData.excerpt.trim()) {
      setError("Excerpt is required");
      setIsSaving(false);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsSaving(false);
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category");
      setIsSaving(false);
      return;
    }

    // Check content size - Supabase has limits on column sizes
    const contentSizeInBytes = new Blob([formData.content]).size;
    const maxContentSizeInBytes = 1024 * 1024; // 1MB limit

    if (contentSizeInBytes > maxContentSizeInBytes) {
      setError(
        `Content is too large (${(contentSizeInBytes / 1024).toFixed(2)}KB). ` +
          `Please reduce the size by using fewer or smaller images.`,
      );
      setIsSaving(false);
      return;
    }

    try {
      let savedPost;
      if (isEditing && id) {
        savedPost = await updateBlogPost(id, formData);
        console.log("Post updated successfully:", savedPost);
      } else {
        savedPost = await createBlogPost(formData);
        console.log("Post created successfully:", savedPost);
      }

      // Show success message before navigating
      alert(
        isEditing ? "Post updated successfully!" : "Post created successfully!",
      );
      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save post. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4 p-2"
          onClick={() => navigate(-1)}
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Enter the main content for your blog post
                </CardDescription>
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
                    placeholder="Enter a short excerpt for your post"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="min-h-[300px] border rounded-md">
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      value={formData.content}
                      onChange={handleEditorChange}
                      placeholder="Write your post content here..."
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>
                  Configure the settings for your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleStatusChange}
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

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          formData.tagIds.includes(tag.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
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
                              // Convert to base64 for local storage
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const result = reader.result as string;
                                // Check if image is too large for localStorage
                                if (result.length > 1000000) {
                                  alert(
                                    "Warning: Large images may cause saving issues. Using a compressed version or consider using a URL instead.",
                                  );
                                  // Use a smaller version or URL instead
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
                                      0.5,
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
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full gap-2" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
