export type VideoSessionStatus =
  | "WAITING"
  | "ACCEPTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type VideoSessionTerminationReason =
  | "USER_NO_SHOW"
  | "TRAINER_NO_SHOW"
  | "BOTH_NO_SHOW"
  | "USER_REJECTED"
  | "USER_DISCONNECTED"
  | "TRAINER_DISCONNECTED"
  | "USER_ENDED"
  | "TRAINER_ENDED"
  | "TECHNICAL_FAILURE"
  | "SYSTEM_FAILURE"
  | "BOOKING_CANCELLED"
  | "SCHEDULE_ENDED";

export interface VideoSession {
  id: string;
  bookingId: string;
  trainerId: string;
  userId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  trainerStartRequestedAt?: string;
  userAcceptedAt?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  trainerJoinedAt?: string;
  userJoinedAt?: string;
  trainerLeftAt?: string;
  userLeftAt?: string;
  status: VideoSessionStatus;
  terminationReason?: VideoSessionTerminationReason;
  createdAt: string;
  updatedAt: string;
}
