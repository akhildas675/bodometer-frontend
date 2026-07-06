import { userApi } from "@/api/api.instance";
import { WORKOUT_PLAN_API_ROUTES } from "@/modules/workout-plan/constant/api-routes";
import type { ApiResponse } from "@/interface/api-response.interface";
import { GetWorkoutPlansResponse, WorkoutPlanResponse, MarkDayCompletedPayload, MarkExerciseStatusPayload, WorkoutProgressResponse } from "../types/workout.types";
import { Timeframe } from "@/constants/fitness.constant";

export const workoutPlanService = {
  async generateWorkout(): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.post<ApiResponse<WorkoutPlanResponse>>(WORKOUT_PLAN_API_ROUTES.GENERATE);
    return response.data;
  },

  async getWorkoutPlans(): Promise<ApiResponse<GetWorkoutPlansResponse>> {
    const response = await userApi.get<ApiResponse<GetWorkoutPlansResponse>>(WORKOUT_PLAN_API_ROUTES.GET_PLANS);
    return response.data;
  },

  async markDayCompleted(data: MarkDayCompletedPayload): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      WORKOUT_PLAN_API_ROUTES.MARK_DAY(data.planId, data.dayNumber),
      { completed: data.completed }
    );
    return response.data;
  },

  async markExerciseStatus(data: MarkExerciseStatusPayload): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      WORKOUT_PLAN_API_ROUTES.MARK_EXERCISE(data.planId, data.dayNumber, data.exerciseId),
      { status: data.status }
    );
    return response.data;
  },

  async getWorkoutProgress(timeframe: Timeframe): Promise<ApiResponse<WorkoutProgressResponse>> {
    const response = await userApi.get<ApiResponse<WorkoutProgressResponse>>(`${WORKOUT_PLAN_API_ROUTES.GET_PROGRESS}?timeframe=${timeframe}`);
    return response.data;
  }
};
