import { EXERCISE_API_ROUTES } from "@/modules/exercise/constant/api-routes";
import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { PaginationMeta } from "@/interface/common.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import type { ExerciseRow } from "@/interface/exercise.interface";

class ExerciseService {
  async getExercises(params?: TableQueryParams & { difficulty?: string; targetMuscleId?: string; categoryId?: string }): Promise<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 12, ...params });
    const response = await api.get<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }>(`${EXERCISE_API_ROUTES.EXERCISES}?${queryParams.toString()}`);
    return response.data;
  }

  async getExerciseById(id: string): Promise<ApiResponse<ExerciseRow>> {
    const response = await api.get<ApiResponse<ExerciseRow>>(EXERCISE_API_ROUTES.EXERCISE_BY_ID(id));
    return response.data;
  }

  async createExercise(data: FormData): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(EXERCISE_API_ROUTES.EXERCISES, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }

  async updateExercise(id: string, data: FormData): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put(EXERCISE_API_ROUTES.EXERCISE_BY_ID(id), data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }

  async toggleExerciseStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch(EXERCISE_API_ROUTES.STATUS(id), {  });
    return response.data;
  }
}

export const exerciseService = new ExerciseService();
