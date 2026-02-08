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

class AdminService {
  // User Management
  async getUsers(): Promise<ApiResponse<AdminGetUsersResponse[]>> {
    const response = await adminApi.get<ApiResponse<AdminGetUsersResponse[]>>(
      "/get-users"
    );
    return response.data;
  }

  async blockUser(userId: string): Promise<ApiResponse<null>> {
    console.log("frontend userid....", userId);
    const response = await adminApi.patch<ApiResponse<null>>(
      `/users/${userId}/block`
    );
    return response.data;
  }

  async unblockUser(userId: string): Promise<ApiResponse<null>> {
    console.log("frontend userid....", userId);
    const response = await adminApi.patch<ApiResponse<null>>(
      `/users/${userId}/unblock`
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
  }>("/get-trainers", { params });
  
  console.log("API Response:", response.data);
  
  // Return in the format expected by frontend
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}

  async blockTrainer(trainerId: string): Promise<ApiResponse<null>> {
    console.log("trainer id... frontend", trainerId);
    const response = await adminApi.patch<ApiResponse<null>>(
      `/trainer/${trainerId}/block`
    );
    console.log(response.data);
    return response.data;
  }

  async unblockTrainer(trainerId: string): Promise<ApiResponse<null>> {
    console.log("trainer id...frontend", trainerId);
    const response = await adminApi.patch<ApiResponse<null>>(
      `/trainer/${trainerId}/unblock`
    );
    console.log(response.data);
    return response.data;
  }

  // Workouts
  async getWorkouts(): Promise<ApiResponse<Workout[]>> {
    const response = await adminApi.get<ApiResponse<Workout[]>>("/get-workouts");
    return response.data;
  }

  async addWorkouts(data: FormData): Promise<ApiResponse<Workout>> {
    const response = await adminApi.post("/add-workout", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Get all trainer appointments
  async getTrainerAppointments(): Promise<ApiResponse<TrainerWithProfile[]>> {
    const response = await adminApi.post<ApiResponse<TrainerWithProfile[]>>(
      "/get-trainer-appointments"
    );
    return response.data;
  }

  // get trainer by profileId 
  async getTrainerByProfileId(
    profileId: string
  ): Promise<ApiResponse<TrainerWithProfile>> {
    const response = await adminApi.get<ApiResponse<TrainerWithProfile>>(
      `/trainers/profile/${profileId}`
    );
    return response.data;
  }

  //approve trainer
  async approveTrainer(
    profileId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      `/trainers/${profileId}/approve`
    );
    return response.data;
  }

  //reject trainer
  async rejectTrainer(
    profileId: string,
    reason: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      `/trainers/${profileId}/reject`,
      { reason }
    );
    return response.data;
  }
}

export default new AdminService();