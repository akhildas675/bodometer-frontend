export const TRAINER_API_ROUTES={
    TRAINER_PROFILE:"/trainer-profile",
    TRAINER_PROFILE_UPDATE:"/trainer-profile-update",
    TRAINER_PROFILE_PICTURE:"/trainer-profile-picture",
    UPLOAD_DOCUMENT:"/upload-document",
    GET_CATEGORIES:"/categories",
    SUBMIT_PROFILE_DATA:"/submit-profile-data",

    // Slots
    CREATE_SLOT: "/slots",
    GET_MY_SLOTS: "/slots",
    DELETE_SLOT: "/slots/:slotId",
    TOGGLE_SLOT_ACTIVE: "/slots/:slotId/toggle",

    // Bookings
    GET_MY_BOOKINGS: "/bookings",
    CONFIRM_BOOKING: "/bookings/:bookingId/confirm",
    REJECT_BOOKING: "/bookings/:bookingId/reject",
    COMPLETE_BOOKING: "/bookings/:bookingId/complete",
    CANCEL_BOOKING: "/bookings/:bookingId/cancel",
} as const