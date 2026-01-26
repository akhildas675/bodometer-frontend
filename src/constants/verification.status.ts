export const VERIFICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type VerificationStatus =
  typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
