import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";

import type { ApiResponse } from "@/interface/api-response.interface";
import { TrainerAvailability, CreateAvailabilityPayload, UpdateAvailabilityPayload } from "@/interface/booking.interface";
import { PaginatedResponse, UploadProfilePictureResponse } from "@/interface/common.interface";
import { TrainerDetail, TrainerListResponse, TrainerOnboardingResponse, TrainerProfileInterface, TrainerProfileStatus } from "@/interface/trainer.interface";
import { ProfileUpdatePayload } from "@/interface/user.interface";
import { PaginationMeta } from "@/interface/common.interface";

import { TRAINER_API_ROUTES } from "@/modules/trainer/constant/api-routes";
import { TrainerWithProfile } from "@/ui.components/ui/table/table.types";

class TrainerService {
  async getTrainerProfile(): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await api.get<ApiResponse<TrainerProfileInterface>>("/trainer/profile");
    return response.data;
  }

  async updateTrainerProfile(data: ProfileUpdatePayload): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await api.put<ApiResponse<TrainerProfileInterface>>("/trainer/profile", data);
    return response.data;
  }

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await api.post<ApiResponse<UploadProfilePictureResponse>>(
      "/trainer/profile-picture",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async uploadCoverPhoto(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await api.post<ApiResponse<UploadProfilePictureResponse>>(
      "/trainer/cover-photo",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async uploadTrainerDocument(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await api.post<ApiResponse<UploadProfilePictureResponse>>(
      "/trainer/document",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async submitTrainerProfile(formData: FormData): Promise<ApiResponse<TrainerOnboardingResponse>> {
    const response = await api.post<ApiResponse<TrainerOnboardingResponse>>(
      "/trainer/profile",
      formData
    );
    return response.data;
  }

  async getTrainerProfileStatus(): Promise<ApiResponse<TrainerProfileStatus>> {
    const response = await api.get<ApiResponse<TrainerProfileStatus>>("/trainer/profile/status");
    return response.data;
  }

  // Availability & Slots
  async createAvailability(data: CreateAvailabilityPayload): Promise<ApiResponse<{ message: string; generatedSlots: number }>> {
    const response = await api.post("/booking/availability", data);
    return response.data;
  }

  async getAvailabilities(params?: TableQueryParams & { status?: string }): Promise<ApiResponse<TrainerAvailability[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`/booking/availability?${queryParams.toString()}`);
    return response.data;
  }

  async updateAvailabilityStatus(availabilityId: string, data: UpdateAvailabilityPayload): Promise<ApiResponse<TrainerAvailability>> {
    const response = await api.patch(`/booking/availability/${availabilityId}/status`, data);
    return response.data;
  }
  async getTrainers<T = TrainerListResponse>(params?: TableQueryParams): Promise<ApiResponse<T[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${TRAINER_API_ROUTES.TRAINERS}?${queryParams.toString()}`);
    return response.data;
  }

  async getTrainerById(id: string): Promise<ApiResponse<TrainerDetail>> {
    const response = await api.get(TRAINER_API_ROUTES.TRAINER_BY_ID(id));
    return response.data;
  }

  async getTrainerProfileById(id: string): Promise<ApiResponse<TrainerWithProfile>> {
    const response = await api.get(TRAINER_API_ROUTES.PROFILE_BY_ID(id));
    return response.data;
  }

async toggleTrainerBlockStatus(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await api.patch(TRAINER_API_ROUTES.TOGGLE_BLOCK_TRAINER(id));
  return response.data;
}


  async approveTrainer(id: string): Promise<ApiResponse<{message:string}>> {
    const response = await api.patch(TRAINER_API_ROUTES.APPROVE_PROFILE(id));
    return response.data;
  }

  async rejectTrainer(id: string, reason: string): Promise<ApiResponse<{message:string}>> {
    const response = await api.patch(TRAINER_API_ROUTES.REJECT_PROFILE(id), { reason });
    return response.data;
  }

  async getTrainerAppointments(params?: TableQueryParams): Promise<PaginatedResponse<TrainerWithProfile>> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${TRAINER_API_ROUTES.APPOINTMENTS}?${queryParams.toString()}`);
    return response.data;
  }
}

export const trainerService = new TrainerService();
