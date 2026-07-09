export const BOOKING_API_ROUTES = {
  //Availability
  CREATE_AVAILABILITY: "/booking/availability",
  GET_AVAILABILITY: "/booking/availability",

  //  Slots 
  GET_MY_SLOTS: "/booking/slots",
  GET_TRAINER_AVAILABLE_SLOTS: (trainerId: string) =>
    `/booking/slots/trainers/${trainerId}`,
  BLOCK_SLOT: (slotId: string) => `/booking/slots/${slotId}/block`,
  UNBLOCK_SLOT: (slotId: string) => `/booking/slots/${slotId}/unblock`,

  //  Bookings 
  CREATE_BOOKING: "/booking/bookings",
  GET_TRAINER_BOOKINGS: "/booking/bookings",
  GET_MY_BOOKINGS: "/booking/bookings/my",

  ACCEPT_BOOKING: (bookingId: string) =>
    `/booking/bookings/${bookingId}/accept`,
  REJECT_BOOKING: (bookingId: string) =>
    `/booking/bookings/${bookingId}/reject`,
  CANCEL_BOOKING: (bookingId: string) =>
    `/booking/bookings/${bookingId}/cancel`,
} as const;
