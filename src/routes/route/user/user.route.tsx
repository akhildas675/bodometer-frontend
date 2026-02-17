import { Route } from "react-router-dom";
import MainLayouts from "../../../components/layouts/MainLayouts";
import UserProfilePage from "../../../pages/user/user-profile.page";
import ProtectedRoute from "../../guard.routes/protected.route";
import { USER_UI_ROUTES } from "../../../constants/constant-routes/ui-routes/user.ui-constant.routes";

export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route element={<MainLayouts />}>
      <Route path={USER_UI_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
    </Route>
  </Route>
);
