// src/api/blog.ts
import { createClient } from '@supabase/supabase-js';
import { BlogPostFormData, BlogPost, Category, Tag } from "../types/blog";

// Initialize Supabase client
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Get all blog posts with filtering options
export const getBlogPosts = async (options?: {
  status?: string;
  search?: string;
  categoryId?: string;
}): Promise<BlogPost[]> => {
  try {
    // Start building the query
    let query = supabase.from('blog_posts').select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `);
    
    // Apply filters
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Get tags for each post
    const postsWithTags = await Promise.all(
      data.map(async (post) => {
        const { data: tagData, error: tagError } = await supabase
          .from('blog_post_tags')
          .select(`
            tag:tag_id(*)
          `)
          .eq('post_id', post.id);
        
        if (tagError) {
          console.error('Error fetching tags for post', post.id, tagError);
          return {
            ...post,
            tags: [],
          };
        }
        
        return {
          ...post,
          tags: tagData.map(t => t.tag),
        };
      })
    );
    
    // Format to match the BlogPost interface
    return postsWithTags.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      author: post.author,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
      status: post.status,
      featuredImage: post.featured_image,
      readTime: post.read_time,
    }));
  } catch (error) {
    console.error("Error getting blog posts:", error);
    throw new Error("Failed to get blog posts");
  }
};

// Get a blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get tags for the post
    const { data: tagData, error: tagError } = await supabase
      .from('blog_post_tags')
      .select(`
        tag:tag_id(*)
      `)
      .eq('post_id', id);
    
    if (tagError) {
      console.error('Error fetching tags for post', id, tagError);
      throw tagError;
    }
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: tagData.map(t => t.tag),
      author: data.author,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
      status: data.status,
      featuredImage: data.featured_image,
      readTime: data.read_time,
    };
  } catch (error) {
    console.error("Error getting blog post by ID:", error);
    throw new Error("Failed to get blog post");
  }
};

// Get a blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get tags for the post
    const { data: tagData, error: tagError } = await supabase
      .from('blog_post_tags')
      .select(`
        tag:tag_id(*)
      `)
      .eq('post_id', data.id);
    
    if (tagError) {
      console.error('Error fetching tags for post', data.id, tagError);
      throw tagError;
    }
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: tagData.map(t => t.tag),
      author: data.author,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
      status: data.status,
      featuredImage: data.featured_image,
      readTime: data.read_time,
    };
  } catch (error) {
    console.error("Error getting blog post by slug:", error);
    throw new Error("Failed to get blog post");
  }
};

// Create a new blog post
export const createBlogPost = async (formData: BlogPostFormData): Promise<BlogPost> => {
  try {
    // Start a transaction
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error("User not authenticated");
    }
    
    const userId = userData.user.id;
    
    // Generate a slug from the title
    const slug = generateSlug(formData.title);
    
    // Create the blog post
    const now = new Date().toISOString();
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author_id: userId,
        category_id: formData.categoryId,
        featured_image: formData.featuredImage,
        status: formData.status,
        published_at: formData.status === 'published' ? now : null,
        created_at: now,
        updated_at: now,
        read_time: Math.max(1, Math.ceil(formData.content.length / 2000)), // Rough estimate
      })
      .select()
      .single();
    
    if (postError) {
      console.error("Error creating blog post:", postError);
      throw new Error(postError.message);
    }
    
    // Add tags to the post if there are any
    if (formData.tagIds && formData.tagIds.length > 0) {
      const tagInserts = formData.tagIds.map(tagId => ({
        post_id: post.id,
        tag_id: tagId,
      }));
      
      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(tagInserts);
      
      if (tagError) {
        console.error("Error adding tags to post:", tagError);
        // Continue anyway but log the error
      }
    }
    
    // Fetch the complete post with relations
    return await getBlogPostById(post.id) as BlogPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to create blog post");
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, formData: BlogPostFormData): Promise<BlogPost> => {
  try {
    // Get the current post
    const { data: currentPost, error: getError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw new Error("Blog post not found");
    }
    
    // Generate a new slug if the title has changed
    const slug = currentPost.title !== formData.title
      ? generateSlug(formData.title)
      : currentPost.slug;
    
    // Update the post
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: formData.categoryId,
        featured_image: formData.featuredImage,
        status: formData.status,
        published_at: formData.status === 'published' 
          ? (currentPost.published_at || now) 
          : currentPost.published_at,
        updated_at: now,
        read_time: Math.max(1, Math.ceil(formData.content.length / 2000)),
      })
      .eq('id', id);
    
    if (updateError) {
      throw new Error(updateError.message);
    }
    
    // Remove all current tags
    const { error: deleteTagsError } = await supabase
      .from('blog_post_tags')
      .delete()
      .eq('post_id', id);
    
    if (deleteTagsError) {
      console.error("Error removing tags from post:", deleteTagsError);
      // Continue anyway but log the error
    }
    
    // Add new tags
    if (formData.tagIds && formData.tagIds.length > 0) {
      const tagInserts = formData.tagIds.map(tagId => ({
        post_id: id,
        tag_id: tagId,
      }));
      
      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(tagInserts);
      
      if (tagError) {
        console.error("Error adding tags to post:", tagError);
        // Continue anyway but log the error
      }
    }
    
    // Fetch the complete updated post with relations
    return await getBlogPostById(id) as BlogPost;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to update blog post");
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    // Delete the tags first (due to foreign key constraints)
    const { error: deleteTagsError } = await supabase
      .from('blog_post_tags')
      .delete()
      .eq('post_id', id);
    
    if (deleteTagsError) {
      throw new Error(deleteTagsError.message);
    }
    
    // Delete the post
    const { error: deletePostError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (deletePostError) {
      throw new Error(deletePostError.message);
    }
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to delete blog post");
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error getting categories:", error);
    throw new Error("Failed to get categories");
  }
};

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Error getting tags:", error);
    throw new Error("Failed to get tags");
  }
};
