import {
  BlogPost,
  BlogPostFilter,
  BlogPostFormData,
  Category,
  Tag,
} from "../types/blog";
import { supabase, useLocalStorageFallback } from "../lib/supabase";

// Mock data for development
const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Design", slug: "design" },
  { id: "3", name: "Development", slug: "development" },
  { id: "4", name: "UX Design", slug: "ux-design" },
  { id: "5", name: "Blockchain", slug: "blockchain" },
];

const MOCK_TAGS: Tag[] = [
  { id: "1", name: "AI", slug: "ai" },
  { id: "2", name: "Design", slug: "design" },
  { id: "3", name: "Future", slug: "future" },
  { id: "4", name: "Sustainability", slug: "sustainability" },
  { id: "5", name: "Web Development", slug: "web-development" },
  { id: "6", name: "Performance", slug: "performance" },
  { id: "7", name: "Voice UI", slug: "voice-ui" },
  { id: "8", name: "UX", slug: "ux" },
  { id: "9", name: "Design Trends", slug: "design-trends" },
  { id: "10", name: "Automation", slug: "automation" },
  { id: "11", name: "Business", slug: "business" },
  { id: "12", name: "Accessibility", slug: "accessibility" },
  { id: "13", name: "Inclusive Design", slug: "inclusive-design" },
  { id: "14", name: "Web3", slug: "web3" },
  { id: "15", name: "Blockchain", slug: "blockchain" },
  { id: "16", name: "Decentralization", slug: "decentralization" },
];

// Local storage keys
const BLOG_POSTS_STORAGE_KEY = "blog_posts";
const CATEGORIES_STORAGE_KEY = "blog_categories";
const TAGS_STORAGE_KEY = "blog_tags";

// Initialize local storage with mock data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(CATEGORIES_STORAGE_KEY)) {
    localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(MOCK_CATEGORIES),
    );
  }

  if (!localStorage.getItem(TAGS_STORAGE_KEY)) {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(MOCK_TAGS));
  }

  if (!localStorage.getItem(BLOG_POSTS_STORAGE_KEY)) {
    // Import mock posts from the BlogPage component
    const mockPosts = JSON.parse(localStorage.getItem("mock_posts") || "[]");
    localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(mockPosts));
  }
};

// Initialize on module load
initializeLocalStorage();

// Helper function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
};

// Helper function to calculate read time
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Helper function to convert Supabase blog post to app BlogPost format
const convertSupabaseToBlogPost = async (post: any): Promise<BlogPost> => {
  // Get category
  let category: Category;
  if (useLocalStorageFallback()) {
    const categories = JSON.parse(
      localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]",
    ) as Category[];
    category = categories.find((cat) => cat.id === post.category_id) || {
      id: post.category_id,
      name: "Unknown",
      slug: "unknown",
    };
  } else {
    const { data: categoryData } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("id", post.category_id)
      .single();

    category = {
      id: categoryData?.id || post.category_id,
      name: categoryData?.name || "Unknown",
      slug: categoryData?.slug || "unknown",
    };
  }

  // Get tags
  let tags: Tag[] = [];
  if (useLocalStorageFallback()) {
    const allTags = JSON.parse(
      localStorage.getItem(TAGS_STORAGE_KEY) || "[]",
    ) as Tag[];
    const postTags = JSON.parse(
      localStorage.getItem("post_tags_" + post.id) || "[]",
    ) as string[];
    tags = allTags.filter((tag) => postTags.includes(tag.id));
  } else {
    const { data: postTagsData } = await supabase
      .from("blog_posts_tags")
      .select("tag_id")
      .eq("post_id", post.id);

    if (postTagsData && postTagsData.length > 0) {
      const tagIds = postTagsData.map((pt) => pt.tag_id);
      const { data: tagsData } = await supabase
        .from("blog_tags")
        .select("*")
        .in("id", tagIds);

      if (tagsData) {
        tags = tagsData.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        }));
      }
    }
  }

  // Get author
  let author = {
    id: "current_user",
    name: "Current User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
  };

  if (!useLocalStorageFallback() && post.author_id) {
    const { data: authorData } = await supabase
      .from("authors")
      .select("*")
      .eq("id", post.author_id)
      .single();

    if (authorData) {
      author = {
        id: authorData.id,
        name: authorData.name,
        avatar: authorData.avatar,
      };
    }
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: author,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    publishedAt: post.published_at,
    readTime: post.read_time,
    category: category,
    tags: tags,
    featuredImage: post.featured_image,
    status: post.status,
  };
};

