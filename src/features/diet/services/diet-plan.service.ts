import { DIET_PLAN_API_ROUTES } from "@/features/diet/api/diet-plan.api-routes";
import { AxiosResponse, isAxiosError } from "axios";
import { api } from "@/infrastructure/api/client";
import { GetDietPlansResponseDto, DietPlanResponseDto } from "@/features/diet/types/diet-plan.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const DietPlanService = {
  generateDietPlan: async (): Promise<ApiResponse<DietPlanResponseDto>> => {
    try {
      const response: AxiosResponse<ApiResponse<DietPlanResponseDto>> = await api.post(DIET_PLAN_API_ROUTES.GENERATE);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getDietPlans: async (): Promise<ApiResponse<GetDietPlansResponseDto>> => {
    try {
      const response: AxiosResponse<ApiResponse<GetDietPlansResponseDto>> = await api.get(DIET_PLAN_API_ROUTES.GET_PLANS);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};
