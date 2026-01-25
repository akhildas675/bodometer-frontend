import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import TrainerDashboardPage from "../../../pages/trainer/trainer-dashboard.page";
import TrainerOnboardingSkillPage from "../../../pages/trainer/trainer.onboarding-skill.page";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
    <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
    <Route path="/trainer/onboarding-skill" element={<TrainerOnboardingSkillPage/>}/>
  </Route>
);
