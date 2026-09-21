import { BrowserRouter, Routes } from "react-router-dom";
import { authRoutes } from "@/routes/auth.routes";
import { adminRoutes } from "@/routes/admin.routes";
import { trainerRoutes } from "@/routes/trainer.routes";
import { userRoutes } from "@/routes/user.routes";
import { publicRoutes } from "@/routes/public.routes";


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

    </BrowserRouter>
  );
};

export default AppRoutes;
