export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author_id: string;
          published_at: string | null;
          updated_at: string;
          created_at: string;
          status: "draft" | "published" | "scheduled";
          category_id: string;
          featured_image: string;
          read_time: number;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author_id: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
          status: "draft" | "published" | "scheduled";
          category_id: string;
          featured_image: string;
          read_time?: number;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author_id?: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
          status?: "draft" | "published" | "scheduled";
          category_id?: string;
          featured_image?: string;
          read_time?: number;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      blog_tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      blog_posts_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          website: string | null;
          budget: string;
          company: string | null;
          message: string;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          website?: string | null;
          budget: string;
          company?: string | null;
          message: string;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          website?: string | null;
          budget?: string;
          company?: string | null;
          message?: string;
          created_at?: string;
          status?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