// CRUD operations for blog posts
export const getBlogPosts = async (
  filter?: BlogPostFilter,
): Promise<BlogPost[]> => {
  try {
    const delay = Math.random() * 500 + 200; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];

      if (!filter) return posts;

      let filteredPosts = [...posts];

      // Apply filters
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchTerm),
            ),
        );
      }

      if (filter.categoryId) {
        filteredPosts = filteredPosts.filter(
          (post) => post.category.id === filter.categoryId,
        );
      }

      if (filter.tagIds && filter.tagIds.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
          post.tags.some((tag) => filter.tagIds?.includes(tag.id)),
        );
      }

      if (filter.status) {
        filteredPosts = filteredPosts.filter(
          (post) => post.status === filter.status,
        );
      }

      if (filter.authorId) {
        filteredPosts = filteredPosts.filter(
          (post) => post.author.id === filter.authorId,
        );
      }

      // Pagination
      if (filter.page !== undefined && filter.limit !== undefined) {
        const startIndex = (filter.page - 1) * filter.limit;
        filteredPosts = filteredPosts.slice(
          startIndex,
          startIndex + filter.limit,
        );
      }

      return filteredPosts;
    } else {
      // Use Supabase
      let query = supabase.from("blog_posts").select("*");

      // Apply filters
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase();
        query = query.or(
          `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
        );
      }

      if (filter?.categoryId) {
        query = query.eq("category_id", filter.categoryId);
      }

      if (filter?.status) {
        query = query.eq("status", filter.status);
      }

      if (filter?.authorId) {
        query = query.eq("author_id", filter.authorId);
      }

      // Pagination
      if (filter?.page !== undefined && filter?.limit !== undefined) {
        const startIndex = (filter.page - 1) * filter.limit;
        query = query.range(startIndex, startIndex + filter.limit - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data) return [];

      // Convert to BlogPost format and handle tag filtering
      const posts = await Promise.all(
        data.map((post) => convertSupabaseToBlogPost(post)),
      );

      // Filter by tags if needed (we do this post-query since it requires a join)
      if (filter?.tagIds && filter.tagIds.length > 0) {
        return posts.filter((post) =>
          post.tags.some((tag) => filter.tagIds?.includes(tag.id)),
        );
      }

      return posts;
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error("Failed to fetch blog posts");
  }
};

// Mock function to get a blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const delay = Math.random() * 300 + 100; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];
      return posts.find((post) => post.id === id) || null;
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return convertSupabaseToBlogPost(data);
    }
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw new Error(`Failed to fetch blog post with ID ${id}`);
  }
};

// Mock function to get a blog post by slug
export const getBlogPostBySlug = async (
  slug: string,
): Promise<BlogPost | null> => {
  try {
    const delay = Math.random() * 300 + 100; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];
      return posts.find((post) => post.slug === slug) || null;
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      if (!data) return null;

      return convertSupabaseToBlogPost(data);
    }
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch blog post with slug ${slug}`);
  }
};

// Replace the createBlogPost function in src/api/blog.ts with this improved version
// that has better error handling

// Replace the createBlogPost function in src/api/blog.ts with this fixed version
// that properly handles UUID requirements

