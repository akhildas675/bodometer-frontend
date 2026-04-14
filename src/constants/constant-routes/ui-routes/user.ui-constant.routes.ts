export const USER_UI_ROUTES={
    USER_PROFILE:"/profile",
    USER_WORKOUTS:"/workouts",
    USER_WORKOUT_DETAIL:"/workouts/:id",
    USER_SUBSCRIPTION:"/subscriptions",
    USER_SUBSCRIPTION_SUCCESS:"/subscriptions/success",
    USER_TRAINERS:"/trainers",
    USER_TRAINER_DETAILS:"/trainers/:id",
    USER_CHANGE_PASSWORD:"/change-password",


    //premium user routes
    
    USER_ONBOARDING_INTRO:'/intro',
    USER_ONBOARDING_BMI:'/bmi',
    USER_ONBOARDING_WORKOUTS:'/select-workouts',
    USER_FITNESS_GOALS:"/goals",
    USER_WORKOUT_PREFERENCE_TIME:"/prefer-time",
    USER_ONBOARDING_WORKOUT_HISTORY:'/workout-history',
    USER_ONBOARDING_HEALTH_DETAILS:'/health-details',
    USER_ONBOARDING_DAILY_HABITS:'/daily-habits',
    USER_ONBOARDING_COMPLETION:'/onboarding-complete',
} as const