import { adminApi } from "../../api/api.instance";
import type { TrainerWithProfile } from "../../components/ui/table/table.types";
import type {
  AdminGetTrainersResponse,
  AdminGetUsersResponse,
  Workout,
} from "../../interface/admin.interface";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { PaginatedResponse } from "../../interface/admin.interface";
import type { PaginationMeta } from "../../interface/admin.interface";
import { ADMIN_API_ROUTES } from "../../constants/constant-routes/api-routes/admin-constant.routes";

class AdminService {
  // User Management
  async getUsers(
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<AdminGetUsersResponse>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetUsersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_USERS, { params });

    console.log("API Response Users:", response.data);

    
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockUser(userId: string): Promise<ApiResponse<null>> {
    console.log("frontend userid....", userId);
    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_USER(userId)
    );
 
    return response.data;
  }

  async unblockUser(userId: string): Promise<ApiResponse<null>> {
    console.log("frontend userid....", userId);
    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_USER(userId)
    );
    console.log(response.data);
    return response.data;
  }

  // Trainer Block/Unblock Management

  async getTrainers(
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<AdminGetTrainersResponse>> {
    const params: Record<string, string | number> = {};

    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetTrainersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINERS, { params });

    console.log("API Response trainers:", response.data);

    
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockTrainer(trainerId: string): Promise<ApiResponse<null>> {
    console.log("trainer id... frontend", trainerId);
    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_TRAINER(trainerId)
    );
    console.log(response.data);
    return response.data;
  }

  async unblockTrainer(trainerId: string): Promise<ApiResponse<null>> {
    console.log("trainer id...frontend", trainerId);
    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_TRAINER(trainerId)
    );
    console.log(response.data);
    return response.data;
  }

  // Workouts
  async getWorkouts(): Promise<ApiResponse<Workout[]>> {
    const response = await adminApi.get<ApiResponse<Workout[]>>(ADMIN_API_ROUTES.GET_WORKOUTS);
    return response.data;
  }

  async addWorkouts(data: FormData): Promise<ApiResponse<Workout>> {
    const response = await adminApi.post(ADMIN_API_ROUTES.ADD_WORKOUT, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Get all trainer appointments
  async getTrainerAppointments(): Promise<ApiResponse<TrainerWithProfile[]>> {
    const response = await adminApi.post<ApiResponse<TrainerWithProfile[]>>(
      ADMIN_API_ROUTES.GET_TRAINER_APPOINTMENTS
    );
    return response.data;
  }

  // get trainer by profileId 
  async getTrainerByProfileId(
    profileId: string
  ): Promise<ApiResponse<TrainerWithProfile>> {
    const response = await adminApi.get<ApiResponse<TrainerWithProfile>>(
      ADMIN_API_ROUTES.GET_TRAINER_BY_PROFILE_ID(profileId)
    );
    return response.data;
  }

  //approve trainer
  async approveTrainer(
    profileId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.APPROVE_TRAINER(profileId)
    );
    return response.data;
  }

  //reject trainer
  async rejectTrainer(
    profileId: string,
    reason: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.REJECT_TRAINER(profileId),
      { reason }
    );
    return response.data;
  }
}

export default new AdminService();