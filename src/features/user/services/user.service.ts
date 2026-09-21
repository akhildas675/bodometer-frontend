import { USER_API_ROUTES } from "@/features/user/api/user.api-routes";
import { api } from "@/infrastructure/api/client";
import { buildQueryParams, TableQueryParams } from "@/infrastructure/api/query-builder";
import { PaginationMeta, PaginatedResponse } from "@/types/common.types";
import type { ApiResponse } from "@/types/api.types";
import { UploadProfilePictureResponse } from "@/types/common.types";
import { ProfileUpdatePayload, UserProfileInterface, AdminGetUsersResponse } from "@/features/user/types/user.types";

class UserService {
  // User Profile Actions
  async getUserProfile(): Promise<ApiResponse<UserProfileInterface>> {
    const response = await api.get<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.PROFILE);
    return response.data;
  }

  async updateUserProfile(data: ProfileUpdatePayload): Promise<ApiResponse<UserProfileInterface>> {
    const response = await api.put<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.PROFILE, data);
    return response.data;
  }

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await api.post<ApiResponse<UploadProfilePictureResponse>>(USER_API_ROUTES.PROFILE_PICTURE, data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string; }): Promise<ApiResponse<null>> {
    const response = await api.patch(USER_API_ROUTES.CHANGE_PASSWORD, data);
    return response.data;
  }


  async getUsers(params?: TableQueryParams): Promise<PaginatedResponse<AdminGetUsersResponse>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{ success: boolean; data: AdminGetUsersResponse[]; pagination: PaginationMeta; }>(USER_API_ROUTES.USERS, { params: queryParams });
    return { data: response.data.data, pagination: response.data.pagination };
  }
  async toggleStatusUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(USER_API_ROUTES.TOGGLE_USER_STATUS(userId));
    return response.data;
  }

}

export const userService = new UserService();
