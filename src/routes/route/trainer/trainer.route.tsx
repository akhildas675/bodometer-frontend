import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import TrainerDashboardPage from "../../../pages/trainer/trainer-dashboard.page";
import TrainerOnboardingSkillPage from "../../../pages/trainer/trainer.onboarding-skill.page";
import TrainerOnboardingAboutPage from "../../../pages/trainer/trainer.onboarding-about.page";
import TrainerOnboardingExperiencePage from "../../../pages/trainer/trainer.onboarding-experience.page";
import TrainerPending from "../../../components/trainer/trainer.pending";
import TrainerProfilePage from "../../../pages/trainer/trainer-profile.page";
import { TRAiNER_UI_ROUTES } from "../../../constants/constant-routes/ui-routes/trainer.ui-constant.routes";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
    <Route path={TRAiNER_UI_ROUTES.TRAINER_DASHBOARD} element={<TrainerDashboardPage />} />
    <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_ABOUT} element={<TrainerOnboardingAboutPage/>}/>
    <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_SKILL} element={<TrainerOnboardingSkillPage/>}/>
    <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_EXPERIENCE} element={<TrainerOnboardingExperiencePage/>}/>
    <Route path={TRAiNER_UI_ROUTES.TRAINER_PENDING} element={<TrainerPending/>}/>
    <Route path={TRAiNER_UI_ROUTES.TRAINER_PROFILE} element={<TrainerProfilePage/>}/>
  </Route>
);
