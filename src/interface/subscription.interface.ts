import { PlanType } from "@/constants/subscription.constant";

export interface SubscriptionFormData {
  subscriptionName: string;
  description: string;
  price:number | string;
  durationDays:number | string;
  features: string[];
  liveSessionCount: number;
  planType: PlanType;
}

export interface AdminGetSubscriptionResponse {
  id: string;
  subscriptionName: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  liveSessionCount: number;
  planType: "basic" | "pro" | "elite";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}