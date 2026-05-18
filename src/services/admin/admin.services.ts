import { adminApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";

import type {
  AdminGetTrainersResponse,
  AdminGetUsersResponse,
  PaginatedResponse,
  PaginationMeta,
  SubscriptionFeature,
  SubscriptionPlan,
  UpdateCategory,
  QuestionGroup,
  OnboardingQuestion,
  CreateQuestionGroupData,
  UpdateQuestionGroupData,
  CreateQuestionData,
  UpdateQuestionData,
  SubscriptionTransaction,
  SubscriptionPlanPayload,
  SubscriptionPlanDetailsResponse,
} from "@/interface/admin.interface";

import type { ApiResponse } from "@/interface/api-response.interface";

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

  async createCategory(
    categoryData: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    console.log("service", FormData)
    const response = await adminApi.post<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.CREATE_CATEGORY,
      categoryData
    );
    return response.data;
  }

  async updateCategory(id: string, categoryData: FormData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.UPDATE_CATEGORY(id), categoryData);
    return response.data
  }

  async getCategoryById(id: string): Promise<ApiResponse<UpdateCategory>> {
    const response = await adminApi.get<ApiResponse<UpdateCategory>>(ADMIN_API_ROUTES.GET_CATEGORY_BY_ID(id));
    return response.data
  }

  async getAllCategories(params?: TableQueryParams): Promise<PaginatedResponse<UpdateCategory>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: UpdateCategory[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_CATEGORIES, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async toggleCategoryStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_CATEGORY_STATUS(id));
    return response.data
  }

  async getAllSubscriptionFeatures(params?: TableQueryParams): Promise<PaginatedResponse<SubscriptionFeature>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: SubscriptionFeature[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_SUBSCRIPTION_FEATURES, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async createSubscriptionFeature(
    featureData: SubscriptionFeature
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.CREATE_SUBSCRIPTION_FEATURE,
      featureData
    );
    return response.data;
  }

  async getSubscriptionFeatureById(
    id: string
  ): Promise<ApiResponse<SubscriptionFeature>> {
    const response = await adminApi.get<ApiResponse<SubscriptionFeature>>(
      ADMIN_API_ROUTES.GET_SUBSCRIPTION_FEATURE_BY_ID(id)
    );
    return response.data;
  }

  async updateSubscriptionFeature(
    id: string,
    featureData: SubscriptionFeature
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_SUBSCRIPTION_FEATURE(id),
      featureData
    );
    return response.data;
  }

  async toggleSubscriptionFeatureStatus(subscriptionFeatureId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_SUBSCRIPTION_FEATURE_STATUS(subscriptionFeatureId)
    )
    return response.data
  }

  async getAllSubscriptionPlans(params?: TableQueryParams): Promise<PaginatedResponse<SubscriptionPlan>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: SubscriptionPlan[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_SUBSCRIPTION_PLANS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async createSubscriptionPlan(payload: SubscriptionPlanPayload): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.CREATE_SUBSCRIPTION_PLAN,
      payload
    );
    return response.data;
  }

  async getSubscriptionPlanById(id: string): Promise<ApiResponse<SubscriptionPlanDetailsResponse>> {
    const response = await adminApi.get<ApiResponse<SubscriptionPlanDetailsResponse>>(
      ADMIN_API_ROUTES.GET_SUBSCRIPTION_PLAN_BY_ID(id)
    );
    return response.data;
  }

  async updateSubscriptionPlan(id: string, payload: SubscriptionPlanPayload): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_SUBSCRIPTION_PLAN(id),
      payload
    );
    return response.data;
  }

  async toggleSubscriptionPlanStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_SUBSCRIPTION_PLAN_STATUS(id)
    );
    return response.data;
  }

  // Question Groups
  async getQuestionGroups(params?: TableQueryParams): Promise<PaginatedResponse<QuestionGroup>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: QuestionGroup[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_QUESTION_GROUPS, { params: queryParams });

    return { data: response.data.data, pagination: response.data.pagination };
  }

  async createQuestionGroup(data: CreateQuestionGroupData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_QUESTION_GROUP, data);
    return response.data;
  }

  async updateQuestionGroup(id: string, data: UpdateQuestionGroupData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.UPDATE_QUESTION_GROUP(id), data);
    return response.data;
  }

  async getQuestionGroupById(id: string): Promise<ApiResponse<QuestionGroup>> {
    const response = await adminApi.get<ApiResponse<QuestionGroup>>(ADMIN_API_ROUTES.GET_QUESTION_GROUP_BY_ID(id));
    return response.data;
  }

  async toggleQuestionGroupStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_QUESTION_GROUP_STATUS(id));
    return response.data;
  }

  // Questions
  async getQuestions(params?: TableQueryParams): Promise<PaginatedResponse<OnboardingQuestion>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: OnboardingQuestion[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_QUESTIONS, { params: queryParams });

    return { data: response.data.data, pagination: response.data.pagination };
  }

  async createQuestion(data: CreateQuestionData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_QUESTION, data);
    return response.data;
  }

  async updateQuestion(id: string, data: UpdateQuestionData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.UPDATE_QUESTION(id), data);
    return response.data;
  }

  async getQuestionById(id: string): Promise<ApiResponse<OnboardingQuestion>> {
    const response = await adminApi.get<ApiResponse<OnboardingQuestion>>(ADMIN_API_ROUTES.GET_QUESTION_BY_ID(id));
    return response.data;
  }

  async toggleQuestionStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_QUESTION_STATUS(id));
    return response.data;
  }

  async getAllSubscriptionTransactions(params?: TableQueryParams): Promise<PaginatedResponse<SubscriptionTransaction>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: SubscriptionTransaction[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_SUBSCRIPTION_TRANSACTIONS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }
}

export default new AdminService();