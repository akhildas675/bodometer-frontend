export const WORKOUT_PLAN_API_ROUTES = {
  GENERATE: "/workout-plan/generate",
  GET_PLANS: "/workout-plan",
  MARK_DAY: (planId: string, dayNumber: string | number) => `/workout-plan/${planId}/day/${dayNumber}/complete`,
  MARK_EXERCISE: (planId: string, dayNumber: string | number, exerciseId: string) => `/workout-plan/${planId}/day/${dayNumber}/exercise/${exerciseId}/status`,
  GET_PROGRESS: "/workout-plan/progress",
} as const;
