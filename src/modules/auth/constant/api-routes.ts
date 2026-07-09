export const AUTH_API_ROUTES = {
  REGISTER: "/register",
  OTP_VERIFY: "/otp-verify",
  OTP_RESEND: "/otp-resend",
  LOGIN: "/login",
  COMPLETE_REGISTER: "/register/complete",
  FORGET_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
  GOOGLE_LOGIN: "/google-login",
  REFRESH_TOKEN: "/refresh-token",
  LOGOUT: "/logout",
} as const;
