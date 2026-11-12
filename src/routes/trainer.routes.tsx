import { lazy, Suspense } from "react";
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import TrainerOnboardingRoute from "@/routes/guards/TrainerOnboardingRoute";
import TrainerStatusRoute from "@/routes/guards/TrainerStatusRoute";
import ApprovedTrainerRoute from "@/routes/guards/ApprovedTrainerRoute";

import { TRAiNER_UI_ROUTES } from "@/constants/routes/trainer.routes";
import MainLayouts from "@/components/layout/MainLayout";
import VideoCallLayout from "@/components/layout/VideoCallLayout";
import MessagesLayout from "@/components/layout/MessagesLayout";

// Lazy load all trainer pages
const TrainerDashboardPage = lazy(() => import("@/features/trainer/pages/TrainerDashboardPage"));
const TrainerProfilePage = lazy(() => import("@/features/trainer/pages/TrainerProfilePage"));
const TrainerStatusPage = lazy(() => import("@/features/onboarding/pages/TrainerStatusPage"));
const TrainerOnboardingIntroPage = lazy(() => import("@/features/onboarding/pages/TrainerOnboardingIntroPage"));
const TrainerOnboardingProfilePage = lazy(() => import("@/features/onboarding/pages/TrainerOnboardingExperiencePage"));
const TrainerNotificationPage = lazy(() => import("@/features/notification/pages/TrainerNotificationPage"));
const VideoSessionPage = lazy(() => import("@/features/video-session/pages/VideoSessionPage"));
const TrainerChatPage = lazy(() => import("@/features/chat/pages/TrainerChatPage"));
const TrainerOnboardingSkillPage = lazy(() => import("@/features/onboarding/pages/TrainerOnboardingCategoryPage"));

const TrainerBookingSetupPage = lazy(
  () => import("@/features/booking/pages/TrainerBookingSetupPage")
);
const TrainerBookingManagementPage = lazy(
  () => import("@/features/booking/pages/TrainerBookingManagementPage")
);
const TrainerEarningsPage = lazy(
  () => import("@/features/finance/pages/TrainerEarningsPage")
);

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

export const trainerRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
    {/* No profile → onboarding only */}
    <Route element={<TrainerOnboardingRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_INTRO} element={
        <Suspense fallback={<PageLoader />}>
          <TrainerOnboardingIntroPage />
        </Suspense>
      } />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_CATEGORIES} element={
        <Suspense fallback={<PageLoader />}>
          <TrainerOnboardingSkillPage />
        </Suspense>
      } />
      <Route path={TRAiNER_UI_ROUTES.TRAINER_ONBOARDING_PROFILE} element={
        <Suspense fallback={<PageLoader />}>
          <TrainerOnboardingProfilePage />
        </Suspense>
      } />
    </Route>

    {/* Pending or Rejected */}
    <Route element={<TrainerStatusRoute />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_PENDING} element={
        <Suspense fallback={<PageLoader />}>
          <TrainerStatusPage />
        </Suspense>
      } />
    </Route>

    {/* Approved */}
    <Route element={<MainLayouts />}>
      <Route element={<ApprovedTrainerRoute />}>
        <Route path={TRAiNER_UI_ROUTES.TRAINER_DASHBOARD} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerDashboardPage />
          </Suspense>
        } />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_PROFILE} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerProfilePage />
          </Suspense>
        } />

        {/* Booking — two-mode flow */}
        <Route path={TRAiNER_UI_ROUTES.TRAINER_BOOKING_SETUP} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerBookingSetupPage />
          </Suspense>
        } />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerBookingManagementPage />
          </Suspense>
        } />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_NOTIFICATIONS} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerNotificationPage />
          </Suspense>
        } />
        <Route path={TRAiNER_UI_ROUTES.TRAINER_EARNINGS} element={
          <Suspense fallback={<PageLoader />}>
            <TrainerEarningsPage />
          </Suspense>
        } />
      </Route>
    </Route>

    {/* Chat - Dedicated Layout with Navbar/Sidebar, no Footer */}
    <Route element={<MessagesLayout />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_MESSAGES} element={
        <Suspense fallback={<PageLoader />}>
          <TrainerChatPage />
        </Suspense>
      } />
    </Route>

    {/* Video Call - Dedicated Full-Screen Layout */}
    <Route element={<VideoCallLayout />}>
      <Route path={TRAiNER_UI_ROUTES.TRAINER_VIDEO_CALL_SESSION} element={
        <Suspense fallback={<PageLoader />}>
          <VideoSessionPage />
        </Suspense>
      } />
    </Route>

    {/* Legacy redirect: /trainer/availability → /trainer/booking */}
    <Route
      path={TRAiNER_UI_ROUTES.TRAINER_AVAILABILITY}
      element={<Navigate to={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT} replace />}
    />
  </Route>
);