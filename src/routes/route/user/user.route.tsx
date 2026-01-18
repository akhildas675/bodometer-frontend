import { Route } from "react-router-dom";
import MainLayouts from "../../../components/layouts/MainLayouts";
import UserProfilePage from "../../../pages/user/user-profile.page";
import ProtectedRoute from "../../guard.routes/protected.route";

export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route element={<MainLayouts />}>
      <Route path="/user-profile" element={<UserProfilePage />} />
    </Route>
  </Route>
);
