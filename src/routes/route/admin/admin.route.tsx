import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";

import AdminDashboardPage from "../../../pages/admin/admin-dashboard.page";

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        
          <Route
            path="/admin/dashboard"
            element={<AdminDashboardPage />}
          />
        </Route>

    </Routes>
  );
};

export default AdminRoute;
