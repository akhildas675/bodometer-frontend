import { trainerApi } from "../../api/api.instance";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { 
  ProfileUpdatePayload, 
  TrainerOnboardingResponse, 
  TrainerProfileInterface, 
  UploadProfilePictureResponse, 
  WorkoutList 
} from "../../interface/trainer.interface";

class TrainerService {
  async getTrainerProfile(): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await trainerApi.get<ApiResponse<TrainerProfileInterface>>("/trainer-profile");
    return response.data;
  }

  async updateTrainerProfile(data: ProfileUpdatePayload): Promise<ApiResponse<TrainerProfileInterface>> {
    const response = await trainerApi.put<ApiResponse<TrainerProfileInterface>>("/trainer-profile-update", data);
    return response.data;
  }

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await trainerApi.post<ApiResponse<UploadProfilePictureResponse>>(
      "/trainer-profile-picture",
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
    const response = await trainerApi.get<ApiResponse<WorkoutList[]>>("/get-workout-list");
    return response.data;
  }

  async submitTrainerProfile(formData: FormData): Promise<ApiResponse<TrainerOnboardingResponse>> {
    const response = await trainerApi.post<ApiResponse<TrainerOnboardingResponse>>(
      "/submit-profile-data",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

export default new TrainerService();