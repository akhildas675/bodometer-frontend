import { Route } from "react-router-dom";

import AuthLayouts from "@/components/layouts/auth.layouts";

import UserLoginPage from "@/pages/user/user-auth/user-login.page";
import UserForgetPasswordPage from "@/pages/auth/auth-forget-password.page";
import AuthResetPasswordPage from "@/pages/auth/auth-reset-password.page";
import GuestRoute from "@/routes/guard.routes/guest.route";
import { AUTH_UI_ROUTES } from "@/constants/constant-routes/ui-routes/auth.ui-constant.routes";
import UserRegisterPage from "@/pages/user/user-auth/user-register.page";
import TrainerRegisterPage from "@/pages/trainer/trainer-register.page";
import UserOtpPage from "@/pages/user/user-auth/user-otp.page";
import TrainerOtpPage from "@/pages/trainer/trainer-otp.page";

export const authRoutes = (
  <Route element={<GuestRoute />}>
    <Route element={<AuthLayouts />}>
      <Route path={AUTH_UI_ROUTES.LOGIN_PAGE} element={<UserLoginPage />} />
      <Route path={AUTH_UI_ROUTES.USER_REGISTER_PAGE} element={<UserRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_REGISTER_PAGE} element={<TrainerRegisterPage />} />
      <Route path={AUTH_UI_ROUTES.USER_OTP_PAGE} element={<UserOtpPage />} />
      <Route path={AUTH_UI_ROUTES.TRAINER_OTP_PAGE} element={<TrainerOtpPage />} />
      <Route path={AUTH_UI_ROUTES.FORGET_PASSWORD_PAGE} element={<UserForgetPasswordPage />} />
      <Route path={AUTH_UI_ROUTES.RESET_PASSWORD_PAGE} element={<AuthResetPasswordPage />} />
    </Route>
  </Route>
);