export const createBlogPost = async (
  data: BlogPostFormData,
): Promise<BlogPost> => {
  try {
    // Validate required fields before sending to the server
    if (!data.title || !data.title.trim()) {
      throw new Error("Title is required");
    }
    if (!data.excerpt || !data.excerpt.trim()) {
      throw new Error("Excerpt is required");
    }
    if (!data.content || !data.content.trim()) {
      throw new Error("Content is required");
    }
    if (!data.categoryId) {
      throw new Error("Category is required");
    }

    // Add a small delay to ensure UI feedback works properly
    await new Promise((resolve) => setTimeout(resolve, 500));

    const delay = Math.random() * 800 + 400; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Set default featured image if not provided
    let featuredImage =
      data.featuredImage ||
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";

    // Check if the image is a base64 string that's too large
    if (
      featuredImage.startsWith("data:image") &&
      featuredImage.length > 1000000
    ) {
      // Use a placeholder instead
      console.warn("Image too large, using placeholder");
      featuredImage =
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";
    }

    const now = new Date().toISOString();
    const slug = generateSlug(data.title);
    const readTime = calculateReadTime(data.content);

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];
      const categories = JSON.parse(
        localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]",
      ) as Category[];
      const tags = JSON.parse(
        localStorage.getItem(TAGS_STORAGE_KEY) || "[]",
      ) as Tag[];

      const category = categories.find((cat) => cat.id === data.categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      // Handle empty tagIds array
      const tagIds = data.tagIds || [];
      const selectedTags = tags.filter((tag) => tagIds.includes(tag.id));

      try {
        // Compress content if it's too large
        let compressedContent = data.content;
        if (compressedContent.length > 50000) {
          compressedContent =
            compressedContent.substring(0, 50000) +
            "...[content truncated due to size]";
        }

        const newPost: BlogPost = {
          id: `post_${Date.now()}`,
          slug,
          author: {
            id: "current_user", // In a real app, this would be the current user's ID
            name: "Current User", // In a real app, this would be the current user's name
            avatar:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
          },
          createdAt: now,
          updatedAt: now,
          publishedAt: data.status === "published" ? now : data.publishedAt,
          readTime,
          category,
          tags: selectedTags,
          featuredImage,
          title: data.title,
          excerpt: data.excerpt,
          content: compressedContent,
          status: data.status || "draft", // Ensure status has a default value
        };

        posts.push(newPost);
        try {
          localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts));
        } catch (storageError) {
          console.error("LocalStorage error:", storageError);
          throw new Error("Failed to save post due to storage limitations. Try using a smaller content or image.");
        }

        return newPost;
      } catch (storageError) {
        console.error("Error storing post in localStorage:", storageError);
        throw new Error(
          "Failed to save post due to storage limitations. Try using a smaller image or content.",
        );
      }
    } else {
      // Use Supabase
      // 1. Verify category exists
      const { data: categoryData, error: categoryError } = await supabase
        .from("blog_categories")
        .select("id")
        .eq("id", data.categoryId)
        .single();

      if (categoryError || !categoryData) {
        throw new Error("Category not found");
      }

      // Create a proper UUID for the author_id instead of using "current_user" string
      // This is a demo UUID that will be used for all posts when actual user auth is not implemented
      const demoAuthorId = "00000000-0000-4000-a000-000000000000"; // Using a fixed UUID for demo purposes

      // 2. Create the post
      const { data: postData, error: postError } = await supabase
        .from("blog_posts")
        .insert({
          title: data.title,
          slug,
          excerpt: data.excerpt,
          content: data.content,
          author_id: demoAuthorId, // Using a valid UUID format instead of "current_user"
          created_at: now,
          updated_at: now,
          published_at: data.status === "published" ? now : data.publishedAt,
          status: data.status || "draft", // Ensure status has a default value
          category_id: data.categoryId,
          featured_image: featuredImage,
          read_time: readTime,
        })
        .select("id")
        .single();

      if (postError || !postData) {
        throw new Error(`Failed to create blog post: ${postError?.message || "Unknown error"}`);
      }

      // 3. Add tags if any
      if (data.tagIds && data.tagIds.length > 0) {
        const tagInserts = data.tagIds.map((tagId) => ({
          post_id: postData.id,
          tag_id: tagId,
        }));

        const { error: tagsError } = await supabase
          .from("blog_posts_tags")
          .insert(tagInserts);

        if (tagsError) {
          console.error("Error adding tags to post:", tagsError);
          // We don't throw here to avoid failing the whole operation
        }
      }

      // 4. Return the complete post
      const createdPost = await getBlogPostById(postData.id);
      if (!createdPost) {
        throw new Error("Post was created but could not be retrieved");
      }
      return createdPost;
    }
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create blog post",
    );
  }
};

