export const TRAINER_AVAILABILITY_PATHS = {
  SETUP: "/booking/setup",
  ROOT: "/booking/availability",
  BY_ID: (availabilityId: string) =>
    `/booking/availability/${availabilityId}`,

  OVERRIDES: "/booking/availability/overrides",
  OVERRIDE_BY_ID: (overrideId: string) =>
    `/booking/availability/overrides/${overrideId}`,

  UNAVAILABILITIES: "/booking/unavailability",
  UNAVAILABILITY_BY_ID: (unavailabilityId: string) =>
    `/booking/unavailability/${unavailabilityId}`,
} as const;

export const TRAINER_BOOKING_SETTINGS_PATHS = {
  ROOT: "/booking/settings",
} as const;


