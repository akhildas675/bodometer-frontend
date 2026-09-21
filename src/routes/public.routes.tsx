import { Route } from "react-router-dom";
import UserHomePage from "@/features/user/pages/UserHomePage";
import PublicGuard from "@/routes/guards/PublicGuardRoute";
import MainLayoutsNoSidebar from "@/components/layout/MainLayoutNoSidebar";
import MainLayouts from "@/components/layout/MainLayout";
import UserBmiPage from "@/features/user/pages/UserBmiPage";
import UserTrainersPage from "@/features/user/pages/UserTrainersPage";
import UserCategoriesPage from "@/features/workout/pages/UserCategoriesPage";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
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
