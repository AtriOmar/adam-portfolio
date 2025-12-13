export interface Media {
  _id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  category: 'wedding' | 'portrait' | 'event' | 'other';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaApiResponse {
  data: {
    type: 'media';
    id: string;
    attributes: {
      title: string;
      description: string;
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
      category: 'wedding' | 'portrait' | 'event' | 'other';
      featured: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface MediaListApiResponse {
  data: {
    type: 'media';
    id: string;
    attributes: {
      title: string;
      description: string;
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
      category: 'wedding' | 'portrait' | 'event' | 'other';
      featured: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreateMediaDto {
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  category?: 'wedding' | 'portrait' | 'event' | 'other';
  featured?: boolean;
}

export interface UpdateMediaDto extends Partial<CreateMediaDto> {}

export interface MediaFilters {
  category?: string;
  type?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}
