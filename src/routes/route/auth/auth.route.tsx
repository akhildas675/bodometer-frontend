import { Route } from "react-router-dom";

import AuthLayouts from "@/ui.components/layouts/auth.layouts";

import UserLoginPage from "@/features/user/user.users/pages/user-login.page";
import UserForgetPasswordPage from "@/features/auth/pages/auth-forget-password.page";
import AuthResetPasswordPage from "@/features/auth/pages/auth-reset-password.page";
import GuestRoute from "@/routes/guard.routes/guest.route";
import { AUTH_UI_ROUTES } from "@/constants/constant-routes/ui-routes/auth.ui-constant.routes";
import UserRegisterPage from "@/features/user/user.users/pages/user-register.page";
import TrainerRegisterPage from "@/features/trainer/trainer.trainers/page/trainer-register.page";
import UserOtpPage from "@/features/user/user.users/pages/user-otp.page";
import TrainerOtpPage from "@/features/trainer/trainer.trainers/page/trainer-otp.page";

export const authRoutes = (
  <Route element={<GuestRoute />}>
    <Route element={<AuthLayouts />}>
      <Route path={AUTH_UI_ROUTES.LOGIN_PAGE} element={<UserLoginPage />} />
      <Route path={AUTH_UI_ROUTES.USER_REGISTER_PAGE} element={<UserRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_REGISTER_PAGE} element={<TrainerRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.USER_OTP_PAGE} element={<UserOtpPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_OTP_PAGE} element={<TrainerOtpPage />} />
      <Route path="/otp" element={<UserOtpPage />} />
      <Route path="/otp/user" element={<UserOtpPage />} />
      <Route path="/otp/trainer" element={<TrainerOtpPage />} />
      <Route path={AUTH_UI_ROUTES.FORGET_PASSWORD_PAGE} element={<UserForgetPasswordPage />} />
      <Route path={AUTH_UI_ROUTES.RESET_PASSWORD_PAGE} element={<AuthResetPasswordPage />} />
    </Route>
  </Route>
);
