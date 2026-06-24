import { userApi } from "@/api/api.instance";
import { HEALTH_LOG_API_ROUTES } from "../constant/api-routes";
import type { HealthLogDto, UpsertHealthLogDto, HealthLogProgressResponseDto } from "../types/health-log.interface";
import type { ApiResponse } from "@/interface/api-response.interface";

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
}

export default new HealthLogService();
