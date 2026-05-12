import { adminApi } from "@/api/api.instance";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";

import type {
  AdminGetTrainersResponse,
  AdminGetUsersResponse,
  PaginatedResponse,
  PaginationMeta,
  SubscriptionFeature,
  SubscriptionPlan,
  UpdateCategory,
} from "@/interface/admin.interface";

import type { ApiResponse } from "@/interface/api-response.interface";

import { ADMIN_API_ROUTES } from "@/constants/constant-routes/api-routes/admin-constant.routes";


class AdminService {
  // User Management
  async getUsers(
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<AdminGetUsersResponse>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetUsersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_USERS, { params });




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

  async getTrainers(
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<AdminGetTrainersResponse>> {
    const params: Record<string, string | number> = {};

    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetTrainersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINERS, { params });




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
  async getTrainerAppointments(
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number,
    status?: string
  ): Promise<PaginatedResponse<TrainerWithProfile>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (status) params.status = status;

    const response = await adminApi.get<{
      success: boolean;
      data: TrainerWithProfile[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINER_APPOINTMENTS, { params });

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

  async getAllCategories(
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<UpdateCategory>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await adminApi.get<{
      success: boolean;
      data: UpdateCategory[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_CATEGORIES, { params });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async toggleCategoryStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_CATEGORY_STATUS(id));
    return response.data
  }

  async getAllSubscriptionFeatures(
    search?: string,
    type?: "boolean" | "count",
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<SubscriptionFeature>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (type) params.type = type;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await adminApi.get<{
      success: boolean;
      data: SubscriptionFeature[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_SUBSCRIPTION_FEATURES, { params });

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

  async getAllSubscriptionPlans(
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<SubscriptionPlan>> {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await adminApi.get<{
      success: boolean;
      data: Array<{
        subscriptionPlanId: string;
        name: string;
        price: number;
        durationInDays: number;
        isPopular: boolean;
        isActive: boolean;
        features?: Array<{ featureId: string; limit?: number; limitType?: string }>;
        description?: string;
      }>;
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_SUBSCRIPTION_PLANS, { params });

    const mappedData: SubscriptionPlan[] = (response.data.data || []).map((b) => ({
      planId: b.subscriptionPlanId,
      name: b.name,
      price: b.price,
      durationInDays: b.durationInDays,
      isPopular: b.isPopular,
      isActive: b.isActive,
      description: b.description || "",
      featuresCount: b.features?.length || 0,
      createdAt: "", 
      updatedAt: ""
    }));

    return {
      data: mappedData,
      pagination: response.data.pagination,
    };
  }

  async createSubscriptionPlan(payload: {
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    isPopular: boolean;
    features: Array<{ featureId: string; limit?: number; limitType?: string }>;
  }): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.CREATE_SUBSCRIPTION_PLAN,
      payload
    );
    return response.data;
  }

  async getSubscriptionPlanById(id: string): Promise<ApiResponse<SubscriptionPlan & { features: Array<{ featureId: string; type: "boolean" | "limit"; limit?: number; limitType?: string }> }>> {
    const response = await adminApi.get<ApiResponse<SubscriptionPlan & { features: Array<{ featureId: string; type: "boolean" | "limit"; limit?: number; limitType?: string }> }>>(
      ADMIN_API_ROUTES.GET_SUBSCRIPTION_PLAN_BY_ID(id)
    );
    return response.data;
  }

  async updateSubscriptionPlan(id: string, payload: {
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    isPopular: boolean;
    features: Array<{ featureId: string; limit?: number; limitType?: string }>;
  }): Promise<ApiResponse<{ message: string }>> {
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
}

export default new AdminService();