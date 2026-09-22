import { api, userApi } from "@/infrastructure/api/client";
import { HEALTH_LOG_API_ROUTES } from "@/features/health/api/health-log.api-routes";
import type { HealthLogDto, UpsertHealthLogDto, HealthLogProgressResponseDto } from "@/features/health/types/health-log.types";
import type { ApiResponse } from "@/types/api.types";
import { CalculateBmiPayload, BmiCalculationResult } from "@/features/user/types/bmi.types";

class HealthLogService {
  async getHealthLog(date: string): Promise<ApiResponse<HealthLogDto>> {
    const response = await userApi.get(`${HEALTH_LOG_API_ROUTES.GET_HEALTH_LOG}?date=${date}`);
    return response.data;
  }

  async upsertHealthLog(data: UpsertHealthLogDto): Promise<ApiResponse<HealthLogDto>> {
    const response = await userApi.post<ApiResponse<HealthLogDto>>(
      HEALTH_LOG_API_ROUTES.UPSERT_HEALTH_LOG,
      data
    );
    return response.data;
  }

  async getHealthLogProgress(timeframe?: string): Promise<ApiResponse<HealthLogProgressResponseDto>> {
    const url = timeframe 
      ? `${HEALTH_LOG_API_ROUTES.GET_HEALTH_LOG_PROGRESS}?timeframe=${timeframe}`
      : HEALTH_LOG_API_ROUTES.GET_HEALTH_LOG_PROGRESS;
    const response = await userApi.get<ApiResponse<HealthLogProgressResponseDto>>(url);
    return response.data;
  }

  async calculateBmiPublic(data: CalculateBmiPayload): Promise<ApiResponse<BmiCalculationResult>> {
    const response = await api.post<ApiResponse<BmiCalculationResult>>(HEALTH_LOG_API_ROUTES.CALCULATE_BMI, data);
    return response.data;
  }
}

export const healthLogService = new HealthLogService();
