import { Routes, Route } from "react-router-dom";
import AuthLayouts from "../../../components/layouts/auth.layouts";
import UserLoginPage from "../../../pages/user/user-login.page";
import UserRegisterPage from "../../../pages/user/user-register.page";
import TrainerRegisterPage from "../../../pages/trainer/trainer-register.page";
import UserOtpPage from "../../../pages/user/user-otp.page";
import TrainerOtpPage from "../../../pages/trainer/trainer-otp.page";
import GuestRoute from "../../guard.routes/guest.route";
import UserForgetPasswordPage from "../../../pages/auth/auth-forget-password.page";
import AuthResetPasswordPage from "../../../pages/auth/auth-reset-password.page";


const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayouts />}>
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/user-register" element={<UserRegisterPage/>} />
          <Route path="/trainer-register" element={<TrainerRegisterPage />} />
          <Route path="/user-otp" element={<UserOtpPage />} />
          <Route path="/trainer-otp" element={<TrainerOtpPage />} />
          <Route path="/forgot-password" element={<UserForgetPasswordPage/>}/>
          <Route path="/reset-password" element={<AuthResetPasswordPage/>}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
