// src/types/blog.ts
export interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  authorId: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: Tag[];
  author: Author;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  status: "draft" | "published" | "scheduled";
  featuredImage: string;
  readTime: number;
}
