export const BODY_REGION = {
    FULL_BODY: "full_body",
    UPPER_BODY: "upper_body",
    LOWER_BODY: "lower_body",
    CORE: "core",
} as const;
export type BodyRegion = typeof BODY_REGION[keyof typeof BODY_REGION];

export const DIFFICULTY_LEVEL = {
    BEGINNER: "beginner",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
} as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVEL[keyof typeof DIFFICULTY_LEVEL];

export const WORKOUT_ENVIRONMENT = {
  HOME: "home",
  HOME_WITH_EQUIPMENT: "home_with_equipment",
  GYM: "gym",
  OUTDOOR: "outdoor",
} as const;
export type WorkoutEnvironment = typeof WORKOUT_ENVIRONMENT[keyof typeof WORKOUT_ENVIRONMENT];

export const TIMEFRAME = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;
export type Timeframe = typeof TIMEFRAME[keyof typeof TIMEFRAME];