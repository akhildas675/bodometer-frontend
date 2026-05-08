import { Route } from "react-router-dom";
import MainLayouts from "@/components/layouts/MainLayouts";
import UserProfilePage from "@/pages/user/user-profile.page";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import UserTrainersPage from "@/pages/user/user-trainers.page";
import UserCategoriesPage from "@/pages/user/user-categories.page";
import UserChangePasswordPage from "@/pages/user/user.change-password.page";
import UserTrainerDetailPage from "@/pages/user/user.trainer-detail.page";
import MainLayoutsNoSidebar from "@/components/layouts/user.layouts.ts/MainLayoutsNoSidebar";
import { ROLES } from "@/constants/role";
export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
    <Route element={<MainLayouts />}>
      <Route path={USER_UI_ROUTES.USER_PROFILE} element={<UserProfilePage />} />

      <Route
        path={USER_UI_ROUTES.USER_CHANGE_PASSWORD}
        element={<UserChangePasswordPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINERS}
        element={<UserTrainersPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINER_DETAILS}
        element={<UserTrainerDetailPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_CATEGORIES}
        element={<UserCategoriesPage />}
      />
    </Route>





    {/* No Sidebar pages */}
    <Route element={<MainLayoutsNoSidebar />}>


    </Route>





  </Route>
);
