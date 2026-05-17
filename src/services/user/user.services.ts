import { userApi } from "@/api/api.instance";

import { USER_API_ROUTES } from "@/constants/constant-routes/api-routes/user-constant.routes";
import { PaginationMeta, SubscriptionPlan, QuestionGroup, OnboardingQuestion as DynamicOnboardingQuestion } from "@/interface/admin.interface";
import { OnboardingQuestion as FlatOnboardingQuestion } from "@/interface/onboarding.interface";
import { AnswerValue } from "@/constants/answer.value";

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
} from "@/interface/user.interface";

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


  async getTrainers(
    page = 1,
    limit = 9,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    specializationId?: string,
  ): Promise<ApiResponse<TrainerListItem[]> & { pagination: PaginationMeta }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (specializationId) params.append("specializationId", specializationId);
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_TRAINERS}?${params.toString()}`
    );
    return response.data;
  },

  async getTrainerById(id: string): Promise<ApiResponse<TrainerDetail>> {
    const response = await userApi.get<ApiResponse<TrainerDetail>>(USER_API_ROUTES.GET_TRAINER_BY_ID(id),);
    return response.data
  },

  async getCategories(
    page = 1,
    limit = 9,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<ApiResponse<CategoryListItem[]> & { pagination: PaginationMeta }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const response = await userApi.get(
      `${USER_API_ROUTES.GET_CATEGORIES}?${params.toString()}`
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
    console.log("subscription frontend service", response.data)
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

  async userOnboardingQuestions(payload: { keys: string[] }): Promise<ApiResponse<FlatOnboardingQuestion[]>> {
    const mapDynamicToFlat = (q: DynamicOnboardingQuestion): FlatOnboardingQuestion => ({
      id: q.questionId || "",
      key: q.key || "",
      schemaKey: null,
      isCoreLocked: false,
      question: q.question || "",
      type: (q.type === "number" && q.numberConfig) ? "number_stepper" : q.type,
      section: "",
      order: q.order || 0,
      options: q.options?.map((o) => ({
        label: o.label || "",
        value: String(o.value ?? ""),
      })),
      config: q.numberConfig ? {
        min: q.numberConfig.min,
        max: q.numberConfig.max,
        step: q.numberConfig.step,
        unit: q.numberConfig.unit,
      } : undefined,
      validation: q.validation,
      isActive: q.isActive ?? true,
    });

    // 1. Try getting from cache to prevent multiple fetches
    try {
      const { useOnboardingStore } = await import("@/stores/onboarding.store");
      const cached = useOnboardingStore.getState().questions;
      if (cached && cached.length > 0) {
        console.log(`>>> Cache Hit: Loading [${payload.keys.join(", ")}] questions from Zustand store.`);
        const filtered = cached
          .filter((q) => payload.keys.includes(q.key))
          .map(mapDynamicToFlat);
        return {
          success: true,
          message: "Questions loaded from local cache",
          data: filtered,
        };
      }
    } catch (err) {
      console.warn("Zustand cache not available yet, proceeding to network fetch:", err);
    }

    // 2. Fallback to network if cache is cold
    console.log(">>> Cache Miss: Fetching questions from backend API...");
    const response = await userApi.get<ApiResponse<DynamicOnboardingQuestion[]>>(USER_API_ROUTES.GET_ONBOARDING_QUESTIONS);
    if (response.data.success && response.data.data) {
      const filtered = response.data.data
        .filter((q) => payload.keys.includes(q.key))
        .map(mapDynamicToFlat);
      return { ...response.data, data: filtered };
    }
    return response.data as unknown as ApiResponse<FlatOnboardingQuestion[]>;
  },

  async submitOnboarding(data: { answers: { questionId: string; key: string; value: AnswerValue }[] }): Promise<ApiResponse<unknown>> {
    const response = await userApi.post<ApiResponse<unknown>>(USER_API_ROUTES.SUBMIT_ONBOARDING, data);
    return response.data;
  },

  async getOnboardingStatus(): Promise<ApiResponse<{ completed: boolean }>> {
    const response = await userApi.get<ApiResponse<{ completed: boolean }>>(USER_API_ROUTES.GET_ONBOARDING_STATUS);
    return response.data;
  },

  async getOnboardingAnswers(): Promise<ApiResponse<{ answers: { questionId: string; questionKey?: string; key?: string; answer?: AnswerValue; value?: AnswerValue }[] }>> {
    const response = await userApi.get<ApiResponse<{ answers: { questionId: string; questionKey?: string; key?: string; answer?: AnswerValue; value?: AnswerValue }[] }>>(USER_API_ROUTES.GET_ONBOARDING_ANSWERS);
    return response.data;
  }
};

export default userServices;
