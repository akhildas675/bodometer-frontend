import { EQUIPMENT_API_ROUTES } from "@/modules/equipment/constant/api-routes";
import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { PaginationMeta } from "@/interface/common.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import { UpdateEquipment } from "@/interface/equipment.interface";

class EquipmentService {
  async getEquipment(params?: TableQueryParams): Promise<ApiResponse<UpdateEquipment[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 1000, ...params });
    const response = await api.get(`${EQUIPMENT_API_ROUTES.EQUIPMENT}?${queryParams.toString()}`);
    return response.data;
  }

  async getEquipmentById(id: string): Promise<ApiResponse<UpdateEquipment>> {
    const response = await api.get(EQUIPMENT_API_ROUTES.EQUIPMENT_BY_ID(id));
    return response.data;
  }

  async createEquipment(data: FormData): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(EQUIPMENT_API_ROUTES.EQUIPMENT, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }

  async updateEquipment(id: string, data: FormData): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put(EQUIPMENT_API_ROUTES.EQUIPMENT_BY_ID(id), data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }

  async toggleEquipmentStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch(EQUIPMENT_API_ROUTES.STATUS(id));
    return response.data;
  }
}

export const equipmentService = new EquipmentService();
