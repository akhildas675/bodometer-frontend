import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayouts from "../components/layouts/MainLayouts";
import RegisterPage from "../pages/user/RegisterPage";
import HomePage from "../pages/user/HomePage";
import LoginPage from "../pages/user/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/user/Dashboard";
import OtpVerifyPage from "../pages/user/OtpVerifyPage";


const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME (ALWAYS PUBLIC) */}
        <Route element={<MainLayouts />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* AUTH PAGES (PUBLIC) */}
          <Route path="/user-otp" element={<OtpVerifyPage/>} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/user-register" element={<RegisterPage />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes;
