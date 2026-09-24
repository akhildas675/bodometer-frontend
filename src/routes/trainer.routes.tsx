import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import TrainerOnboardingRoute from "@/routes/guards/TrainerOnboardingRoute";
import TrainerStatusRoute from "@/routes/guards/TrainerStatusRoute";
import ApprovedTrainerRoute from "@/routes/guards/ApprovedTrainerRoute";
import TrainerDashboardPage from "@/features/trainer/pages/TrainerDashboardPage";

import TrainerProfilePage from "@/features/trainer/pages/TrainerProfilePage";
import TrainerStatusPage from "@/features/onboarding/pages/TrainerStatusPage";

import { TRAiNER_UI_ROUTES } from "@/constants/routes/trainer.routes";
import TrainerOnboardingIntroPage from "@/features/onboarding/pages/TrainerOnboardingIntroPage";
import TrainerOnboardingProfilePage from "@/features/onboarding/pages/TrainerOnboardingExperiencePage";
import MainLayouts from "@/components/layout/MainLayout";
import TrainerOnboardingSkillPage from "@/features/onboarding/pages/TrainerOnboardingCategoryPage";
import TrainerNotificationPage from "@/features/notification/pages/TrainerNotificationPage";
import VideoSessionPage from "@/features/video-session/pages/VideoSessionPage";
import TrainerChatPage from "@/features/chat/pages/TrainerChatPage";

const TrainerBookingSetupPage = lazy(
  () => import("@/features/booking/pages/TrainerBookingSetupPage")
);
const TrainerBookingManagementPage = lazy(
  () => import("@/features/booking/pages/TrainerBookingManagementPage")
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
        <Route path={TRAiNER_UI_ROUTES.TRAINER_VIDEO_CALL_SESSION} element={<VideoSessionPage />} />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_MESSAGES} element={<TrainerChatPage />} />

        {/* Legacy redirect: /trainer/availability → /trainer/booking */}
        <Route
          path={TRAiNER_UI_ROUTES.TRAINER_AVAILABILITY}
          element={<Navigate to={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT} replace />}
        />
      </Route>
    </Route>
  </Route>
);