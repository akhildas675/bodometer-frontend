import { Route } from "react-router-dom";

import ProtectedRoute from "@/routes/guard.routes/protected.route";
import TrainerOnboardingRoute from "@/routes/guard.routes/TrainerOnboardingRoute";
import TrainerStatusRoute from "@/routes/guard.routes/TrainerStatusRoute";
import ApprovedTrainerRoute from "@/routes/guard.routes/ApprovedTrainerRoute";

import TrainerDashboardPage from "@/pages/trainer/trainer-dashboard.page";
import TrainerOnboardingSkillPage from "@/pages/trainer/trainer.onboarding-skill.page";
import TrainerOnboardingAboutPage from "@/pages/trainer/trainer.onboarding-about.page";
import TrainerOnboardingExperiencePage from "@/pages/trainer/trainer.onboarding-experience.page";
import TrainerProfilePage from "@/pages/trainer/trainer-profile.page";
import TrainerStatusPage from "@/pages/trainer/trainer-status.page";

import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>

    {/* No profile → onboarding only */}
    <Route element={<TrainerOnboardingRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_EXPERIENCE} element={<TrainerOnboardingExperiencePage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_ABOUT}      element={<TrainerOnboardingAboutPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_SKILL}      element={<TrainerOnboardingSkillPage />} />
    </Route>

    {/* Pending or Rejected */}
    <Route element={<TrainerStatusRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_PENDING} element={<TrainerStatusPage />} />
    </Route>

    {/*Approved */}
    <Route element={<ApprovedTrainerRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_DASHBOARD} element={<TrainerDashboardPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_PROFILE}   element={<TrainerProfilePage />} />
    </Route>

  </Route>
);