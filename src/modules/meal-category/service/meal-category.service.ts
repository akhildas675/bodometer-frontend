import { api } from "@/api/protected.instance";
import { buildQueryParams } from "@/api/query.helper";
import { MEAL_CATEGORY_API_ROUTES } from "../constant/api-routes";
import type { MealCategory, MealCategoryQueryDto, UpdateMealCategory } from "../types/meal-category.interface";
import type { PaginatedResponse, PaginationMeta } from "@/interface/common.interface";
import type { ApiResponse } from "@/interface/api-response.interface";

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
  async getMealCategory(params?: import("@/api/query.helper").TableQueryParams): Promise<ApiResponse<MealCategory[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 100, ...params });
    const { userApi } = await import("@/api/api.instance");
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


