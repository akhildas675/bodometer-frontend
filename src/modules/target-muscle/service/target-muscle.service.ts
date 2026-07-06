import { ApiResponse } from "@/interface/api-response.interface";
import { UpdateTargetMuscles } from "@/interface/target-muscle.interface";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { api } from "@/api/protected.instance";
import { PaginationMeta } from "@/interface/common.interface";
import { TARGET_MUSCLE_API_PATHS } from "../constant/api-routes";

export const targetMuscleService = {
  async createTargetMuscle(
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      TARGET_MUSCLE_API_PATHS.ROOT,
      data,
    );
    return response.data;
  },

  async updateTargetMuscle(
    id: string,
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      TARGET_MUSCLE_API_PATHS.BY_ID(id),
      data,
    );
    return response.data;
  },
  
  async getAllTargetMuscles(
    params?: TableQueryParams,
  ): Promise<ApiResponse<UpdateTargetMuscles[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(
      `${TARGET_MUSCLE_API_PATHS.ROOT}?${queryParams.toString()}`,
    );
    return response.data;
  },

  async getTargetMuscleById(id: string): Promise<ApiResponse<UpdateTargetMuscles>> {
    const response = await api.get<ApiResponse<UpdateTargetMuscles>>(
      TARGET_MUSCLE_API_PATHS.BY_ID(id),
    );
    return response.data;
  },

  async toggleTargetMuscleStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      TARGET_MUSCLE_API_PATHS.TOGGLE_STATUS(id),
    );
    return response.data;
  },
};
