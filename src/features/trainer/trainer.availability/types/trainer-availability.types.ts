

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type AvailabilityStatus =
  | "ACTIVE"
  | "FUTURE"
  | "EXPIRED"
  | "DRAFT";

export type UnavailabilityType =
  | "VACATION"
  | "MEDICAL_LEAVE"
  | "EMERGENCY"
  | "PERSONAL_LEAVE";

export type UnavailabilityStatus =
  | "ACTIVE"
  | "CANCELLED";

export type OverrideStatus =
  | "ACTIVE"
  | "CANCELLED";




export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  startMinute?: number;
  endMinute?: number;
}

export interface DaySchedule {
  dayOfWeek: Weekday;
  isAvailable: boolean;
  shifts: Shift[];
}



export interface TrainerAvailability {
  id: string;
  trainerId: string;

  effectiveFrom: string;
  effectiveUntil: string;

  timeZone: string;

  weeklySchedule: DaySchedule[];

  status: AvailabilityStatus;

  createdAt?: string;
  updatedAt?: string;
}
export type TrainerBookingSettingsForm = Pick<
  TrainerBookingSettings,
  | "serviceIds"
  | "advanceNoticeHours"
  | "bufferMinutes"
  | "maximumBookingPerDay"
>;

export interface TrainerBookingSettings {
  id: string;
  trainerId: string;

  serviceIds: string[];

  advanceNoticeHours: number;
  bufferMinutes: number;
  maximumBookingPerDay: number;

  createdAt?: string;
  updatedAt?: string;
}




export interface TrainerUnavailability {
  id: string;
  trainerId: string;

  type: UnavailabilityType;

  startDate: string;
  endDate: string;

  reason?: string;

  status: UnavailabilityStatus;

  createdAt?: string;
  updatedAt?: string;
}




export type CreateTrainerUnavailability = Pick<
  TrainerUnavailability,
  "type" | "startDate" | "endDate" | "reason"
> & { id?: string };




export interface TrainerAvailabilityOverride {
  id: string;
  trainerId: string;
  availabilityId?: string;

  date: string;

  shifts: {
    startMinute: number;
    endMinute: number;
  }[];

  reason?: string;

  status: OverrideStatus;

  createdAt?: string;
  updatedAt?: string;
}



export interface ValidationErrorItem {
  field: string;

  dayOfWeek?: Weekday;

  shiftId?: string;

  message: string;
}

export interface AvailabilityValidationResult {
  isValid: boolean;

  errors: ValidationErrorItem[];
}




export interface TrainerScheduleSetupPayload {
 
  availability: {
    effectiveFrom: string;
    effectiveUntil: string;

    timeZone: string;

    weeklySchedule: DaySchedule[];

    status?: AvailabilityStatus;
  };

  
  settings: {
    serviceIds: string[];

    advanceNoticeHours: number;

    bufferMinutes: number;

    maximumBookingPerDay: number;
  };


  unavailabilities?: CreateTrainerUnavailability[];
}