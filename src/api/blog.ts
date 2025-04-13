// src/api/blog.ts
import {
  BlogPostFormData,
  BlogPost,
  Category,
  Tag,
  Author,
} from "../types/blog";
import {
  supabase,
  isSupabaseConfigured,
  useLocalStorageFallback,
} from "../lib/supabase";
import { generateSlug, calculateReadTime } from "../lib/utils";

// Mock data for local storage fallback
const mockAuthor: Author = {
  id: "1",
  name: "Demo Author",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  bio: "This is a demo author for local development.",
};

const mockCategories: Category[] = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Design", slug: "design" },
  { id: "3", name: "Business", slug: "business" },
];

const mockTags: Tag[] = [
  { id: "1", name: "React", slug: "react" },
  { id: "2", name: "UI/UX", slug: "ui-ux" },
  { id: "3", name: "Development", slug: "development" },
  { id: "4", name: "Web", slug: "web" },
  { id: "5", name: "Mobile", slug: "mobile" },
];

// Local storage keys
const STORAGE_KEYS = {
  POSTS: "blog_posts",
  CATEGORIES: "blog_categories",
  TAGS: "blog_tags",
};

// Helper function to get mock data or data from local storage
const getLocalData = <T>(key: string, mockData: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : mockData;
};

// Helper function to save data to local storage
const saveLocalData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Get all blog posts with filtering options
export const getBlogPosts = async (options?: {
  status?: string;
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<BlogPost[]> => {
  if (!isSupabaseConfigured()) {
    if (useLocalStorageFallback()) {
      console.log("Using local storage fallback for getBlogPosts");
      let posts = getLocalData<BlogPost[]>(STORAGE_KEYS.POSTS, []);

      // Apply filters
      if (options?.status) {
        posts = posts.filter((post) => post.status === options.status);
      }

      if (options?.search) {
        const searchLower = options.search.toLowerCase();
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower),
        );
      }

      if (options?.categoryId) {
        posts = posts.filter((post) => post.category.id === options.categoryId);
      }

      // Apply pagination
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return posts.slice(startIndex, endIndex);
    }

    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  try {
    let query = supabase.from("blog_posts").select(`
        *,
        category:categories(*),
        tags:blog_post_tags(tag:tags(*)),
        author:authors(*)
      `);

    // Apply filters
    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      query = query.or(
        `title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`,
      );
    }

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const startIndex = (page - 1) * limit;

    query = query.range(startIndex, startIndex + limit - 1);
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to match the BlogPost interface
    return (data || []).map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.map((tagRel: any) => tagRel.tag),
      author: post.author,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
      status: post.status,
      featuredImage: post.featured_image,
      readTime: post.read_time,
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error(`Failed to fetch blog posts: ${(error as Error).message}`);
  }
};

// Get a blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  if (!isSupabaseConfigured()) {
    if (useLocalStorageFallback()) {
      console.log("Using local storage fallback for getBlogPostById");
      const posts = getLocalData<BlogPost[]>(STORAGE_KEYS.POSTS, []);
      return posts.find((post) => post.id === id) || null;
    }

    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:categories(*),
        tags:blog_post_tags(tag:tags(*)),
        author:authors(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Transform the data to match the BlogPost interface
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags.map((tagRel: any) => tagRel.tag),
      author: data.author,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
      status: data.status,
      featuredImage: data.featured_image,
      readTime: data.read_time,
    };
  } catch (error) {
    console.error("Error fetching blog post by ID:", error);
    throw new Error(`Failed to fetch blog post: ${(error as Error).message}`);
  }
};

// Get a blog post by slug
export const getBlogPostBySlug = async (
  slug: string,
): Promise<BlogPost | null> => {
  if (!isSupabaseConfigured()) {
    if (useLocalStorageFallback()) {
      console.log("Using local storage fallback for getBlogPostBySlug");
      const posts = getLocalData<BlogPost[]>(STORAGE_KEYS.POSTS, []);
      return posts.find((post) => post.slug === slug) || null;
    }

    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:categories(*),
        tags:blog_post_tags(tag:tags(*)),
        author:authors(*)
      `,
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Transform the data to match the BlogPost interface
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags.map((tagRel: any) => tagRel.tag),
      author: data.author,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
      status: data.status,
      featuredImage: data.featured_image,
      readTime: data.read_time,
    };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    throw new Error(`Failed to fetch blog post: ${(error as Error).message}`);
  }
};

// Create a new blog post
export const createBlogPost = async (
  formData: BlogPostFormData,
): Promise<BlogPost> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  // Placeholder for the rebuilt function
  console.log("createBlogPost called with formData:", formData);
  throw new Error("Blog creation functionality is being rebuilt.");
};

// Update an existing blog post
export const updateBlogPost = async (
  id: string,
  formData: BlogPostFormData,
): Promise<BlogPost> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  // Placeholder for the rebuilt function
  console.log("updateBlogPost called with id:", id, "and formData:", formData);
  throw new Error("Blog update functionality is being rebuilt.");
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Please set up your Supabase credentials.",
    );
  }

  // Placeholder for the rebuilt function
  console.log("deleteBlogPost called with id:", id);
  throw new Error("Blog deletion functionality is being rebuilt.");
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) {
    if (useLocalStorageFallback()) {
      console.log("Using local storage fallback for getCategories");
      return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, mockCategories);
    }
    console.warn(
      "Supabase is not configured. Attempting to fetch categories anyway.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories; // Fallback to mock data on error
  }
};

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
  if (!isSupabaseConfigured()) {
    if (useLocalStorageFallback()) {
      console.log("Using local storage fallback for getTags");
      return getLocalData<Tag[]>(STORAGE_KEYS.TAGS, mockTags);
    }
    console.warn(
      "Supabase is not configured. Attempting to fetch tags anyway.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return mockTags; // Fallback to mock data on error
  }
};
