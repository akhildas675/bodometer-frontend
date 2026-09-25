import { PaginationMeta } from "@/types/common.types";

export type TransactionType =
  | "SESSION_EARNING"
  | "REFUND"
  | "PAYOUT"
  | "ADJUSTMENT";

export type TransactionStatus = "PENDING" | "COMPLETED" | "REVERSED";

export type PayoutStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "PAID"
  | "FAILED";

export type ChartPeriod = "daily" | "weekly" | "monthly";

export interface TrainerFinanceSummary {
  totalEarned: number;
  totalRefunded: number;
  netEarnings: number;
  availableBalance: number;
  totalPaidOut: number;
  pendingPayout: number;
}

export interface PlatformFinanceSummary {
  grossRevenue: number;
  totalTrainerEarnings: number;
  totalPlatformEarnings: number;
  totalRefunded: number;
  pendingPayouts: number;
  completedPayouts: number;
}

export interface AdminPayoutSummary {
  pendingAmount: number;
  paidAmount: number;
}

export interface FinancialTransaction {
  id: string;
  bookingId?: string;
  paymentId?: string;
  userId?: string;
  trainerId: string;
  grossAmount: number;
  trainerAmount: number;
  platformAmount: number;
  trainerPercentage: number;
  platformPercentage: number;
  currency: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  referenceKey: string;
  relatedTransactionId?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PayoutRequest {
  id: string;
  trainerId: string;
  amount: number;
  reservedAmount: number;
  currency: string;
  status: PayoutStatus;
  providerPayoutId?: string;
  rejectionReason?: string;
  failureReason?: string;
  requestedAt: string;
  approvedAt?: string;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TrainerChartPoint {
  label: string;
  earnings: number;
}

export interface AdminChartPoint {
  label: string;
  grossRevenue: number;
  trainerEarnings: number;
  platformEarnings: number;
}

export interface PaginatedTransactionsResponse {
  data: FinancialTransaction[];
  pagination: PaginationMeta;
}

export interface PaginatedPayoutsResponse {
  data: PayoutRequest[];
  pagination: PaginationMeta;
}
