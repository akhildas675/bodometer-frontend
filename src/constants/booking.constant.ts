export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  RESCHEDULED: "rescheduled",
  COMPLETED: "completed",
  NOT_ATTENDED: "not_attended",
  CANCELLED_BY_TRAINER: "cancelled_by_trainer",
  CANCELLED_BY_USER: "cancelled_by_user",
  EXPIRED: "expired",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const SLOT_STATUS = {
  AVAILABLE: "available",
  BOOKED: "booked",
  EXPIRED: "expired",
  BLOCKED: "blocked",
} as const;

export type SlotStatus = typeof SLOT_STATUS[keyof typeof SLOT_STATUS];

export const COACHING_DURATION = {
  THIRTY: 30,
  FORTY_FIVE: 45,
  SIXTY: 60,
} as const;

export type CoachingDuration = typeof COACHING_DURATION[keyof typeof COACHING_DURATION];

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

export const AVAILABILITY_STATUS = {
  ACTIVE: "ACTIVE",
  FUTURE: "FUTURE",
  EXPIRED: "EXPIRED",
  DRAFT: "DRAFT",
} as const;

export type AvailabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS];

export const DAY_OF_WEEK = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;

export type DayOfWeek = typeof DAY_OF_WEEK[keyof typeof DAY_OF_WEEK];

export const ADVANCE_NOTICE_HOURS = {
  TWO: 2,
  FOUR: 4,
  SIX: 6,
  TWELVE: 12,
  TWENTY_FOUR: 24,
  FORTY_EIGHT: 48,
  SEVENTY_TWO: 72,
} as const;

export type AdvanceNoticeHours = typeof ADVANCE_NOTICE_HOURS[keyof typeof ADVANCE_NOTICE_HOURS];

export const BUFFER_TIME_MINUTES = {
  TWENTY: 20,
  THIRTY: 30,
  FORTY: 40,
  FORTY_FIVE: 45,
  FIFTY: 50,
  SIXTY: 60,
} as const;

export type BufferTimeMinutes = typeof BUFFER_TIME_MINUTES[keyof typeof BUFFER_TIME_MINUTES];

export const MAX_BOOKING_LIMITS = {
  FIVE: 5,
  EIGHT: 8,
  TEN: 10,
  TWELVE: 12,
} as const;

export type MaxBookingLimits = typeof MAX_BOOKING_LIMITS[keyof typeof MAX_BOOKING_LIMITS];

export const MAX_AVAILABILITY_DAYS = 90;
export const MINUTES_PER_DAY = 1440;
export const MIN_SHIFT_DURATION_MINUTES = 30;
export const MAX_BUFFER_MINUTES = 60;

export const TRAINER_AVAILABILITY_MESSAGES = {
  SUCCESS: {
    PUBLISHED: "Trainer availability schedule and booking settings published successfully!",
    UPDATED: "Trainer availability schedule and booking settings updated successfully!",
    DELETED: "Schedule deleted successfully",
    BOOKING_SETTINGS_SAVED: "Booking settings saved successfully!",
    UNAVAILABILITY_LOGGED: "Unavailability logged successfully",
    UNAVAILABILITY_CANCELLED: "Leave record cancelled",
  },
  ERROR: {
    EXPIRED_CANNOT_EDIT: "Expired availability cannot be modified.",
    VALIDATION_FAILED: "Please resolve all validation requirements before publishing.",
    SERVICE_REQUIRED: "Please select at least one offered service before publishing.",
    FETCH_FAILED: "Failed to fetch initial trainer availability data.",
    SAVE_AVAILABILITY_FAILED: "Failed to save trainer availability.",
    DELETE_SCHEDULE_FAILED: "Failed to delete schedule.",
    SAVE_BOOKING_SETTINGS_FAILED: "Failed to save booking settings.",
    LOG_UNAVAILABILITY_FAILED: "Failed to log unavailability.",
    CANCEL_UNAVAILABILITY_FAILED: "Failed to cancel leave.",
    INVALID_DATES: "Please enter valid start and end dates.",
  },
  CONFIRMATION: {
    PUBLISH_TITLE: "Confirm Publish Schedule & Booking Settings",
    PUBLISH_MESSAGE: "Are you sure you want to publish your availability schedule and booking settings? This schedule and your selected services will become active for client bookings.",
    UPDATE_TITLE: "Confirm Update Schedule & Booking Settings",
    UPDATE_MESSAGE: "Are you sure you want to update your availability schedule and booking settings? Changes will apply immediately to your active availability.",
    PUBLISH_CONFIRM_TEXT: "Yes, Publish Schedule",
    UPDATE_CONFIRM_TEXT: "Yes, Update Schedule",
  },
} as const;

