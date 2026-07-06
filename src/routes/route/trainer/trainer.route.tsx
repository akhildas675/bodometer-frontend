import { Route } from "react-router-dom";

import ProtectedRoute from "@/routes/guard.routes/protected.route";
import TrainerOnboardingRoute from "@/routes/guard.routes/TrainerOnboardingRoute";
import TrainerStatusRoute from "@/routes/guard.routes/TrainerStatusRoute";
import ApprovedTrainerRoute from "@/routes/guard.routes/ApprovedTrainerRoute";
import TrainerDashboardPage from "@/features/trainer/trainer.trainers/page/trainer-dashboard.page";

import TrainerProfilePage from "@/features/trainer/trainer.trainers/page/trainer-profile.page";
import TrainerStatusPage from "@/features/trainer/trainer.onboarding/pages/trainer-status.page";

import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";
import TrainerOnboardingIntroPage from "@/features/trainer/trainer.onboarding/pages/trainer.onboarding-intro.page";
import TrainerOnboardingProfilePage from "@/features/trainer/trainer.onboarding/pages/trainer.onboarding-experience.page";
import MainLayouts from "@/ui.components/layouts/MainLayouts";
import TrainerOnboardingSkillPage from "@/features/trainer/trainer.onboarding/pages/trainer.onboarding-category.page";
import TrainerSlotsPage from "@/features/trainer/trainer.booking/pages/trainer-slots.page";
import TrainerBookingsPage from "@/features/trainer/trainer.booking/pages/trainer-bookings.page";

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