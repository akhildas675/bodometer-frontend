export const SLOT_STATUS = {
  AVAILABLE: "available",
  BOOKED: "booked",
  EXPIRED: "expired",
  BLOCKED: "blocked",
} as const;
export type SlotStatus = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];
 
export const SLOT_DURATION = {
  THIRTY: 30,
  FORTY_FIVE: 45,
  SIXTY: 60,
} as const;
export type SlotDuration = (typeof SLOT_DURATION)[keyof typeof SLOT_DURATION];
 