import type { Gender } from "@/constants/identity";
import type { Role } from "@/constants/role";

export interface UsersListRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: Exclude<Role, "admin">;
  status?: "active" | "blocked";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UsersListResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}


export type AdminGetUsersRequest = UsersListRequest;
export type AdminGetUsersResponse = UsersListResponse;

export interface UserProfileInterface {
  id: string;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  gender: Gender;
  profilePic: string | null;
  dateOfBirth: Date | null;
}

export interface ProfileUpdatePayload {
  name: string;
  userName: string;
  phoneNumber: string | null;
  gender?: Gender;
  profilePic?: string;
  dateOfBirth?: Date | null;
  // Shared trainer fields allowed in the same payload for ease of use
  experienceInYears?: number;
  bio?: string;
  specializations?: string[];
  coverPhoto?: string;
  certifications?: string[];
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfileInterface;
}
