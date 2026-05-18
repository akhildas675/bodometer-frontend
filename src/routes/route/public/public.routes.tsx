import { Route, Outlet } from "react-router-dom";
import UserHomePage from "@/pages/user/user-home.page";
import PublicGuard from "../../guard.routes/public-guard.routes";
import MainLayoutsNoSidebar from "@/components/layouts/user.layouts.ts/MainLayoutsNoSidebar";
import MainLayouts from "@/components/layouts/MainLayouts";
import UserBmiPage from "@/pages/user/user-fitness/user-bmi.page";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { useAuthStore } from "@/stores/auth.store";

const DynamicBmiLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.role === "user" ? <MainLayouts /> : <MainLayoutsNoSidebar />;
};


export const publicRoutes = (
  <Route element={<PublicGuard />}>
    <Route element={<MainLayoutsNoSidebar />}>
      <Route path="/" element={<UserHomePage />} />
    </Route>
    <Route element={<DynamicBmiLayout />}>
      <Route path={USER_UI_ROUTES.USER_BMI} element={<UserBmiPage />} />
    </Route>
  </Route>
);
