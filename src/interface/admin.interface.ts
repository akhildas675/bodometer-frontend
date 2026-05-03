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
