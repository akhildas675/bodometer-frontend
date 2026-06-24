import { adminApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";



import { PaginatedResponse, PaginationMeta } from "@/interface/common.interface";
import { AdminGetUsersResponse } from "@/interface/user.interface";
import { AdminGetTrainersResponse } from "@/interface/trainer.interface";
import { TrainerBooking } from "@/interface/booking.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import type { UpdateTargetMuscles } from "@/interface/target-muscle.interface";
import type { UpdateEquipment } from "@/interface/equipment.interface";
import type { ExerciseRow } from "@/interface/exercise.interface";

import { ADMIN_API_ROUTES } from "@/constants/constant-routes/api-routes/admin-constant.routes";


class AdminService {
  // User Management
  async getUsers(params?: TableQueryParams): Promise<PaginatedResponse<AdminGetUsersResponse>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetUsersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_USERS, { params: queryParams });




    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockUser(userId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_USER(userId)
    );

    return response.data;
  }

  async unblockUser(userId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_USER(userId)
    );

    return response.data;
  }

  // Trainer Block/Unblock Management

  async getTrainers(params?: TableQueryParams): Promise<PaginatedResponse<AdminGetTrainersResponse>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetTrainersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINERS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockTrainer(trainerId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_TRAINER(trainerId)
    );

    return response.data;
  }

  async unblockTrainer(trainerId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_TRAINER(trainerId)
    );

    return response.data;
  }


  // Get all trainer appointments
  async getTrainerAppointments(params?: TableQueryParams): Promise<PaginatedResponse<TrainerWithProfile>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: TrainerWithProfile[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINER_APPOINTMENTS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
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
 

 


 





  



  // Bookings
  async getAllBookings(params?: TableQueryParams & { status?: string; date?: string }): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await adminApi.get(`${ADMIN_API_ROUTES.GET_ALL_BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<TrainerBooking>> {
    const url = ADMIN_API_ROUTES.CANCEL_BOOKING.replace(":bookingId", bookingId);
    const response = await adminApi.patch(url);
    return response.data;
  }
}

export default new AdminService();