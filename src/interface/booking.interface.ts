export interface TimeWindow {
  startTime: string;
  endTime: string;
}

export interface TrainerAvailability {
  _id: string;
  trainerId: string;
  startDate: string;
  endDate: string;
  timeWindows: TimeWindow[];
  sessionDuration: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAvailabilityPayload {
  startDate: string;
  endDate: string;
  timeWindows: TimeWindow[];
  sessionDuration: number;
}

export interface UpdateAvailabilityPayload {
  isActive: boolean;
}

export interface TrainerDynamicSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed" | "no_show";

export interface TrainerBooking {
  _id: string;
  userId: { _id: string; name: string; email: string; profilePic: string | null };
  trainerId: { _id: string; name: string; email: string; profilePic: string | null };
  bookingReference: string;
  bookingType: "ONLINE" | "OFFLINE";
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  userNotes: string;
  rejectionReason?: string;
  cancellationReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  statusUpdatedAt?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  trainerId: string;
  date: string;
  startTime: string;
  endTime: string;
  userNotes?: string;
  bookingType?: "ONLINE" | "OFFLINE";
}
