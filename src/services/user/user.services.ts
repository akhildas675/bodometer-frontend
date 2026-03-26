import { userApi } from "@/api/api.instance";

import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";
import { PaginationMeta } from "@/interface/admin.interface";

import type { ApiResponse } from "@/interface/api-response.interface";

import type {
  ActiveSubscription,
  ProfileUpdatePayload,
  SubscriptionPlan,
  TrainerDetail,
  TrainerListItem,
  UploadProfilePictureResponse,
  UserProfileInterface,
  UserWorkout,
  WorkoutDetailResponse,
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

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await userApi.patch(USER_API_ROUTES.CHANGE_PASSWORD, data);
    return response.data;
  },

  async getWorkouts(
    page = 1,
    limit = 6,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<ApiResponse<UserWorkout[]> & { pagination: PaginationMeta }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await userApi.get(
      `${USER_API_ROUTES.GET_WORKOUTS}?${params.toString()}`
    );
    return response.data;
  },

  async getWorkoutDetail(id: string): Promise<ApiResponse<WorkoutDetailResponse>> {
    const response = await userApi.get(USER_API_ROUTES.GET_WORKOUT_DETAIL(id));
    return response.data;
  },

  async getSubscriptions(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await userApi.get(USER_API_ROUTES.GET_SUBSCRIPTIONS);
    return response.data;
  },

  async getMySubscription(): Promise<ApiResponse<ActiveSubscription | null>> {
    const response = await userApi.get(USER_API_ROUTES.GET_MY_SUBSCRIPTION);
    return response.data;
  },

  async createCheckoutSession(planId: string): Promise<ApiResponse<{ sessionId: string; url: string }>> {
    const response = await userApi.post(USER_API_ROUTES.CREATE_CHECKOUT_SESSION, { planId });
    return response.data;
  },

  async getTrainers(
    page = 1,
    limit = 9,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    specializationId?: string,
  ): Promise<ApiResponse<TrainerListItem[]> & { pagination: PaginationMeta }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (specializationId) params.append("specializationId", specializationId);
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_TRAINERS}?${params.toString()}`
    );
    return response.data;
  },

  async getTrainerById(id:string):Promise<ApiResponse<TrainerDetail>>{
    const response = await userApi.get<ApiResponse<TrainerDetail>>(USER_API_ROUTES.GET_TRAINER_BY_ID(id),);
    return response.data
  }

};

export default userServices;