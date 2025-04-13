export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  status: "draft" | "published" | "scheduled";
  category: Category;
  tags: Tag[];
  featuredImage: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
}

export interface BlogPostFilter {
  search?: string;
  categoryId?: string;
  tagIds?: string[];
  status?: "draft" | "published" | "scheduled";
  authorId?: string;
  page?: number;
  limit?: number;
}
