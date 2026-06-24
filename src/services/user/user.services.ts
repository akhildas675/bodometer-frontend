import { userApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";
import { PaginationMeta } from "@/interface/common.interface";
import { UpdateEquipment } from "@/interface/equipment.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import { TrainerDynamicSlot, TrainerBooking, CreateBookingPayload } from "@/interface/booking.interface";
import { CalculateBmiPayload, BmiCalculationResult } from "@/interface/bmi.interface";


import { UploadProfilePictureResponse } from "@/interface/common.interface";

import { TrainerDetail, TrainerListItem } from "@/interface/trainer.interface";
import { ProfileUpdatePayload, UserProfileInterface } from "@/interface/user.interface";

import type { ExerciseRow } from "@/interface/exercise.interface";
import { GetWorkoutPlansResponse, WorkoutPlanResponse, MarkDayCompletedPayload, MarkExerciseStatusPayload, WorkoutProgressResponse } from "@/interface/workout.interface";
import { Timeframe } from "@/constants/fitness.constant";



const userServices = {
  async getUserProfile(): Promise<ApiResponse<UserProfileInterface>> {
    const response = await userApi.get<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.USER_PROFILE);
    return response.data;
  },

  async updateUserProfile(data: ProfileUpdatePayload): Promise<ApiResponse<UserProfileInterface>> {
    const response = await userApi.put<ApiResponse<UserProfileInterface>>(USER_API_ROUTES.PROFILE, data);
    return response.data;
  },

  async uploadProfilePicture(data: FormData): Promise<ApiResponse<UploadProfilePictureResponse>> {
    const response = await userApi.post<ApiResponse<UploadProfilePictureResponse>>(
      USER_API_ROUTES.PROFILE_PICTURE,
      data
    );
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await userApi.patch(USER_API_ROUTES.CHANGE_PASSWORD, data);
    return response.data;
  },


  async getTrainers(params?: TableQueryParams): Promise<ApiResponse<TrainerListItem[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 9, ...params });
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_TRAINERS}?${queryParams.toString()}`
    );
    return response.data;
  },

  async getTrainerById(id: string): Promise<ApiResponse<TrainerDetail>> {
    const response = await userApi.get<ApiResponse<TrainerDetail>>(USER_API_ROUTES.GET_TRAINER_BY_ID(id));
    return response.data;
  },




  async getEquipment(params?: TableQueryParams): Promise<ApiResponse<UpdateEquipment[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 1000, ...params });
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_EQUIPMENT}?${queryParams.toString()}`
    );
    return response.data;
  },



  async calculateBmiPublic(data: CalculateBmiPayload): Promise<ApiResponse<BmiCalculationResult>> {
    const response = await userApi.post<ApiResponse<BmiCalculationResult>>(USER_API_ROUTES.CALCULATE_BMI_PUBLIC, data);
    return response.data;
  },



  async getExercises(
    params?: TableQueryParams & { difficulty?: string; targetMuscleId?: string; categoryId?: string }
  ): Promise<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 12, ...params });

    const response = await userApi.get<ApiResponse<ExerciseRow[]> & { pagination: PaginationMeta }>(
      `${USER_API_ROUTES.GET_EXERCISES}?${queryParams.toString()}`
    );
    return response.data;
  },

  async getExerciseById(id: string): Promise<ApiResponse<ExerciseRow>> {
    const response = await userApi.get<ApiResponse<ExerciseRow>>(USER_API_ROUTES.GET_EXERCISE_BY_ID(id));
    return response.data;
  },

  async generateWorkout(): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.post<ApiResponse<WorkoutPlanResponse>>(USER_API_ROUTES.GENERATE_WORKOUT);
    return response.data;
  },

  async getWorkoutPlans(): Promise<ApiResponse<GetWorkoutPlansResponse>> {
    const response = await userApi.get<ApiResponse<GetWorkoutPlansResponse>>(USER_API_ROUTES.GET_WORKOUT_PLANS);
    return response.data;
  },

  async markDayCompleted(data: MarkDayCompletedPayload): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      USER_API_ROUTES.MARK_WORKOUT_DAY(data.planId, data.dayNumber),
      { completed: data.completed }
    );
    return response.data;
  },

  async markExerciseStatus(data: MarkExerciseStatusPayload): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      USER_API_ROUTES.MARK_WORKOUT_EXERCISE(data.planId, data.dayNumber, data.exerciseId),
      { status: data.status }
    );
    return response.data;
  },
  async getWorkoutProgress(timeframe: Timeframe): Promise<ApiResponse<WorkoutProgressResponse>> {
    const response = await userApi.get<ApiResponse<WorkoutProgressResponse>>(`${USER_API_ROUTES.GET_WORKOUT_PROGRESS}?timeframe=${timeframe}`    );
    return response.data;
  },

  // Bookings
  async getTrainerSlots(trainerId: string, params?: { from?: string; to?: string }): Promise<ApiResponse<TrainerDynamicSlot[]>> {
    const queryParams = buildQueryParams(params || {});
    const url = USER_API_ROUTES.GET_TRAINER_SLOTS.replace(":id", trainerId);
    const response = await userApi.get(`${url}?${queryParams.toString()}`);
    return response.data;
  },

  async createBooking(data: CreateBookingPayload): Promise<ApiResponse<TrainerBooking>> {
    const response = await userApi.post(USER_API_ROUTES.CREATE_BOOKING, data);
    return response.data;
  },

  async getUserBookings(params?: TableQueryParams & { status?: string; date?: string }): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await userApi.get(`${USER_API_ROUTES.GET_USER_BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<ApiResponse<TrainerBooking>> {
    const url = USER_API_ROUTES.CANCEL_BOOKING.replace(":bookingId", bookingId);
    const response = await userApi.patch(url, { reason });
    return response.data;
  },
};

export default userServices;
