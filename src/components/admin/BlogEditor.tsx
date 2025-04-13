import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ArrowLeft, AlertCircle, Save, Eye, Search } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import EnvVariablesNotice from "../EnvVariablesNotice";
import { Author, BlogPostFormData } from "../../types/blog";
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  getCategories,
  getTags,
} from "../../api/blog";
import { supabase } from "../../lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Import the new extracted components
import ContentInput from "./blog/ContentInput";
import ImageUpload from "./blog/ImageUpload";
import {
  TextField,
  CategorySelect,
  AuthorSelect,
  StatusSelect,
  TagsCheckboxGroup,
} from "./blog/FormFields";

const BlogEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [authors, setAuthors] = useState<Author[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentInputMethod, setContentInputMethod] = useState<
    "editor" | "upload"
  >("editor");
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [isEditingUploadedContent, setIsEditingUploadedContent] =
    useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [],
    featuredImage: "",
    status: "draft",
    publishedAt: null,
    authorId: "",
  });

  // Parse search query from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch categories, tags, and authors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        // Fetch authors
        if (supabase) {
          const { data: authorsData, error: authorsError } = await supabase
            .from("authors")
            .select("*");

          if (authorsError) {
            console.error("Error fetching authors:", authorsError);
            throw new Error("Failed to fetch authors");
          }

          if (authorsData && authorsData.length > 0) {
            setAuthors(
              authorsData.map((author) => ({
                id: author.id,
                name: author.name,
                avatar: author.avatar,
                bio: author.bio || undefined,
              })),
            );
          } else {
            // If no authors in database, create a default list
            const defaultAuthors: Author[] = [
              {
                id: "current_user",
                name: "Current User",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
              },
              {
                id: "admin",
                name: "Admin",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
              },
              {
                id: "editor",
                name: "Editor",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=editor",
              },
            ];
            setAuthors(defaultAuthors);
          }
        } else {
          // Fallback for when Supabase is not available
          const defaultAuthors: Author[] = [
            {
              id: "current_user",
              name: "Current User",
              avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
            },
            {
              id: "admin",
              name: "Admin",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
            },
            {
              id: "editor",
              name: "Editor",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor",
            },
          ];
          setAuthors(defaultAuthors);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load necessary data. Please try again later.");
      }
    };

    fetchData();
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
              authorId: post.author.id,
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, featuredImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleMarkdownFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMarkdownFile(file);

    // Read the markdown file content
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Normalize line endings to ensure consistent handling across platforms
      // Convert all types of line endings (CRLF, CR) to LF
      const normalizedContent = result
        .replace(/\r\n/g, "\n") // CRLF → LF
        .replace(/\r/g, "\n"); // CR → LF
      setFormData((prev) => ({ ...prev, content: normalizedContent }));
      // Reset editing state when a new file is uploaded
      setIsEditingUploadedContent(false);
    };
    reader.readAsText(file);
  };

  const handleContentInputMethodChange = (value: "editor" | "upload") => {
    setContentInputMethod(value);
    // Reset editing state when switching input methods
    setIsEditingUploadedContent(false);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value?: string) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
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
      // Prepare the content based on the input method
      let finalContent = formData.content;

      // If using uploaded content and not in editing mode, use the original uploaded content
      if (
        contentInputMethod === "upload" &&
        markdownFile &&
        !isEditingUploadedContent
      ) {
        // Re-read the file to ensure we have the latest content
        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsText(markdownFile);
        });
        // Normalize line endings to ensure consistent handling across platforms
        // Convert all types of line endings (CRLF, CR) to LF
        finalContent = fileContent
          .replace(/\r\n/g, "\n") // CRLF → LF
          .replace(/\r/g, "\n"); // CR → LF
      }

      // Create the final form data with the prepared content
      const finalFormData = {
        ...formData,
        content: finalContent,
      };

      if (isEditing && id) {
        await updateBlogPost(id, finalFormData);
        setSuccess("Blog post updated successfully!");
      } else {
        await createBlogPost(finalFormData);
        setSuccess("Blog post created successfully!");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save blog post. Please try again later.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const [showPreview, setShowPreview] = useState(false);
  const [fullscreenEditor, setFullscreenEditor] = useState(false);

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleFullscreen = () => {
    setFullscreenEditor(!fullscreenEditor);
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-gray-500">
            {isEditing
              ? "Update your blog post content and settings"
              : "Create a new blog post for your website"}
          </p>
        </div>
        {searchQuery && (
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
            <Search className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-blue-700">Search: {searchQuery}</span>
          </div>
        )}
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
            <TextField
              id="title"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              required
            />

            <TextField
              id="excerpt"
              name="excerpt"
              label="Excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Enter a brief summary of your post"
              rows={3}
              required
            />

            <ContentInput
              contentInputMethod={contentInputMethod}
              onContentInputMethodChange={handleContentInputMethodChange}
              content={formData.content}
              onContentChange={handleContentChange}
              markdownFile={markdownFile}
              onMarkdownFileChange={handleMarkdownFileChange}
              isEditingUploadedContent={isEditingUploadedContent}
              setIsEditingUploadedContent={setIsEditingUploadedContent}
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              featuredImage={formData.featuredImage}
              imagePreview={imagePreview}
              onInputChange={handleInputChange}
              onFileChange={handleImageFileChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategorySelect
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleSelectChange("categoryId", value)
                }
                categories={categories}
              />

              <AuthorSelect
                value={formData.authorId}
                onValueChange={(value) => handleSelectChange("authorId", value)}
                authors={authors}
              />
            </div>

            <TagsCheckboxGroup
              tags={tags}
              selectedTagIds={formData.tagIds}
              onTagChange={handleTagChange}
            />

            <StatusSelect
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            />
          </CardContent>
        </Card>

        {showPreview && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Markdown Preview</CardTitle>
              {contentInputMethod === "upload" && markdownFile && (
                <div className="text-sm text-gray-500 mt-1">
                  Previewing {isEditingUploadedContent ? "edited" : "uploaded"}{" "}
                  content from: {markdownFile.name}
                </div>
              )}
            </CardHeader>
            <CardContent className="max-h-[800px] overflow-auto">
              <div className="prose max-w-none overflow-auto p-4 border rounded-md bg-white">
                <pre className="whitespace-pre-wrap">{formData.content}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />{" "}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
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
