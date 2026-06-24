import { ApiResponse } from "@/interface/api-response.interface";
import { ExerciseRow } from "@/interface/exercise.interface";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { api } from "@/api/protected.instance";
import { PaginationMeta } from "@/interface/common.interface";
import { EXERCISE_API_PATHS } from "../constant/exercise-api.path";

export const exerciseService = {
  async createExercise(
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      EXERCISE_API_PATHS.ROOT,
      data,
    );
    return response.data;
  },

  async updateExercise(
    id: string,
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      EXERCISE_API_PATHS.BY_ID(id),
      data,
    );
    return response.data;
  },
  
  async getAllExercises(
    params?: TableQueryParams,
  ): Promise<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(
      `${EXERCISE_API_PATHS.ROOT}?${queryParams.toString()}`,
    );
    return response.data;
  },

  async getExerciseById(id: string): Promise<ApiResponse<ExerciseRow>> {
    const response = await api.get<ApiResponse<ExerciseRow>>(
      EXERCISE_API_PATHS.BY_ID(id),
    );
    return response.data;
  },

  async toggleExerciseStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      EXERCISE_API_PATHS.TOGGLE_STATUS(id),
    );
    return response.data;
  },
};
