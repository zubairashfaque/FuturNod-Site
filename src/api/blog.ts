// src/api/blog.ts
import { BlogPostFormData, BlogPost, Category, Tag } from "../types/blog";

// Mock database - Replace with actual API calls to your backend
const STORAGE_KEY = "blog_posts";
const CATEGORIES_KEY = "blog_categories";
const TAGS_KEY = "blog_tags";

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Load data from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
    throw new Error("Failed to save data");
  }
};

// Initialize mock data if not exists
const initializeMockData = () => {
  // Initialize categories if they don't exist
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const defaultCategories: Category[] = [
      { id: "1", name: "Technology", slug: "technology" },
      { id: "2", name: "Design", slug: "design" },
      { id: "3", name: "Business", slug: "business" },
      { id: "4", name: "Development", slug: "development" },
    ];
    saveToStorage(CATEGORIES_KEY, defaultCategories);
  }

  // Initialize tags if they don't exist
  if (!localStorage.getItem(TAGS_KEY)) {
    const defaultTags: Tag[] = [
      { id: "1", name: "Web Development", slug: "web-development" },
      { id: "2", name: "UX Design", slug: "ux-design" },
      { id: "3", name: "AI", slug: "ai" },
      { id: "4", name: "React", slug: "react" },
      { id: "5", name: "JavaScript", slug: "javascript" },
    ];
    saveToStorage(TAGS_KEY, defaultTags);
  }
};

// Initialize mock data
initializeMockData();

// Get all blog posts with filtering options
export const getBlogPosts = async (options?: {
  status?: string;
  search?: string;
  categoryId?: string;
}): Promise<BlogPost[]> => {
  try {
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    
    let filteredPosts = [...posts];
    
    // Apply filters
    if (options?.status) {
      filteredPosts = filteredPosts.filter(post => post.status === options.status);
    }
    
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }
    
    if (options?.categoryId) {
      filteredPosts = filteredPosts.filter(post => post.category.id === options.categoryId);
    }
    
    return filteredPosts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    throw new Error("Failed to get blog posts");
  }
};

// Get a blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error("Error getting blog post by ID:", error);
    throw new Error("Failed to get blog post");
  }
};

// Get a blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error("Error getting blog post by slug:", error);
    throw new Error("Failed to get blog post");
  }
};

// Create a new blog post
export const createBlogPost = async (formData: BlogPostFormData): Promise<BlogPost> => {
  try {
    // Validate required fields
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
    
    // Get categories and tags
    const categories = loadFromStorage<Category[]>(CATEGORIES_KEY, []);
    const tags = loadFromStorage<Tag[]>(TAGS_KEY, []);
    
    // Find the selected category
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) {
      throw new Error("Selected category not found");
    }
    
    // Find the selected tags
    const selectedTags = tags.filter(tag => formData.tagIds.includes(tag.id));
    
    // Create the new post
    const now = new Date().toISOString();
    const slug = generateSlug(formData.title);
    
    // Set default values for missing fields
    const defaultAuthor = {
      id: "1",
      name: "Admin User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      bio: "Website Administrator"
    };
    
    // Ensure we have a featured image
    const featuredImage = formData.featuredImage || 
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";
    
    const newPost: BlogPost = {
      id: generateId(),
      title: formData.title,
      slug,
      excerpt: formData.excerpt,
      content: formData.content,
      category,
      tags: selectedTags,
      author: defaultAuthor,
      createdAt: now,
      updatedAt: now,
      publishedAt: formData.status === "published" ? now : null,
      status: formData.status,
      featuredImage,
      readTime: Math.max(1, Math.ceil(formData.content.length / 2000)), // Rough estimate
    };
    
    // Save to storage
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    posts.push(newPost);
    saveToStorage(STORAGE_KEY, posts);
    
    return newPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error; // Re-throw to propagate the error message
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, formData: BlogPostFormData): Promise<BlogPost> => {
  try {
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new Error("Blog post not found");
    }
    
    // Validate required fields
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
    
    // Get categories and tags
    const categories = loadFromStorage<Category[]>(CATEGORIES_KEY, []);
    const tags = loadFromStorage<Tag[]>(TAGS_KEY, []);
    
    // Find the selected category
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) {
      throw new Error("Selected category not found");
    }
    
    // Find the selected tags
    const selectedTags = tags.filter(tag => formData.tagIds.includes(tag.id));
    
    const existingPost = posts[postIndex];
    const updatedPost: BlogPost = {
      ...existingPost,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category,
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
      publishedAt: formData.status === "published" ? 
        (existingPost.publishedAt || new Date().toISOString()) : null,
      status: formData.status,
      featuredImage: formData.featuredImage || existingPost.featuredImage,
      readTime: Math.max(1, Math.ceil(formData.content.length / 2000)),
    };
    
    // Update post
    posts[postIndex] = updatedPost;
    saveToStorage(STORAGE_KEY, posts);
    
    return updatedPost;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const posts = loadFromStorage<BlogPost[]>(STORAGE_KEY, []);
    const updatedPosts = posts.filter(post => post.id !== id);
    saveToStorage(STORAGE_KEY, updatedPosts);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw new Error("Failed to delete blog post");
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    return loadFromStorage<Category[]>(CATEGORIES_KEY, []);
  } catch (error) {
    console.error("Error getting categories:", error);
    throw new Error("Failed to get categories");
  }
};

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    return loadFromStorage<Tag[]>(TAGS_KEY, []);
  } catch (error) {
    console.error("Error getting tags:", error);
    throw new Error("Failed to get tags");
  }
};
