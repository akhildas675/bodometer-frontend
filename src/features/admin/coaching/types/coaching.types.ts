export type CoachingDuration = 30 | 45 | 60;
export type BookingMode = "Online" | string;

export interface CoachingForm {
  serviceType: string;
  description: string;
  durationMinutes: CoachingDuration | number;
  price: number;
  bookingMode: BookingMode;
  isActive?: boolean;
}

export interface CreateCoachingDto {
  serviceType: string;
  description: string;
  durationMinutes: CoachingDuration | number;
  price: number;
  bookingMode: BookingMode;
  isActive?: boolean;
}

export interface UpdateCoaching {
  id?: string;
  coachingId: string;
  _id?: string;
  serviceId?: string;
  serviceType: string;
  description: string;
  durationMinutes: CoachingDuration | number;
  price: number;
  bookingMode: BookingMode;
  isActive: boolean;
  createdAt?: string;
}

export type CoachingListItem = UpdateCoaching;

export type CoachingDetail = UpdateCoaching;