export const updateBlogPost = async (
  id: string,
  data: Partial<BlogPostFormData>,
): Promise<BlogPost> => {
  try {
    // Validate required fields before sending to the server
    if (data.title === "") throw new Error("Title is required");
    if (data.excerpt === "") throw new Error("Excerpt is required");
    if (data.content === "") throw new Error("Content is required");
    if (data.categoryId === "") throw new Error("Category is required");

    // Add a small delay to ensure UI feedback works properly
    await new Promise((resolve) => setTimeout(resolve, 500));

    const delay = Math.random() * 800 + 400; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Validate required fields if they are being updated
    if (data.title !== undefined && !data.title.trim()) {
      throw new Error("Title is required");
    }

    if (data.excerpt !== undefined && !data.excerpt.trim()) {
      throw new Error("Excerpt is required");
    }

    if (data.content !== undefined && !data.content.trim()) {
      throw new Error("Content is required");
    }

    const now = new Date().toISOString();
    const slug = data.title ? generateSlug(data.title) : undefined;
    const readTime = data.content ? calculateReadTime(data.content) : undefined;

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];
      const postIndex = posts.findIndex((post) => post.id === id);

      if (postIndex === -1) {
        throw new Error(`Blog post with ID ${id} not found`);
      }

      const post = posts[postIndex];
      const categories = JSON.parse(
        localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]",
      ) as Category[];
      const tags = JSON.parse(
        localStorage.getItem(TAGS_STORAGE_KEY) || "[]",
      ) as Tag[];

      let category = post.category;
      if (data.categoryId) {
        const newCategory = categories.find(
          (cat) => cat.id === data.categoryId,
        );
        if (!newCategory) {
          throw new Error("Category not found");
        }
        category = newCategory;
      }

      let selectedTags = post.tags;
      if (data.tagIds) {
        selectedTags = tags.filter((tag) => data.tagIds?.includes(tag.id));
      }

      const updatedPost: BlogPost = {
        ...post,
        title: data.title !== undefined ? data.title : post.title,
        excerpt: data.excerpt !== undefined ? data.excerpt : post.excerpt,
        content: data.content !== undefined ? data.content : post.content,
        featuredImage:
          data.featuredImage !== undefined
            ? data.featuredImage
            : post.featuredImage,
        status: data.status !== undefined ? data.status : post.status,
        slug: slug || post.slug,
        updatedAt: now,
        publishedAt:
          data.status === "published" && !post.publishedAt
            ? now
            : post.publishedAt,
        readTime: readTime || post.readTime,
        category,
        tags: selectedTags,
      };

      posts[postIndex] = updatedPost;
      localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts));

      return updatedPost;
    } else {
      // Use Supabase
      // 1. Check if post exists
      const { data: existingPost, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !existingPost) {
        throw new Error(`Blog post with ID ${id} not found`);
      }

      // 2. Check category if it's being updated
      if (data.categoryId) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("id", data.categoryId)
          .single();

        if (categoryError || !categoryData) {
          throw new Error("Category not found");
        }
      }

      // 3. Update the post
      const updateData: any = { updated_at: now };

      if (data.title !== undefined) updateData.title = data.title;
      if (slug !== undefined) updateData.slug = slug;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.featuredImage !== undefined)
        updateData.featured_image = data.featuredImage;
      if (data.status !== undefined) updateData.status = data.status;
      if (readTime !== undefined) updateData.read_time = readTime;
      if (data.categoryId !== undefined)
        updateData.category_id = data.categoryId;

      // Update published_at if publishing for the first time
      if (data.status === "published" && !existingPost.published_at) {
        updateData.published_at = now;
      }

      const { error: updateError } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("id", id);

      if (updateError) {
        throw new Error(`Failed to update blog post: ${updateError.message}`);
      }

      // 4. Update tags if provided
      if (data.tagIds !== undefined) {
        // First remove existing tags
        await supabase.from("blog_posts_tags").delete().eq("post_id", id);

        // Then add new tags
        if (data.tagIds.length > 0) {
          const tagInserts = data.tagIds.map((tagId) => ({
            post_id: id,
            tag_id: tagId,
          }));

          await supabase.from("blog_posts_tags").insert(tagInserts);
        }
      }

      // 5. Return the updated post
      return getBlogPostById(id) as Promise<BlogPost>;
    }
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to update blog post with ID ${id}`,
    );
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const delay = Math.random() * 500 + 200; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const posts = JSON.parse(
        localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
      ) as BlogPost[];
      const updatedPosts = posts.filter((post) => post.id !== id);

      if (posts.length === updatedPosts.length) {
        throw new Error(`Blog post with ID ${id} not found`);
      }

      localStorage.setItem(
        BLOG_POSTS_STORAGE_KEY,
        JSON.stringify(updatedPosts),
      );
    } else {
      // Use Supabase
      // 1. First delete related tags
      await supabase.from("blog_posts_tags").delete().eq("post_id", id);

      // 2. Then delete the post
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) {
        throw new Error(`Failed to delete blog post: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error(`Failed to delete blog post with ID ${id}`);
  }
};

// CRUD operations for categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const delay = Math.random() * 300 + 100; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      return JSON.parse(
        localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]",
      ) as Category[];
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*");

      if (error) throw error;

      return (data || []).map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

// CRUD operations for tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const delay = Math.random() * 300 + 100; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      return JSON.parse(
        localStorage.getItem(TAGS_STORAGE_KEY) || "[]",
      ) as Tag[];
    } else {
      // Use Supabase
      const { data, error } = await supabase.from("blog_tags").select("*");

      if (error) throw error;

      return (data || []).map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }));
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
};
