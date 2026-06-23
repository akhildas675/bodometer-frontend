import { ApiResponse } from "@/interface/api-response.interface";
import { CategoryDetail, CategoryListItem } from "../types/category.interface";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { api } from "@/api/protected.instance";
import { PaginationMeta } from "@/interface/common.interface";
import { CATEGORY_API_PATHS } from "../constant/category-api.path";

export const categoryService = {
  async createCategory(
    categoryData: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      CATEGORY_API_PATHS.ROOT,
      categoryData,
    );
    return response.data;
  },

  async updateCategory(
    id: string,
    categoryData: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      CATEGORY_API_PATHS.BY_ID(id),
      categoryData,
    );
    return response.data;
  },
  async getCategories(
    params?: TableQueryParams,
  ): Promise<ApiResponse<CategoryListItem[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 9, ...params });
    const response = await api.get(
      `${CATEGORY_API_PATHS.ROOT}?${queryParams.toString()}`,
    );
    return response.data;
  },

  async getCategoryById(id: string): Promise<ApiResponse<CategoryDetail>> {
    const response = await api.get<ApiResponse<CategoryDetail>>(
      CATEGORY_API_PATHS.BY_ID(id),
    );
    return response.data;
  },

  async toggleCategoryStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      CATEGORY_API_PATHS.TOGGLE_STATUS(id),
    );
    return response.data;
  },
};
