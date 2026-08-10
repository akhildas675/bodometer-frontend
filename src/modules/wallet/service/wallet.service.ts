import { api } from "@/api/protected.instance";
import { ApiResponse } from "@/interface/api-response.interface";

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

class WalletService {
  async getWalletBalance(): Promise<UserWalletData> {
    const response = await api.get<ApiResponse<UserWalletData>>("/wallet/balance");
    return response.data?.data;
  }

  async getWalletTransactions(): Promise<WalletTransactionData[]> {
    const response = await api.get<ApiResponse<WalletTransactionData[]>>("/wallet/history");
    return response.data?.data || [];
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
