import { ApiResponse } from "@/types/api.types";
import { CoachingForm, CoachingListItem, CoachingDetail } from "@/features/admin/coaching/types/coaching.types";
import { COACHING_API_PATHS } from "@/features/admin/coaching/api/coaching.api-routes";
import { api } from "@/infrastructure/api/client";
import { buildQueryParams, TableQueryParams } from "@/infrastructure/api/query-builder";
import { PaginationMeta } from "@/types/common.types";

export const coachingService ={
  async createCoaching(form: CoachingForm): Promise<ApiResponse> {
    const response = await api.post(COACHING_API_PATHS.ROOT, form);
    return response.data;
  },

 async getCoachingServices(
    params?: TableQueryParams & { durationMinutes?: number }
  ): Promise<ApiResponse<CoachingListItem[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(
      `${COACHING_API_PATHS.ROOT}?${queryParams.toString()}`
    );
    return response.data;
  },
  
  async getCoachingServiceById(id: string): Promise<ApiResponse<CoachingDetail>> {
    const response = await api.get(COACHING_API_PATHS.BY_ID(id));
    return response.data;
  },

  async updateCoachingService(id: string, form: CoachingForm): Promise<ApiResponse> {
    const response = await api.put(COACHING_API_PATHS.BY_ID(id), form);
    return response.data;
  },

  async toggleCoachingStatus(id: string): Promise<ApiResponse> {
    const response = await api.patch(COACHING_API_PATHS.TOGGLE_STATUS(id));
    return response.data;
  },
}