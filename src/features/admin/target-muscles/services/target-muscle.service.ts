import { ApiResponse } from "@/types/api.types";
import { UpdateTargetMuscles } from "@/features/admin/target-muscles/types/target-muscle.types";
import { buildQueryParams, TableQueryParams } from "@/infrastructure/api/query-builder";
import { api } from "@/infrastructure/api/protected-client";
import { PaginationMeta } from "@/types/common.types";
import { TARGET_MUSCLE_API_PATHS } from "@/features/admin/target-muscles/api/target-muscle.api-routes";

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
