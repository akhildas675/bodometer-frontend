import { userApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";
import { PaginationMeta, SubscriptionPlan, QuestionGroup, OnboardingQuestion as DynamicOnboardingQuestion, SubscriptionTransaction, PaginatedResponse } from "@/interface/admin.interface";
import { UpdateEquipment } from "@/interface/equipment.interface";
import type { ApiResponse } from "@/interface/api-response.interface";

import type {
  ProfileUpdatePayload,
  TrainerDetail,
  TrainerListItem,
  CategoryListItem,
  CategoryDetail,
  UploadProfilePictureResponse,
  UserProfileInterface,
  ActiveSubscription,
  OnboardingAnswersResponse,
  CalculateBmiPayload,
  BmiCalculationResult,
} from "@/interface/user.interface";
import { AnswerValue } from "@/constants/onboarding.constant";
import type { ExerciseRow } from "@/interface/exercise.interface";



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

  async getCategories(params?: TableQueryParams): Promise<ApiResponse<CategoryListItem[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 9, ...params });
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_CATEGORIES}?${queryParams.toString()}`
    );
    return response.data;
  },

  async getCategoryById(id: string): Promise<ApiResponse<CategoryDetail>> {
    const response = await userApi.get<ApiResponse<CategoryDetail>>(
      USER_API_ROUTES.GET_CATEGORY_BY_ID(id)
    );
    return response.data;
  },

  async getEquipment(params?: TableQueryParams): Promise<ApiResponse<UpdateEquipment[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 1000, ...params });
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_EQUIPMENT}?${queryParams.toString()}`
    );
    return response.data;
  },

  async getMySubscriptions(): Promise<ApiResponse<SubscriptionPlan>> {
    const response = await userApi.get<ApiResponse<SubscriptionPlan>>(USER_API_ROUTES.GET_MY_SUBSCRIPTION);
    return response.data;
  },

  async createCheckoutSession(planId: string): Promise<ApiResponse<{ checkoutUrl: string }>> {
    const response = await userApi.post<ApiResponse<{ checkoutUrl: string }>>(USER_API_ROUTES.CREATE_CHECKOUT_SESSION, {
      planId: planId
    });
    return response.data;
  },

  async verifyPayment(sessionId: string): Promise<ApiResponse<ActiveSubscription>> {
    const response = await userApi.get<ApiResponse<ActiveSubscription>>(
      `${USER_API_ROUTES.VERIFY_PAYMENT}?session_id=${sessionId}`
    );
    return response.data;
  },

  async getActiveSubscription(): Promise<ApiResponse<ActiveSubscription | null>> {
    const response = await userApi.get<ApiResponse<ActiveSubscription | null>>(
      USER_API_ROUTES.GET_ACTIVE_SUBSCRIPTION
    );
    return response.data;
  },

  async getAllQuestions(): Promise<ApiResponse<DynamicOnboardingQuestion[]>> {
    const response = await userApi.get<ApiResponse<DynamicOnboardingQuestion[]>>(USER_API_ROUTES.GET_ALL_QUESTIONS);
    return response.data;
  },

  async getOnboardingGroups(): Promise<ApiResponse<QuestionGroup[]>> {
    const response = await userApi.get<ApiResponse<QuestionGroup[]>>(USER_API_ROUTES.GET_ONBOARDING_GROUPS);
    return response.data;
  },

  async getOnboardingQuestions(): Promise<ApiResponse<DynamicOnboardingQuestion[]>> {
    const response = await userApi.get<ApiResponse<DynamicOnboardingQuestion[]>>(USER_API_ROUTES.GET_ONBOARDING_QUESTIONS);
    return response.data;
  },

  async userOnboardingQuestions(): Promise<ApiResponse<DynamicOnboardingQuestion[]>> {
    const response = await userApi.get<ApiResponse<DynamicOnboardingQuestion[]>>(USER_API_ROUTES.GET_ONBOARDING_QUESTIONS);
    return response.data;
  },

  async submitOnboarding(data: { answers: { questionId: string; key: string; value: AnswerValue }[] }): Promise<ApiResponse<unknown>> {
    const response = await userApi.post<ApiResponse<unknown>>(USER_API_ROUTES.SUBMIT_ONBOARDING, data);
    return response.data;
  },

  async getOnboardingStatus(): Promise<ApiResponse<{ completed: boolean }>> {
    const response = await userApi.get<ApiResponse<{ completed: boolean }>>(USER_API_ROUTES.GET_ONBOARDING_STATUS);
    return response.data;
  },

  async getOnboardingAnswers(): Promise<ApiResponse<OnboardingAnswersResponse>> {
    const response = await userApi.get<ApiResponse<OnboardingAnswersResponse>>(USER_API_ROUTES.GET_ONBOARDING_ANSWERS);
    return response.data;
  },

  async calculateBmiPublic(data: CalculateBmiPayload): Promise<ApiResponse<BmiCalculationResult>> {
    const response = await userApi.post<ApiResponse<BmiCalculationResult>>(USER_API_ROUTES.CALCULATE_BMI_PUBLIC, data);
    return response.data;
  },

  async getMyTransactions(params?: TableQueryParams): Promise<ApiResponse<SubscriptionTransaction[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await userApi.get<ApiResponse<SubscriptionTransaction[]> & { pagination: PaginationMeta }>(
      `${USER_API_ROUTES.GET_MY_TRANSACTIONS}?${queryParams.toString()}`
    );
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

  async getWorkoutPlan(): Promise<ApiResponse<WorkoutPlanResponse | null>> {
    const response = await userApi.get<ApiResponse<WorkoutPlanResponse | null>>(USER_API_ROUTES.GET_WORKOUT_PLAN);
    return response.data;
  },

  async getWorkoutPlans(): Promise<ApiResponse<GetWorkoutPlansResponse>> {
    const response = await userApi.get<ApiResponse<GetWorkoutPlansResponse>>(USER_API_ROUTES.GET_WORKOUT_PLANS);
    return response.data;
  },

  async markDayCompleted(planId: string, dayNumber: number, completed: boolean): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      USER_API_ROUTES.MARK_WORKOUT_DAY(planId, dayNumber),
      { completed }
    );
    return response.data;
  },

  async markExerciseStatus(planId: string, dayNumber: number, exerciseId: string, status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED"): Promise<ApiResponse<WorkoutPlanResponse>> {
    const response = await userApi.patch<ApiResponse<WorkoutPlanResponse>>(
      USER_API_ROUTES.MARK_WORKOUT_EXERCISE(planId, dayNumber, exerciseId),
      { status }
    );
    return response.data;
  },
};

export interface AiWorkoutExercise {
  order: number;
  exerciseId: string;
  exerciseTitle?: string;
  exerciseImage?: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  notes: string;
  status?: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED";
  startedAt?: string;
  timeTakenSeconds?: number;
}

export interface GenerateWorkoutDay {
  dayNumber: number;
  day: string;
  type: "workout" | "rest";
  focus: string;
  estimatedDurationMinutes: number;
  status: string;
  completedAt?: string;
  exercises: AiWorkoutExercise[];
}

export interface WorkoutPlan {
  workoutPlanId: string;
  days: GenerateWorkoutDay[];
  planType: 'general' | 'custom';
}

export interface WorkoutPlanResponse extends WorkoutPlan {
  weekNumber: number;
  startDate: string;
  formattedStartDate?: string;
  endDate: string;
  formattedEndDate?: string;
  status: string;
  autoGenerated?: boolean;
}

export interface GetWorkoutPlansResponse {
  plans: WorkoutPlanResponse[];
  generationStatus: {
    canGenerate: boolean;
    isInactive: boolean;
    pendingDaysCount: number;
    hasCompletedWorkoutToday: boolean;
    firstPendingDayNumber: number;
  };
}

export default userServices;
