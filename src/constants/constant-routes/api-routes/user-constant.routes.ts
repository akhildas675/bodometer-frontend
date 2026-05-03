export const USER_API_ROUTES = {
    USER_PROFILE: "/user-profile",
    PROFILE: "/profile",
    PROFILE_PICTURE: "/profile-picture",
    CHANGE_PASSWORD: "/change-password",
    GET_WORKOUTS: "/workouts",
    GET_WORKOUT_DETAIL: (id: string) => `/workouts/${id}`,
    GET_SUBSCRIPTIONS: "/subscriptions",
    GET_MY_SUBSCRIPTION: "/my-subscription",
    CREATE_CHECKOUT_SESSION: "/subscriptions/checkout",
    GET_TRAINERS: "/trainers",
    GET_TRAINER_BY_ID: (id: string) => `/trainers/${id}`,

    //Fitness
    GET_WORKOUT_TIME:"/prefer-time",
    GET_FITNESS_GOALS:"/fitness-goals",
    GET_ONBOARDING_WORKOUTS:"/onboarding-workouts",
    GET_ONBOARDING_OPTIONS:"/onboarding-options",
    GET_ONBOARDING_QUESTIONS: "/onboarding-questions",
    
    
    //onboarding Questions
    
    GET_USER_QUESTIONS:"/user-questions",

    //submit 
    SUBMIT_ONBOARDING: "/submit-onboarding",

    GET_ONBOARDING_PROFILE:"/onboarding-profile"

} as const