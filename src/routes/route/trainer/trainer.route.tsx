import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import TrainerDashboardPage from "../../../pages/trainer/trainer-dashboard.page";
import TrainerOnboardingSkillPage from "../../../pages/trainer/trainer.onboarding-skill.page";
import TrainerOnboardingAboutPage from "../../../pages/trainer/trainer.onboarding-about.page";
import TrainerOnboardingExperiencePage from "../../../pages/trainer/trainer.onboarding-experience.page";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
    <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
    <Route path="/trainer/onboarding-about" element={<TrainerOnboardingAboutPage/>}/>
    <Route path="/trainer/onboarding-skill" element={<TrainerOnboardingSkillPage/>}/>
    <Route path="/trainer/onboarding-experience" element={<TrainerOnboardingExperiencePage/>}/>
  </Route>
);
