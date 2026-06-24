export const SUBSCRIPTION_API_PATHS = {
  // Features
  FEATURES: "/subscription/features",
  FEATURE_BY_ID: (featureId: string) =>
    `/subscription/features/${featureId}`,
  TOGGLE_FEATURE_STATUS: (featureId: string) =>
    `/subscription/features/${featureId}/toggle`,

  // Plans
  PLANS: "/subscription/plans",
  PLAN_BY_ID: (subscriptionPlanId: string) =>
    `/subscription/plans/${subscriptionPlanId}`,
  TOGGLE_PLAN_STATUS: (subscriptionPlanId: string) =>
    `/subscription/plans/${subscriptionPlanId}/toggle`,

  // User Subscription
  ACTIVE_SUBSCRIPTION: "/subscription/my-subscription",
  TRANSACTIONS: "/subscription/transactions",
  USER_TRANSACTIONS: "/subscription/user/transactions",

  // Payment
  CHECKOUT_SESSION: "/subscription/checkout-session",
  VERIFY_PAYMENT: "/subscription/verify-payment",
} as const;