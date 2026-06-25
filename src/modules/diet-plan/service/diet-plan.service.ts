import { AxiosResponse } from "axios";
import { userApi } from "../../../api/api.instance";
import { GetDietPlansResponseDto, DietPlanResponseDto } from "../types/diet-plan.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const DietPlanService = {
  generateDietPlan: async (): Promise<ApiResponse<DietPlanResponseDto>> => {
    try {
      const response: AxiosResponse<ApiResponse<DietPlanResponseDto>> = await userApi.post("/diet-plan/generate");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getDietPlans: async (): Promise<ApiResponse<GetDietPlansResponseDto>> => {
    try {
      const response: AxiosResponse<ApiResponse<GetDietPlansResponseDto>> = await userApi.get("/diet-plan");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};
