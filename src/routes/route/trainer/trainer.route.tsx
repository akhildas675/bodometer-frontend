import { Route } from "react-router-dom";

import ProtectedRoute from "@/routes/guard.routes/protected.route";
import TrainerOnboardingRoute from "@/routes/guard.routes/TrainerOnboardingRoute";
import TrainerStatusRoute from "@/routes/guard.routes/TrainerStatusRoute";
import ApprovedTrainerRoute from "@/routes/guard.routes/ApprovedTrainerRoute";
import TrainerDashboardPage from "@/pages/trainer/trainer-dashboard.page";

import TrainerProfilePage from "@/pages/trainer/trainer-profile.page";
import TrainerStatusPage from "@/pages/trainer/trainer-status.page";

import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";
import TrainerOnboardingIntroPage from "@/pages/trainer/trainer.onboarding-intro.page";
import TrainerOnboardingProfilePage from "@/pages/trainer/trainer.onboarding-experience.page";
import MainLayouts from "@/components/layouts/MainLayouts";
import TrainerOnboardingSkillPage from "@/pages/trainer/trainer.onboarding-skill.page";
import TrainerSlotsPage from "@/pages/trainer/trainer-booking/trainer-slots.page";
import TrainerBookingsPage from "@/pages/trainer/trainer-booking/trainer-bookings.page";

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>

    {/* No profile → onboarding only */}
    <Route element={<TrainerOnboardingRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_INTRO} element={<TrainerOnboardingIntroPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_CATEGORIES} element={<TrainerOnboardingSkillPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_PROFILE} element={<TrainerOnboardingProfilePage />} />

    </Route>

    {/* Pending or Rejected */}
    <Route element={<TrainerStatusRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_PENDING} element={<TrainerStatusPage />} />
    </Route>

    {/*Approved */}
    <Route element={<MainLayouts/>}>

    <Route element={<ApprovedTrainerRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_DASHBOARD} element={<TrainerDashboardPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_PROFILE}   element={<TrainerProfilePage />} />
      
      {/* Slots & Bookings */}
      <Route path={TRAiNER_UI_ROUTES.TRAINER_SLOTS} element={<TrainerSlotsPage />} />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_BOOKINGS} element={<TrainerBookingsPage />} />
    </Route>

    </Route>
  </Route>
);