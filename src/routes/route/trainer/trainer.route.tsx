import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";

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
import TrainerNotificationPage from "@/features/trainer/trainer.notification/pages/trainer-notification.page";

// ── Booking — two-mode flow ──────────────────────────────────────────
const TrainerBookingSetupPage = lazy(
  () => import("@/features/trainer/trainer.booking/pages/trainer-booking-setup.page")
);
const TrainerBookingManagementPage = lazy(
  () => import("@/features/trainer/trainer.booking/pages/trainer-booking-management.page")
);
const VideoCallPage = lazy(
  () => import("@/features/video-call/pages/VideoCallPage")
);

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

    {/* Approved */}
    <Route element={<MainLayouts />}>
      <Route element={<ApprovedTrainerRoute />}>
        <Route path={TRAiNER_UI_ROUTES.TRAINER_DASHBOARD} element={<TrainerDashboardPage />} />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_PROFILE} element={<TrainerProfilePage />} />

        {/* Booking — two-mode flow */}
        <Route path={TRAiNER_UI_ROUTES.TRAINER_BOOKING_SETUP} element={<TrainerBookingSetupPage />} />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT} element={<TrainerBookingManagementPage />} />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_NOTIFICATIONS} element={<TrainerNotificationPage />} />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_VIDEO_CALL} element={<VideoCallPage />} />

        {/* Legacy redirect: /trainer/availability → /trainer/booking */}
        <Route
          path={TRAiNER_UI_ROUTES.TRAINER_AVAILABILITY}
          element={<Navigate to={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT} replace />}
        />
      </Route>
    </Route>
  </Route>
);