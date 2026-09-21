import { api } from "@/infrastructure/api/protected-client";
import { ApiResponse } from "@/types/api.types";

export interface UserWalletData {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface WalletTransactionData {
  id: string;
  userId: string;
  type: "CREDIT" | "DEBIT";
  source: "BOOKING_REFUND" | "BOOKING_PAYMENT" | "MANUAL_ADJUSTMENT" | "WALLET_TOPUP";
  amount: number;
  currency: string;
  bookingId?: string;
  refundId?: string;
  reference?: string;
  description?: string;
  createdAt: string;
}

import { PaginationMeta } from "@/types/common.types";
import { buildQueryParams, TableQueryParams } from "@/infrastructure/api/query-builder";

export interface PaginatedWalletTransactionsData {
  transactions: WalletTransactionData[];
  pagination: PaginationMeta;
  totalCredits: number;
  totalDebits: number;
}

class WalletService {
  async getWalletBalance(): Promise<UserWalletData> {
    const response = await api.get<ApiResponse<UserWalletData>>("/wallet/balance");
    return response.data?.data;
  }

  async getWalletTransactions(
    params?: TableQueryParams,
  ): Promise<PaginatedWalletTransactionsData> {
    const queryParams = buildQueryParams(params);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await api.get<ApiResponse<PaginatedWalletTransactionsData>>(
      `/wallet/history${queryString}`,
    );
    return (
      response.data?.data || {
        transactions: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCredits: 0,
        totalDebits: 0,
      }
    );
  }

  async addFunds(amount: number): Promise<{ wallet: UserWalletData; transaction: WalletTransactionData }> {
    const response = await api.post<ApiResponse<{ wallet: UserWalletData; transaction: WalletTransactionData }>>(
      "/wallet/add-funds",
      { amount },
    );
    return response.data?.data;
  }

  async createTopupCheckout(amount: number): Promise<{ checkoutUrl: string; sessionId: string }> {
    const response = await api.post<ApiResponse<{ checkoutUrl: string; sessionId: string }>>(
      "/wallet/create-checkout",
      { amount },
    );
    return response.data?.data;
  }

  async verifyTopupPayment(amount: number, sessionId: string): Promise<{ wallet: UserWalletData; transaction: WalletTransactionData }> {
    const response = await api.post<ApiResponse<{ wallet: UserWalletData; transaction: WalletTransactionData }>>(
      "/wallet/verify-topup",
      { amount, sessionId },
    );
    return response.data?.data;
  }
}

export const walletService = new WalletService();
