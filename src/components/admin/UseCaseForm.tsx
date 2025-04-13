import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import EnvVariablesNotice from "../EnvVariablesNotice";
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
import {
  createUseCase,
  getUseCaseById,
  updateUseCase,
} from "../../api/usecases";

const UseCaseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    industry: "",
    category: "",
    imageUrl: "",
    status: "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Fetch use case data if in edit mode
  useEffect(() => {
    const fetchUseCase = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const useCase = await getUseCaseById(id);

        if (!useCase) {
          setError(`Use case with ID ${id} not found`);
          return;
        }

        setFormData({
          title: useCase.title,
          description: useCase.description,
          content: useCase.content,
          industry: useCase.industry,
          category: useCase.category,
          imageUrl: useCase.imageUrl,
          status: useCase.status,
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : `Failed to fetch use case with ID ${id}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUseCase();
  }, [id]);

  // Update search params when search value changes
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Mock industries and categories for the form
  const industries = [
    { id: "1", name: "Healthcare" },
    { id: "2", name: "Finance" },
    { id: "3", name: "Technology" },
    { id: "4", name: "Retail" },
    { id: "5", name: "Manufacturing" },
  ];

  const categories = [
    { id: "1", name: "AI Solutions" },
    { id: "2", name: "Automation" },
    { id: "3", name: "Data Analytics" },
    { id: "4", name: "Customer Service" },
    { id: "5", name: "Process Optimization" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
  };

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, industry: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.title.trim()) throw new Error("Title is required");
      if (!formData.description.trim())
        throw new Error("Description is required");
      if (!formData.content.trim()) throw new Error("Content is required");
      if (!formData.industry) throw new Error("Please select an industry");
      if (!formData.category) throw new Error("Please select a category");

      if (isEditMode && id) {
        // Update existing use case
        await updateUseCase(id, formData);
        alert("Use case updated successfully!");
      } else {
        // Create new use case
        await createUseCase(formData);
        alert("Use case created successfully!");
      }

      navigate("/admin/usecases");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Failed to update use case"
            : "Failed to create use case",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <p className="text-gray-500">Loading use case data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EnvVariablesNotice />
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Use Case" : "Create New Use Case"}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search use cases..."
            className="pl-10"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter use case title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a brief description (1-2 sentences)"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Full Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write the full use case content here..."
            rows={10}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.name}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Featured Image</Label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
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
                        // Check if image is too large
                        if (result.length > 1000000) {
                          // Use a smaller version
                          const img = new Image();
                          img.onload = function () {
                            const canvas = document.createElement("canvas");
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
                              imageUrl: compressedImage,
                            }));
                          };
                          img.src = result;
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: result,
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Upload
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter a URL or upload an image file (max 2MB)
            </p>
          </div>
          {formData.imageUrl && (
            <div className="mt-2 border rounded-md overflow-hidden h-40">
              <img
                src={formData.imageUrl}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/usecases")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Use Case"
                : "Save Use Case"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UseCaseForm;
