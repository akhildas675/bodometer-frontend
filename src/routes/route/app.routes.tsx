import { BrowserRouter, Routes } from "react-router-dom";
import { authRoutes } from "./auth/auth.route";
import { adminRoutes } from "./admin/admin.route";
import { trainerRoutes } from "./trainer/trainer.route";
import { userRoutes } from "./user/user.route";
import { publicRoutes } from "./public/public.routes";
import { GlobalCallRequestModal } from "@/features/video-call/components/GlobalCallRequestModal";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        {adminRoutes}
        {trainerRoutes}
        {userRoutes}
        {publicRoutes}
      </Routes>
      <GlobalCallRequestModal />
    </BrowserRouter>
  );
};

export default AppRoutes;
