import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import AdminDashboardPage from "../../../pages/admin/admin-dashboard.page";
import AdminUsersPage from "../../../pages/admin/admin-users.page";


export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/users" element={<AdminUsersPage />} />
  </Route>
);
