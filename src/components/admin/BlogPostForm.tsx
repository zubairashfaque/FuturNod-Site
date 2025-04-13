import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
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
import { Badge } from "../ui/badge";
import { createBlogPost } from "../../api/blog";

const BlogPostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [] as string[],
    featuredImage: "",
    status: "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock categories and tags for the form
  const categories = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Design" },
    { id: "3", name: "Development" },
    { id: "4", name: "UX Design" },
    { id: "5", name: "Blockchain" },
  ];

  const tags = [
    { id: "1", name: "AI" },
    { id: "2", name: "Design" },
    { id: "3", name: "Future" },
    { id: "4", name: "Sustainability" },
    { id: "5", name: "Web Development" },
    { id: "6", name: "Performance" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => {
      const tagIds = [...prev.tagIds];
      if (tagIds.includes(tagId)) {
        return { ...prev, tagIds: tagIds.filter((id) => id !== tagId) };
      } else {
        return { ...prev, tagIds: [...tagIds, tagId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.title.trim()) throw new Error("Title is required");
      if (!formData.excerpt.trim()) throw new Error("Excerpt is required");
      if (!formData.content.trim()) throw new Error("Content is required");
      if (!formData.categoryId) throw new Error("Please select a category");

      // Create the blog post
      await createBlogPost(formData);
      alert("Blog post created successfully!");
      navigate("/admin/blog");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create blog post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter post title"
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your post content here..."
            rows={10}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredImage">Featured Image URL</Label>
          <Input
            id="featuredImage"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
          <p className="text-xs text-gray-500">
            Enter a URL for the featured image
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  formData.tagIds.includes(tag.id) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/blog")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
