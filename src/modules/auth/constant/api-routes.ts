export const AUTH_API_ROUTES = {
  REGISTER: "/register",
  OTP_VERIFY: "/verify-otp",
  OTP_RESEND: "/resend-otp",
  LOGIN: "/login",
  COMPLETE_REGISTER: "/complete-register",
  FORGET_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
  GOOGLE_LOGIN: "/google-login",
  REFRESH_TOKEN: "/refresh-token",
  LOGOUT: "/logout",
} as const;
