import { api } from "@/infrastructure/api/protected-client";
import { ApiResponse } from "@/types/api.types";
import {
  AdminChartPoint,
  AdminPayoutSummary,
  ChartPeriod,
  PaginatedPayoutsResponse,
  PaginatedTransactionsResponse,
  PayoutRequest,
  PayoutStatus,
  PlatformFinanceSummary,
  TrainerChartPoint,
  TrainerFinanceSummary,
  TransactionStatus,
  TransactionType,
} from "../types/finance.types";

export interface TransactionFilterParams {
  page?: number;
  limit?: number;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  from?: string;
  to?: string;
}

export interface PayoutFilterParams {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  from?: string;
  to?: string;
}

export interface ChartFilterParams {
  period?: ChartPeriod;
  from?: string;
  to?: string;
}

class FinanceService {
  // ==========================================
  // Trainer Methods
  // ==========================================
  async getTrainerSummary(): Promise<TrainerFinanceSummary> {
    const response = await api.get<ApiResponse<TrainerFinanceSummary>>(
      "/finance/trainer/summary",
    );
    return response.data?.data;
  }

  async getTrainerTransactions(
    params?: TransactionFilterParams,
  ): Promise<PaginatedTransactionsResponse> {
    const response = await api.get<ApiResponse<PaginatedTransactionsResponse>>(
      "/finance/trainer/transactions",
      { params },
    );
    return (
      response.data?.data || {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  }

  async getTrainerChart(
    params?: ChartFilterParams,
  ): Promise<TrainerChartPoint[]> {
    const response = await api.get<ApiResponse<TrainerChartPoint[]>>(
      "/finance/trainer/chart",
      { params },
    );
    return response.data?.data || [];
  }

  async getTrainerAvailableBalance(): Promise<{ availableBalance: number }> {
    const response = await api.get<
      ApiResponse<{ availableBalance: number }>
    >("/finance/trainer/balance");
    return response.data?.data || { availableBalance: 0 };
  }

  async getTrainerPayouts(
    params?: PayoutFilterParams,
  ): Promise<PaginatedPayoutsResponse> {
    const response = await api.get<ApiResponse<PaginatedPayoutsResponse>>(
      "/finance/trainer/payouts",
      { params },
    );
    return (
      response.data?.data || {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  }

  async getTrainerActivePayout(): Promise<PayoutRequest | null> {
    const response = await api.get<ApiResponse<PayoutRequest | null>>(
      "/finance/trainer/payouts/active",
    );
    return response.data?.data ?? null;
  }

  async getPayoutDetails(payoutId: string): Promise<PayoutRequest> {
    const response = await api.get<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}`,
    );
    return response.data?.data;
  }

  async requestPayout(
    amount: number,
    bankDetails?: import("../types/finance.types").PayoutBankDetails,
  ): Promise<PayoutRequest> {
    const response = await api.post<ApiResponse<PayoutRequest>>(
      "/finance/trainer/payouts",
      { amount, bankDetails },
    );
    return response.data?.data;
  }

  // ==========================================
  // Admin Methods
  // ==========================================
  async getPlatformSummary(): Promise<PlatformFinanceSummary> {
    const response = await api.get<ApiResponse<PlatformFinanceSummary>>(
      "/finance/admin/summary",
    );
    return response.data?.data;
  }

  async getAllTransactions(
    params?: TransactionFilterParams,
  ): Promise<PaginatedTransactionsResponse> {
    const response = await api.get<ApiResponse<PaginatedTransactionsResponse>>(
      "/finance/admin/transactions",
      { params },
    );
    return (
      response.data?.data || {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  }

  async getAdminChart(
    params?: ChartFilterParams,
  ): Promise<AdminChartPoint[]> {
    const response = await api.get<ApiResponse<AdminChartPoint[]>>(
      "/finance/admin/chart",
      { params },
    );
    return response.data?.data || [];
  }

  async getAllPayouts(
    params?: PayoutFilterParams,
  ): Promise<PaginatedPayoutsResponse> {
    const response = await api.get<ApiResponse<PaginatedPayoutsResponse>>(
      "/finance/admin/payouts",
      { params },
    );
    return (
      response.data?.data || {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  }

  async getAdminPayoutSummary(): Promise<AdminPayoutSummary> {
    const response = await api.get<ApiResponse<AdminPayoutSummary>>(
      "/finance/admin/payouts/summary",
    );
    return response.data?.data || { pendingAmount: 0, paidAmount: 0 };
  }

  async approvePayout(payoutId: string): Promise<PayoutRequest> {
    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/approve`,
    );
    return response.data?.data;
  }

  async rejectPayout(payoutId: string, reason: string): Promise<PayoutRequest> {
    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/reject`,
      { reason },
    );
    return response.data?.data;
  }

  async processPayout(
    payoutId: string,
    providerPayoutId?: string,
    adminNote?: string,
  ): Promise<PayoutRequest> {
    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/process`,
      { providerPayoutId, adminNote },
    );
    return response.data?.data;
  }

  async completePayout(
    payoutId: string,
    payload:
      | string
      | {
          bankTransferReference: string;
          transferredAt?: string;
          adminNote?: string;
          payoutMethod?: string;
          providerPayoutId?: string;
        },
  ): Promise<PayoutRequest> {
    const body =
      typeof payload === "string"
        ? { bankTransferReference: payload, providerPayoutId: payload }
        : payload;

    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/complete`,
      body,
    );
    return response.data?.data;
  }

  async failPayout(payoutId: string, reason: string): Promise<PayoutRequest> {
    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/fail`,
      { reason },
    );
    return response.data?.data;
  }

  /**
   * One-click: Admin approves and immediately pays the trainer via Stripe.
   * The payout is moved directly to PAID status with a Stripe payout ID.
   */
  async stripePayPayout(payoutId: string): Promise<PayoutRequest> {
    const response = await api.patch<ApiResponse<PayoutRequest>>(
      `/finance/admin/payouts/${payoutId}/stripe-pay`,
    );
    return response.data?.data;
  }
}

export const financeService = new FinanceService();
