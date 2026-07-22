export const COACHING_DURATION = {
  THIRTY: 30,
  FORTY_FIVE: 45,
  SIXTY: 60,
} as const;

export type CoachingDuration =
  typeof COACHING_DURATION[keyof typeof COACHING_DURATION];

export const SLOT_DURATION_OPTIONS = [
  { label: "30 Minutes", value: COACHING_DURATION.THIRTY },
  { label: "45 Minutes", value: COACHING_DURATION.FORTY_FIVE },
  { label: "60 Minutes", value: COACHING_DURATION.SIXTY },
] as const;

export const BOOKING_MODE = {
  ONLINE: "Online",
} as const;

export type BookingMode = typeof BOOKING_MODE[keyof typeof BOOKING_MODE];

export const BOOKING_MODE_OPTIONS = [
  { label: "Online", value: BOOKING_MODE.ONLINE },
] as const;
