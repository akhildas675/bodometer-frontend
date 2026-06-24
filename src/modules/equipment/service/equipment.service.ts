import { ApiResponse } from "@/interface/api-response.interface";
import { UpdateEquipment } from "@/interface/equipment.interface";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { api } from "@/api/protected.instance";
import { PaginationMeta } from "@/interface/common.interface";
import { EQUIPMENT_API_PATHS } from "../constant/equipment-api.path";

export const equipmentService = {
  async createEquipment(
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      EQUIPMENT_API_PATHS.ROOT,
      data,
    );
    return response.data;
  },

  async updateEquipment(
    id: string,
    data: FormData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      EQUIPMENT_API_PATHS.BY_ID(id),
      data,
    );
    return response.data;
  },
  
  async getAllEquipment(
    params?: TableQueryParams,
  ): Promise<ApiResponse<UpdateEquipment[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(
      `${EQUIPMENT_API_PATHS.ROOT}?${queryParams.toString()}`,
    );
    return response.data;
  },

  async getEquipmentById(id: string): Promise<ApiResponse<UpdateEquipment>> {
    const response = await api.get<ApiResponse<UpdateEquipment>>(
      EQUIPMENT_API_PATHS.BY_ID(id),
    );
    return response.data;
  },

  async toggleEquipmentStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      EQUIPMENT_API_PATHS.TOGGLE_STATUS(id),
    );
    return response.data;
  },
};
