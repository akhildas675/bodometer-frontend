import { api } from "@/infrastructure/api/protected-client";
import { buildQueryParams } from "@/infrastructure/api/query-builder";
import { MEAL_CATEGORY_API_ROUTES } from "@/features/admin/meal-categories/api/meal-category.api-routes";
import type { MealCategory, MealCategoryQueryDto, UpdateMealCategory } from "@/features/admin/meal-categories/types/meal-category.types";
import type { PaginatedResponse, PaginationMeta } from "@/types/common.types";
import type { ApiResponse } from "@/types/api.types";

class MealCategoryService {
  async createMealCategory(mealCategoryData: MealCategory): Promise<ApiResponse<{message:string}>> {
    const response = await api.post<ApiResponse<{message:string}>>(MEAL_CATEGORY_API_ROUTES.ROOT, mealCategoryData);
    return response.data;
  }

  async getAllMealCategories(query: MealCategoryQueryDto): Promise<PaginatedResponse<MealCategory>> {
    const queryParams = buildQueryParams(query);
    const response = await api.get<{
      success: boolean;
      message: string;
      data: MealCategory[];
      pagination: PaginationMeta;
    }>(
      MEAL_CATEGORY_API_ROUTES.ROOT,
      { params: queryParams }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  // User-facing category fetch
  async getMealCategory(params?: import("@/infrastructure/api/query-builder").TableQueryParams): Promise<ApiResponse<MealCategory[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 100, ...params });
    const { userApi } = await import("@/infrastructure/api/client");
    const response = await userApi.get(
      `${MEAL_CATEGORY_API_ROUTES.GET_MEAL_CATEGORIES_USER}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getMealCategoryById(id: string): Promise<MealCategory> {
    const response = await api.get<ApiResponse<MealCategory>>(
      MEAL_CATEGORY_API_ROUTES.BY_ID(id)
    );
    return response.data.data!;
  }

  async updateMealCategory(id: string, data: Partial<UpdateMealCategory>): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      MEAL_CATEGORY_API_ROUTES.BY_ID(id),
      data
    );
    return response.data;
  }

  async toggleMealCategoryStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      MEAL_CATEGORY_API_ROUTES.TOGGLE_STATUS(id)
    );
    return response.data;
  }
}

export default new MealCategoryService();


