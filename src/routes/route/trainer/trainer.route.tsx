// src/routes/trainer/trainer.routes.tsx
import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import TrainerDashboardPage from "../../../pages/trainer/trainer-dashboard.page";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
    <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
  </Route>
);
