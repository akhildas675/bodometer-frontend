import { trainerApi } from "../../api/api.instance";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { TrainerOnboardingResponse, WorkoutList } from "../../interface/trainer.interface";

class TrainerService {
    async workoutList(): Promise<ApiResponse<WorkoutList[]>> {
        const response = await trainerApi.get<ApiResponse<WorkoutList[]>>("/get-workout-list");
        return response.data
    }

    async submitTrainerProfile(
        formData: FormData
    ): Promise<ApiResponse<TrainerOnboardingResponse>> {
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

export default new TrainerService()