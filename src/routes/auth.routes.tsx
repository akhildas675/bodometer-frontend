import { Route } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import { UserRegisterPage, TrainerRegisterPage } from "@/features/auth/pages/RegisterPage";
import { UserOtpPage, TrainerOtpPage } from "@/features/auth/pages/OtpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import GuestRoute from "@/routes/guards/GuestRoute";
import { AUTH_UI_ROUTES } from "@/constants/routes/auth.routes";

export const authRoutes = (
  <Route element={<GuestRoute />}>
    <Route element={<AuthLayout />}>
      <Route path={AUTH_UI_ROUTES.LOGIN_PAGE} element={<LoginPage />} />
      <Route path={AUTH_UI_ROUTES.USER_REGISTER_PAGE} element={<UserRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_REGISTER_PAGE} element={<TrainerRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.USER_OTP_PAGE} element={<UserOtpPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_OTP_PAGE} element={<TrainerOtpPage />} />
      <Route path="/otp" element={<UserOtpPage />} />
      <Route path="/otp/user" element={<UserOtpPage />} />
      <Route path="/otp/trainer" element={<TrainerOtpPage />} />
      <Route path={AUTH_UI_ROUTES.FORGET_PASSWORD_PAGE} element={<ForgotPasswordPage />} />
      <Route path={AUTH_UI_ROUTES.RESET_PASSWORD_PAGE} element={<ResetPasswordPage />} />
    </Route>
  </Route>
);
