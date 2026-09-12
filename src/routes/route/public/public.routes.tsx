import { Route } from "react-router-dom";
import UserHomePage from "@/features/user/user.users/pages/user-home.page";
import PublicGuard from "../../guard.routes/public-guard.routes";
import MainLayoutsNoSidebar from "@/ui.components/layouts/user.layouts.ts/MainLayoutsNoSidebar";
import MainLayouts from "@/ui.components/layouts/MainLayouts";
import UserBmiPage from "@/features/user/user.users/pages/user-bmi.page";
import UserTrainersPage from "@/features/user/user.trainers/pages/user-trainers.page";
import UserCategoriesPage from "@/features/user/user.category/pages/user-categories.page";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { useAuthStore } from "@/stores/auth.store";

const DynamicPublicLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.role === "user" ? <MainLayouts /> : <MainLayoutsNoSidebar />;
};


export const publicRoutes = (
  <Route element={<PublicGuard />}>
    <Route element={<MainLayoutsNoSidebar />}>
      <Route path="/" element={<UserHomePage />} />
    </Route>
    <Route element={<DynamicPublicLayout />}>
      <Route path={USER_UI_ROUTES.USER_BMI} element={<UserBmiPage />} />
      <Route path={USER_UI_ROUTES.USER_TRAINERS} element={<UserTrainersPage />} />
      <Route path={USER_UI_ROUTES.USER_CATEGORIES} element={<UserCategoriesPage />} />
    </Route>
  </Route>
);
