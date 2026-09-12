export const VIDEO_SESSION_STATUS = {
  WAITING: "WAITING",
  ACCEPTED: "ACCEPTED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  INCOMPLETE: "INCOMPLETE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type VideoSessionStatus =
  (typeof VIDEO_SESSION_STATUS)[keyof typeof VIDEO_SESSION_STATUS];

export const VIDEO_SESSION_REFUND_STATUS = {
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  ELIGIBLE: "ELIGIBLE",
  REQUESTED: "REQUESTED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;

export type VideoSessionRefundStatus =
  (typeof VIDEO_SESSION_REFUND_STATUS)[keyof typeof VIDEO_SESSION_REFUND_STATUS];

export interface VideoSession {
  id: string;
  bookingId: string;
  trainerId: string;
  userId: string;

  scheduledStartTime: Date | string;
  scheduledEndTime: Date | string;

  trainerStartRequestedAt?: Date | string;
  userAcceptedAt?: Date | string;

  trainerJoinedAt?: Date | string;
  userJoinedAt?: Date | string;

  actualStartTime?: Date | string;
  actualEndTime?: Date | string;
  actualDurationMinutes?: number;

  trainerLeftAt?: Date | string;
  userLeftAt?: Date | string;

  status: VideoSessionStatus | string;
  terminationReason?: string;

  refundEligible?: boolean;
  refundStatus?: VideoSessionRefundStatus;
  refundId?: string;
  refundRequestedAt?: Date | string;
  refundProcessedAt?: Date | string;

  createdAt?: Date | string;
  updatedAt?: Date | string;

  bookingNumber?: string;
  otherParticipantName?: string;
  otherParticipantEmail?: string;
  serviceName?: string;
  sessionPrice?: number;
}