import { userApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";
import { PaginationMeta, SubscriptionPlan, QuestionGroup, OnboardingQuestion as DynamicOnboardingQuestion, SubscriptionTransaction, PaginatedResponse } from "@/interface/admin.interface";
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
} from "@/interface/user.interface";
import { AnswerValue } from "@/constants/onboarding.constant";

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
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    const response = await userApi.get<ApiResponse<TrainerDetail>>(USER_API_ROUTES.GET_TRAINER_BY_ID(id),);
    return response.data
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


  async getMySubscriptions(): Promise<ApiResponse<SubscriptionPlan>> {
    const response = await userApi.get<ApiResponse<SubscriptionPlan>>(USER_API_ROUTES.GET_MY_SUBSCRIPTION);
    return response.data
  },

  async createCheckoutSession(planId: string): Promise<ApiResponse<{ checkoutUrl: string }>> {
    const response = await userApi.post<ApiResponse<{ checkoutUrl: string }>>(USER_API_ROUTES.CREATE_CHECKOUT_SESSION, {
      planId: planId
    });
    return response.data
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

  async calculateBmiPublic(data: {
    height?: number | null;
    weight?: number | null;
    unit: "metric" | "imperial";
    heightFt?: string;
    heightIn?: string;
  }): Promise<ApiResponse<{
    bmi: number;
    heightCm: number;
    weightKg: number;
    category: { label: string; color: string; description: string; tips: string[] };
    healthyWeightRange: { minKg: number; maxKg: number };
  }>> {
    const response = await userApi.post<ApiResponse<{
      bmi: number;
      heightCm: number;
      weightKg: number;
      category: { label: string; color: string; description: string; tips: string[] };
      healthyWeightRange: { minKg: number; maxKg: number };
    }>>(USER_API_ROUTES.CALCULATE_BMI_PUBLIC, data);
    return response.data;
  },

  async getMyTransactions(params?: TableQueryParams): Promise<PaginatedResponse<SubscriptionTransaction>> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await userApi.get<ApiResponse<SubscriptionTransaction[]> & { pagination: PaginationMeta }>(
      `${USER_API_ROUTES.GET_MY_TRANSACTIONS}?${queryParams.toString()}`
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }
};

export default userServices;
