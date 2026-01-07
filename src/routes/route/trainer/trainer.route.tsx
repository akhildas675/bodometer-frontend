import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import TrainerDashboardPage from "../../../pages/trainer/trainer-dashboard.page";

const TrainerRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
        <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
      </Route>
    </Routes>
  );
};

export default TrainerRoute;
