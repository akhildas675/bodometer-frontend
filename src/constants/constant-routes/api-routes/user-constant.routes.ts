export const USER_API_ROUTES = {
    USER_PROFILE: "/user-profile",
    PROFILE: "/profile",
    PROFILE_PICTURE: "/profile-picture",
    CHANGE_PASSWORD: "/change-password",

    GET_TRAINERS: "/trainers",
    GET_TRAINER_BY_ID: (id: string) => `/trainers/${id}`,
    GET_CATEGORIES: "/categories",
    GET_EQUIPMENT: "/equipment",
    GET_CATEGORY_BY_ID: (id: string) => `/categories/${id}`,


    //subscription

    GET_MY_SUBSCRIPTION: "/subscriptions",
    CREATE_CHECKOUT_SESSION: "/checkout-session",
    VERIFY_PAYMENT: "/verify-payment",
    GET_ACTIVE_SUBSCRIPTION: "/active-subscription",
    GET_MY_TRANSACTIONS: "/transactions",

    //Fitness
    GET_WORKOUT_TIME: "/prefer-time",
    GET_FITNESS_GOALS: "/fitness-goals",
    GET_ONBOARDING_WORKOUTS: "/onboarding-workouts",
    GET_ONBOARDING_OPTIONS: "/onboarding-options",
    GET_ONBOARDING_QUESTIONS: "/onboarding-questions",
    GET_ONBOARDING_GROUPS: "/onboarding-groups",
    SUBMIT_ONBOARDING: "/submit-onboarding",
    GENERATE_WORKOUT: "/generate-workout",
    GET_WORKOUT_PLAN: "/workout-plan",
    GET_WORKOUT_PLANS: "/workout-plans",
    MARK_WORKOUT_DAY: (planId: string, dayNumber: number) => `/workout-plan/${planId}/day/${dayNumber}/complete`,
    MARK_WORKOUT_EXERCISE: (planId: string, dayNumber: number, exerciseId: string) => `/workout-plan/${planId}/day/${dayNumber}/exercise/${exerciseId}/complete`,


    //onboarding Questions

    GET_ALL_QUESTIONS: "/onboarding-questions",
    GET_ONBOARDING_STATUS: "/onboarding-status",
    GET_ONBOARDING_ANSWERS: "/onboarding-answers",
    CALCULATE_BMI_PUBLIC: "/bmi/calculate",

    // Exercises (premium)
    GET_EXERCISES: "/exercises",
    GET_EXERCISE_BY_ID: (id: string) => `/exercises/${id}`,

} as const