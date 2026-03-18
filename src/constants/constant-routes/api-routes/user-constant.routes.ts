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


} as const