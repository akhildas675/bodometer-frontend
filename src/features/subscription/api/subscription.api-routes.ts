export const SUBSCRIPTION_API_PATHS = {
  // Features
  FEATURES: "/subscriptions/features",
  FEATURE_BY_ID: (featureId: string) =>
    `/subscriptions/features/${featureId}`,
  TOGGLE_FEATURE_STATUS: (featureId: string) =>
    `/subscriptions/features/${featureId}/toggle`,

  // Plans
  PLANS: "/subscriptions/plans",
  PLAN_BY_ID: (subscriptionPlanId: string) =>
    `/subscriptions/plans/${subscriptionPlanId}`,
  TOGGLE_PLAN_STATUS: (subscriptionPlanId: string) =>
    `/subscriptions/plans/${subscriptionPlanId}/toggle`,

  // User Subscription
  ACTIVE_SUBSCRIPTION: "/subscriptions/my-subscription",
  TRANSACTIONS: "/subscriptions/transactions",
  USER_TRANSACTIONS: "/subscriptions/user/transactions",

  // Payment
  CHECKOUT_SESSION: "/subscriptions/checkout-session",
  VERIFY_PAYMENT: "/subscriptions/verify-payment",
  UPGRADE_PREVIEW: (targetPlanId: string) =>
    `/subscriptions/upgrade-preview/${targetPlanId}`,
  UPGRADE_CHECKOUT: "/subscriptions/upgrade-checkout",
} as const;
