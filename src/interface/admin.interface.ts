import type { Role } from "@/constants/role";

export interface AdminGetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: Exclude<Role, "admin">;
  status?: "active" | "blocked";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


export interface AdminGetUsersResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminGetTrainersRequest extends AdminGetUsersRequest {
  role?: "trainer";
}

export interface AdminGetTrainersResponse extends AdminGetUsersResponse {
  role: "trainer";
}


export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

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

/** Shape returned by the backend getAllCategories / getCategoryById endpoints */
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
