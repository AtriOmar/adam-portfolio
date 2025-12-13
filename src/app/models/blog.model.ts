export interface Blog {
  id: string;
  attributes: {
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    featuredImage?: {
      url: string;
      alt: string;
    };
    category: string;
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    slug?: string;
    views: number;
    readTime: number;
    metaDescription?: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface BlogResponse {
  data: Blog[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface BlogStats {
  published: number;
  drafts: number;
  totalViews: number;
}
