import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { BlogPost, Category, Tag } from "../types/blog";
import { ContactFormValues } from "../api/contact";

// Local storage keys
const BLOG_POSTS_STORAGE_KEY = "blog_posts";
const CATEGORIES_STORAGE_KEY = "blog_categories";
const TAGS_STORAGE_KEY = "blog_tags";
const CONTACT_SUBMISSIONS_KEY = "contactSubmissions";

// Migration status type
export type MigrationStatus = {
  inProgress: boolean;
  completed: boolean;
  error: string | null;
  stats: {
    blogPosts: number;
    categories: number;
    tags: number;
    contactSubmissions: number;
  };
};

// Initial migration status
export const initialMigrationStatus: MigrationStatus = {
  inProgress: false,
  completed: false,
  error: null,
  stats: {
    blogPosts: 0,
    categories: 0,
    tags: 0,
    contactSubmissions: 0,
  },
};

/**
 * Migrates blog posts from localStorage to Supabase
 */
async function migrateBlogPosts(): Promise<number> {
  try {
    // Get blog posts from localStorage
    const posts = JSON.parse(
      localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]",
    ) as BlogPost[];

    if (posts.length === 0) return 0;

    // Insert posts into Supabase
    for (const post of posts) {
      // Insert the post
      const { error: postError } = await supabase.from("blog_posts").insert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author_id: post.author.id,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        published_at: post.publishedAt,
        status: post.status,
        category_id: post.category.id,
        featured_image: post.featuredImage,
        read_time: post.readTime,
      });

      if (postError) throw postError;

      // Insert post tags
      if (post.tags.length > 0) {
        const tagInserts = post.tags.map((tag) => ({
          post_id: post.id,
          tag_id: tag.id,
        }));

        const { error: tagsError } = await supabase
          .from("blog_posts_tags")
          .insert(tagInserts);

        if (tagsError) throw tagsError;
      }
    }

    return posts.length;
  } catch (error) {
    console.error("Error migrating blog posts:", error);
    throw error;
  }
}

/**
 * Migrates categories from localStorage to Supabase
 */
async function migrateCategories(): Promise<number> {
  try {
    // Get categories from localStorage
    const categories = JSON.parse(
      localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]",
    ) as Category[];

    if (categories.length === 0) return 0;

    // Insert categories into Supabase
    const { error } = await supabase.from("blog_categories").insert(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
      })),
    );

    if (error) throw error;

    return categories.length;
  } catch (error) {
    console.error("Error migrating categories:", error);
    throw error;
  }
}

/**
 * Migrates tags from localStorage to Supabase
 */
async function migrateTags(): Promise<number> {
  try {
    // Get tags from localStorage
    const tags = JSON.parse(
      localStorage.getItem(TAGS_STORAGE_KEY) || "[]",
    ) as Tag[];

    if (tags.length === 0) return 0;

    // Insert tags into Supabase
    const { error } = await supabase.from("blog_tags").insert(
      tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
    );

    if (error) throw error;

    return tags.length;
  } catch (error) {
    console.error("Error migrating tags:", error);
    throw error;
  }
}

/**
 * Migrates contact submissions from localStorage to Supabase
 */
async function migrateContactSubmissions(): Promise<number> {
  try {
    // Get contact submissions from localStorage
    const submissions = JSON.parse(
      localStorage.getItem(CONTACT_SUBMISSIONS_KEY) || "[]",
    ) as Array<
      {
        id: string;
        createdAt: string;
        status: string;
      } & ContactFormValues
    >;

    if (submissions.length === 0) return 0;

    // Insert submissions into Supabase
    const { error } = await supabase.from("contact_submissions").insert(
      submissions.map((sub) => ({
        id: sub.id,
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        website: sub.website || null,
        budget: sub.budget,
        company: sub.company || null,
        message: sub.message,
        created_at: sub.createdAt,
        status: sub.status,
      })),
    );

    if (error) throw error;

    return submissions.length;
  } catch (error) {
    console.error("Error migrating contact submissions:", error);
    throw error;
  }
}

/**
 * Migrates all data from localStorage to Supabase
 */
export async function migrateDataToSupabase(
  onProgress?: (status: MigrationStatus) => void,
): Promise<MigrationStatus> {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    const error = "Supabase is not configured. Cannot migrate data.";
    const errorStatus: MigrationStatus = {
      ...initialMigrationStatus,
      error,
    };
    if (onProgress) onProgress(errorStatus);
    return errorStatus;
  }

  // Initialize status
  const status: MigrationStatus = { ...initialMigrationStatus };
  status.inProgress = true;
  if (onProgress) onProgress(status);

  try {
    // Migrate categories first (for foreign key relationships)
    status.stats.categories = await migrateCategories();
    if (onProgress) onProgress({ ...status });

    // Migrate tags
    status.stats.tags = await migrateTags();
    if (onProgress) onProgress({ ...status });

    // Migrate blog posts
    status.stats.blogPosts = await migrateBlogPosts();
    if (onProgress) onProgress({ ...status });

    // Migrate contact submissions
    status.stats.contactSubmissions = await migrateContactSubmissions();

    // Update final status
    status.inProgress = false;
    status.completed = true;
    if (onProgress) onProgress(status);

    return status;
  } catch (error) {
    console.error("Error during migration:", error);
    status.inProgress = false;
    status.error = error instanceof Error ? error.message : String(error);
    if (onProgress) onProgress(status);
    return status;
  }
}

/**
 * Checks if there is data in localStorage that can be migrated
 */
export function hasMigratableData(): boolean {
  const hasBlogPosts =
    JSON.parse(localStorage.getItem(BLOG_POSTS_STORAGE_KEY) || "[]").length > 0;
  const hasCategories =
    JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]").length > 0;
  const hasTags =
    JSON.parse(localStorage.getItem(TAGS_STORAGE_KEY) || "[]").length > 0;
  const hasContactSubmissions =
    JSON.parse(localStorage.getItem(CONTACT_SUBMISSIONS_KEY) || "[]").length >
    0;

  return hasBlogPosts || hasCategories || hasTags || hasContactSubmissions;
}
