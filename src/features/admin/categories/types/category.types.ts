export interface Category {
  name: string;
  description: string;
  image: File | null;
}

export interface UpdateCategory {
  categoryId: string;
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  categoryId: string;
  name: string;
  description: string;
  image: string;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  media: { image: { url: string } };
  isActive: boolean;
  createdAt: string;
}

export interface CategoryListItem {
  categoryId: string;
  _id?: string;
  name: string;
  description: string;
  media?: { image?: { url: string } };
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDetail {
  categoryId: string;
  name: string;
  description: string;
  media?: { image?: { url: string } };
  image?: string;
  isActive: boolean;
}
