export const TRAiNER_UI_ROUTES = {
    TRAINER_DASHBOARD: "/trainer",

    TRAINER_ONBOARDING_INTRO: "/trainer/onboarding/intro",
    TRAINER_ONBOARDING_PROFILE: "/trainer/onboarding/profile",
    TRAINER_PROFILE: "/trainer/profile",
    TRAINER_PENDING: "/trainer/status",
    TRAINER_CATEGORIES: "/trainer/categories",

    // Legacy - kept for backward compatibility
    TRAINER_AVAILABILITY: "/trainer/availability",

    // Booking — Two-mode flow
    TRAINER_BOOKING_SETUP: "/trainer/booking/setup",
    TRAINER_BOOKING_MANAGEMENT: "/trainer/booking",
    TRAINER_NOTIFICATIONS: "/trainer/notifications",
    TRAINER_VIDEO_CALL: "/trainer/video-call/:bookingId",
    TRAINER_VIDEO_CALL_SESSION: "/trainer/video-call/:videoSessionId",
} as const;