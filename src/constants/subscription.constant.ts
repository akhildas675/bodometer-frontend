export const PLAN_TYPES = {
  BASIC: "basic",
  PRO: "pro",
  ELITE: "elite",
} as const;

export type PlanType = (typeof PLAN_TYPES)[keyof typeof PLAN_TYPES];

export const PLAN_LIVE_SESSIONS: Record<PlanType, number> = {
  basic: 4,    
  pro: 12,     
  elite: -1,  
};

export const PLAN_DURATION_DAYS: Record<PlanType, number> = {
  basic: 30,   
  pro: 30,     
  elite: 30,  
};

export const PLAN_OPTIONS: { label: string; value: PlanType; description: string }[] = [
  {
    value: "basic",
    label: "Basic",
    description: "1 session/week — 4 sessions/month",
  },
  {
    value: "pro",
    label: "Pro",
    description: "3 sessions/week — 12 sessions/month",
  },
  {
    value: "elite",
    label: "Elite",
    description: "Unlimited sessions",
  },
];

export const PLAN_FEATURES: Record<PlanType, string[]> = {
  basic: [
    "BMI Calculator",
    "Chat with trainer",
    "Weekly workout plan (1x/week)",
    "Weekly diet plan generator",
    "Daily progress tracking",
    "User health data collection",
  ],
  pro: [
    "Everything in Basic",
    "Workout plan (3x/week)",
    "Diet plan with meal reminders",
    "Community access",
    "Daily meal update reminders",
    "Performance analytics",
  ],
  elite: [
    "Everything in Pro",
    "Unlimited trainer booking",
    "Priority trainer matching",
    "AI-powered workout & diet suggestions",
    "Live session access",
    "Doctor consultation access",
    "Detailed health analytics",
  ],
};



export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  NONE: "none",
} as const;

export type SubscriptionStatus =
  typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];