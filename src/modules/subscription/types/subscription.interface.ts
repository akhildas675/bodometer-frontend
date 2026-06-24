export interface SubscriptionFeature {
  subscriptionFeatureId?: string;
  key?: string;
  title?: string;
  description?: string;
  type?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlanListItem {
  subscriptionPlanId: string;
  name: string;
  price: number;
  durationInDays: number;
  featuresCount: number;
  isPopular: boolean;
  isActive: boolean;
}

export interface FeatureListItem {
  featureId: string;
  key: string;
  title: string;
  description: string;
  type: "boolean" | "limit";
  isActive: boolean;
}

export interface SubscriptionPlanFormData {
  name: string;
  description: string;
  price: string;
  durationInDays: string;
  isPopular: boolean;
  features: {
    featureId: string;
    type: "boolean" | "limit";
    limit: string;
    limitType: string;
  }[];
}

export interface SubscriptionPlan {
  subscriptionPlanId: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isPopular: boolean;
  featuresCount: number;
  isActive: boolean;
  features?: {
    featureId: string;
    title?: string;
    limit?: number;
    limitType?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendSubscriptionPlan {
  subscriptionPlanId: string;
  name: string;
  price: number;
  durationInDays: number;
  isPopular: boolean;
  isActive: boolean;
  features?: Array<{ featureId: string; limit?: number; limitType?: string }>;
  description?: string;
}

export interface SubscriptionPlanDetailsResponse extends SubscriptionPlan {
  features: Array<{
    featureId: string;
    type: "boolean" | "limit";
    limit?: number;
    limitType?: string;
  }>;
}

export interface SubscriptionPlanPayload {
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isPopular: boolean;
  features: Array<{ featureId: string; limit?: number; limitType?: string }>;
}

export interface SubscriptionTransaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  subscriptionPlanId: {
    _id: string;
    name: string;
  } | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  transactionId?: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export interface ActiveSubscription {
  subscriptionId: string;
  subscriptionPlanId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  daysRemaining: number;
}
