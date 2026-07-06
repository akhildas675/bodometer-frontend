import {
  ActiveSubscription,
  SubscriptionFeature,
  SubscriptionPlan,
  SubscriptionPlanDetailsResponse,
  SubscriptionPlanPayload,
  SubscriptionTransaction,
} from "@/modules/subscription/types/subscription.interface";
import { SUBSCRIPTION_API_PATHS } from "../constant/api-routes";
import { ApiResponse } from "@/interface/api-response.interface";
import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import {
  PaginatedResponse,
  PaginationMeta,
} from "@/interface/common.interface";

export const subscriptionService = {
  async createSubscriptionFeature(
    featureData: SubscriptionFeature,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.FEATURES,
      featureData,
    );
    return response.data;
  },

  async getAllSubscriptionFeatures(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<SubscriptionFeature>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{
      success: boolean;
      data: SubscriptionFeature[];
      pagination: PaginationMeta;
    }>(SUBSCRIPTION_API_PATHS.FEATURES, { params: queryParams });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getSubscriptionFeatureById(
    id: string,
  ): Promise<ApiResponse<SubscriptionFeature>> {
    const response = await api.get<ApiResponse<SubscriptionFeature>>(
      SUBSCRIPTION_API_PATHS.FEATURE_BY_ID(id),
    );
    return response.data;
  },

  async updateSubscriptionFeature(
    id: string,
    featureData: SubscriptionFeature,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.FEATURE_BY_ID(id),
      featureData,
    );
    return response.data;
  },

  async toggleSubscriptionFeatureStatus(
    subscriptionFeatureId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.TOGGLE_FEATURE_STATUS(subscriptionFeatureId),
    );
    return response.data;
  },

  async createSubscriptionPlan(
    payload: SubscriptionPlanPayload,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.PLANS,
      payload,
    );
    return response.data;
  },

  async getAllSubscriptionPlans(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<SubscriptionPlan>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{
      success: boolean;
      data: SubscriptionPlan[];
      pagination: PaginationMeta;
    }>(SUBSCRIPTION_API_PATHS.PLANS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getSubscriptionPlanById(
    id: string,
  ): Promise<ApiResponse<SubscriptionPlanDetailsResponse>> {
    const response = await api.get<
      ApiResponse<SubscriptionPlanDetailsResponse>
    >(SUBSCRIPTION_API_PATHS.PLAN_BY_ID(id));
    return response.data;
  },

  async updateSubscriptionPlan(
    id: string,
    payload: SubscriptionPlanPayload,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.PLAN_BY_ID(id),
      payload,
    );
    return response.data;
  },

  async toggleSubscriptionPlanStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      SUBSCRIPTION_API_PATHS.TOGGLE_PLAN_STATUS(id),
    );
    return response.data;
  },

  async createCheckoutSession(
    subscriptionPlanId: string,
  ): Promise<ApiResponse<{ checkoutUrl: string }>> {
    const response = await api.post<ApiResponse<{ checkoutUrl: string }>>(
      SUBSCRIPTION_API_PATHS.CHECKOUT_SESSION,
      { subscriptionPlanId },
    );
    return response.data;
  },

  async verifyPayment(
    sessionId: string,
  ): Promise<ApiResponse<ActiveSubscription>> {
    const response = await api.get<ApiResponse<ActiveSubscription>>(
      `${SUBSCRIPTION_API_PATHS.VERIFY_PAYMENT}?session_id=${sessionId}`,
    );
    return response.data;
  },

  async getActiveSubscription(): Promise<ApiResponse<ActiveSubscription | null>> {
    const response = await api.get<ApiResponse<ActiveSubscription | null>>(
      SUBSCRIPTION_API_PATHS.ACTIVE_SUBSCRIPTION,
    );
    return response.data;
  },

  async getMyTransactions(
    params?: TableQueryParams,
  ): Promise<ApiResponse<SubscriptionTransaction[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get<
      ApiResponse<SubscriptionTransaction[]> & { pagination: PaginationMeta }
    >(`${SUBSCRIPTION_API_PATHS.USER_TRANSACTIONS}?${queryParams.toString()}`);
    return response.data;
  },

  async getAllSubscriptionTransactions(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<SubscriptionTransaction>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{
      success: boolean;
      data: SubscriptionTransaction[];
      pagination: PaginationMeta;
    }>(SUBSCRIPTION_API_PATHS.TRANSACTIONS, { params: queryParams });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },
};
