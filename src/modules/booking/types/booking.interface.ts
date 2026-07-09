import { SlotDuration, SlotStatus } from "../constant/constant.types/booking.constant";

// ── Slot types ────────────────────────────────────────────────────────────────

export interface TrainerSlot {
  id: string;
  _id?: string;
  availabilityId: string;
  trainerId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: SlotStatus;
  pendingBookingsCount?: number;
}

// ── Availability creation ─────────────────────────────────────────────────────

export interface AvailabilityShiftInput {
  startTime: string; // ISO string
  endTime: string;
  duration: SlotDuration;
}

export interface CreateAvailabilityPayload {
  date: string; // YYYY-MM-DD
  shifts: AvailabilityShiftInput[];
}

// ── Booking types ─────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled_by_trainer"
  | "cancelled_by_user"
  | "completed"
  | "not_attended"
  | "expired";

export interface BookingTrainer {
  id: string;
  name: string;
  profilePic?: string;
  profileId?: string;
}

export interface BookingUser {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
}

/** Shape returned to the user for their own bookings */
export interface UserBookingItem {
  id: string;
  trainer: BookingTrainer;
  startTime: string; // ISO string
  endTime: string;
  status: BookingStatus;
  cancelReason?: string;
  cancelledBy?: string;
  note?: string;
  createdAt: string;
}

/** Shape returned to the trainer for bookings on their slots */
export interface TrainerBookingItem {
  id: string;
  user: BookingUser;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  cancelReason?: string;
  cancelledBy?: string;
  note?: string;
  createdAt: string;
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  slotId: string;
  note?: string;
}

export interface RejectCancelBookingPayload {
  reason: string;
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}