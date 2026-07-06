import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { PaginationMeta } from "@/interface/common.interface";
import { UpdateEquipment } from "@/interface/equipment.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import { CalculateBmiPayload, BmiCalculationResult } from "@/interface/bmi.interface";
import { UploadProfilePictureResponse } from "@/interface/common.interface";
import { TrainerDetail, TrainerListItem } from "@/interface/trainer.interface";
import { ProfileUpdatePayload, UserProfileInterface } from "@/interface/user.interface";
import type { ExerciseRow } from "@/interface/exercise.interface";

const userService = {
  async getUserProfile(): Promise<ApiResponse<UserProfileInterface>> {
    const response = await api.get<ApiResponse<UserProfileInterface>>("/user/profile");
    return response.data;
  },
  async updateUserProfile(data: ProfileUpdatePayload): Promise<ApiResponse<UserProfileInterface>> {
    const response = await api.put<ApiResponse<UserProfileInterface>>("/user/profile", data);
    return response.data;
  },
  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await api.post<ApiResponse<UploadProfilePictureResponse>>("/user/profile-picture", data);
    return response.data;
  },
  async changePassword(data: { currentPassword: string; newPassword: string; }): Promise<ApiResponse<null>> {
    const response = await api.patch("/user/change-password", data);
    return response.data;
  },
  async getTrainers(params?: TableQueryParams): Promise<ApiResponse<TrainerListItem[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 9, ...params });
    const response = await api.get(`/trainer/trainers?${queryParams.toString()}`);
    return response.data;
  },
  async getTrainerById(id: string): Promise<ApiResponse<TrainerDetail>> {
    const response = await api.get<ApiResponse<TrainerDetail>>('/trainer/trainers/' +  id);
    return response.data;
  },
  async getEquipment(params?: TableQueryParams): Promise<ApiResponse<UpdateEquipment[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 1000, ...params });
    const response = await api.get(`/equipment?${queryParams.toString()}`);
    return response.data;
  },
  async calculateBmiPublic(data: CalculateBmiPayload): Promise<ApiResponse<BmiCalculationResult>> {
    const response = await api.post<ApiResponse<BmiCalculationResult>>("/user/calculate-bmi", data);
    return response.data;
  },
  async getExercises(params?: TableQueryParams & { difficulty?: string; targetMuscleId?: string; categoryId?: string }): Promise<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 12, ...params });
    const response = await api.get<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }>(`/exercises?${queryParams.toString()}`);
    return response.data;
  },
  async getExerciseById(id: string): Promise<ApiResponse<ExerciseRow>> {
    const response = await api.get<ApiResponse<ExerciseRow>>('/exercises/' +  id);
    return response.data;
  },
};

export default userService;
