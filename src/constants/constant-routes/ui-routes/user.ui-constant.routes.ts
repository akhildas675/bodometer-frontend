export const USER_UI_ROUTES = {
    USER_PROFILE: "/profile",

    USER_TRAINERS: "/trainers",
    USER_TRAINER_DETAILS: "/trainers/:id",
    USER_CHANGE_PASSWORD: "/change-password",
    USER_CATEGORIES: "/categories",
    USER_CATEGORY_DETAILS: "/categories/:id",

    USER_SUBSCRIPTIONS: "/subscriptions",
    USER_SUBSCRIPTIONS_SUCCESS: "/subscription-success",
    USER_SUBSCRIPTIONS_CANCEL: "/subscription-cancel",


    //Onboarding
    ONBOARDING_INTRO: "/onboarding/intro",
    ONBOARDING_ASSESSMENT: "/onboarding/assessment",
    USER_FITNESS_PROFILE: "/fitness-profile",
    USER_BMI: "/bmi",

    // Exercises (premium)
    USER_EXERCISES: "/exercises",
    USER_EXERCISE_DETAIL: "/exercises/:exerciseId",
    USER_GENERATE_WORKOUT: "/generate-workout",
    USER_WORKOUT_PLANS: "/workout-plans",
    USER_PROGRESS: "/progress",

} as const