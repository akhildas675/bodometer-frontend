import { trainerApi } from "@/api/api.instance";

import { TRAINER_API_ROUTES } from "@/constants/constant-routes/api-routes/trainer-constant.routes";

import type { ApiResponse } from "@/interface/api-response.interface";

import type {
  ProfileUpdatePayload,
  TrainerOnboardingResponse,
  TrainerProfileInterface,
  TrainerProfileStatus,
  UploadProfilePictureResponse,
  WorkoutList,
} from "@/interface/trainer.interface";

class TrainerService {
  async getTrainerProfile(): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await trainerApi.get<ApiResponse<TrainerProfileInterface>>(TRAINER_API_ROUTES.TRAINER_PROFILE);
    return response.data;
  }

  async updateTrainerProfile(data: ProfileUpdatePayload): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await trainerApi.put<ApiResponse<TrainerProfileInterface>>(TRAINER_API_ROUTES.TRAINER_PROFILE_UPDATE, data);
    return response.data;
  }

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await trainerApi.post<ApiResponse<UploadProfilePictureResponse>>(
      TRAINER_API_ROUTES.TRAINER_PROFILE_PICTURE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async workoutList(): Promise<ApiResponse<WorkoutList[]>> {
    const response = await trainerApi.get<ApiResponse<WorkoutList[]>>(TRAINER_API_ROUTES.GET_WORKOUT_LIST);
    return response.data;
  }

  async submitTrainerProfile(
    formData: FormData
  ): Promise<ApiResponse<TrainerOnboardingResponse>> {
    const response = await trainerApi.post<ApiResponse<TrainerOnboardingResponse>>(
      TRAINER_API_ROUTES.SUBMIT_PROFILE_DATA,
      formData
    );

    return response.data;
  }

  async getTrainerProfileStatus(): Promise<ApiResponse<TrainerProfileStatus>> {
    const response = await trainerApi.get<ApiResponse<TrainerProfileStatus>>("/profile/status");
    return response.data
  }
}

export default new TrainerService();