import { userApi } from "@/api/api.instance";

import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";

import type { ApiResponse } from "@/interface/api-response.interface";

import type {
  ProfileUpdatePayload,
  UploadProfilePictureResponse,
  UserProfileInterface,
} from "@/interface/user.interface";

const userServices = {
  async getUserProfile(): Promise<ApiResponse<UserProfileInterface>> {
    const response = await userApi.get<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.USER_PROFILE);
    return response.data;
  },

  async updateUserProfile(data: ProfileUpdatePayload): Promise<ApiResponse<UserProfileInterface>> {
    const response = await userApi.put<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.PROFILE, data);
    return response.data;
  },

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await userApi.post<ApiResponse<UploadProfilePictureResponse>>(
     USER_API_ROUTES.PROFILE_PICTURE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default userServices;