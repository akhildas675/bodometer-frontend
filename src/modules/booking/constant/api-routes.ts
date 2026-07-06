export const BOOKING_API_ROUTES = {
  AVAILABILITY: "/booking/availability",
  AVAILABILITY_STATUS: (id: string) => `/booking/availability/${id}/status`,
  BOOKINGS: "/booking/bookings",
  CANCEL_BOOKING: (id: string) => `/booking/bookings/${id}/cancel`,
  MY_BOOKINGS: "/booking/my-bookings",
  CONFIRM_BOOKING: (id: string) => `/booking/bookings/${id}/confirm`,
  REJECT_BOOKING: (id: string) => `/booking/bookings/${id}/reject`,
  COMPLETE_BOOKING: (id: string) => `/booking/bookings/${id}/complete`,
  TRAINER_SLOTS: (trainerId: string) => `/booking/trainers/${trainerId}/slots`,
  USER_BOOKINGS: "/booking/user-bookings",
} as const;
