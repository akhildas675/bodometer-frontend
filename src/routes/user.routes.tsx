import { Route, lazy, Suspense } from "react-router-dom";

import MainLayouts from "@/components/layout/MainLayouts";
import MessagesLayout from "@/components/layout/MessagesLayout";
import VideoCallLayout from "@/components/layout/VideoCallLayout";

import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import SubscriptionRoute from "@/routes/guards/SubscriptionRoute";

import { ROLES } from "@/constants/roles.constants";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";

// Lazy load all user pages
const UserProfilePage = lazy(() => import("@/features/user/pages/UserProfilePage"));
const UserChangePasswordPage = lazy(() => import("@/features/user/pages/UserChangePasswordPage"));
const UserTrainerDetailPage = lazy(() => import("@/features/user/pages/UserTrainerDetailPage"));
const UserWalletPage = lazy(() => import("@/features/user/pages/UserWalletPage"));
const UserNotificationPage = lazy(() => import("@/features/notification/pages/UserNotificationPage"));

const UserSubscriptionPage = lazy(() => import("@/features/subscription/pages/UserSubscriptionPage"));
const UserSubscriptionSuccessPage = lazy(() => import("@/features/subscription/pages/UserSubscriptionSuccessPage"));
const UserSubscriptionCancelPage = lazy(() => import("@/features/subscription/pages/UserSubscriptionCancelPage"));

const UserCategoryDetailPage = lazy(() => import("@/features/workout/pages/UserCategoryDetailPage"));
const UserExercisesPage = lazy(() => import("@/features/workout/pages/UserExercisesPage"));
const UserExerciseDetailPage = lazy(() => import("@/features/workout/pages/UserExerciseDetailPage"));
const UserWorkoutPlansPage = lazy(() => import("@/features/workout/pages/UserWorkoutPlansPage"));
const UserWorkoutProgressionPage = lazy(() => import("@/features/workout/pages/UserWorkoutProgressionPage"));

const { UserDietPlansPage } = lazy(() => import("@/features/diet/pages/UserDietPlansPage"));

const UserFitnessProfilePage = lazy(() => import("@/features/onboarding/pages/UserFitnessProfilePage"));
const UserOnboardingIntroPage = lazy(() => import("@/features/onboarding/pages/UserOnboardingIntroPage"));
const UserOnboardingAssessmentPage = lazy(() => import("@/features/onboarding/pages/UserOnboardingAssessmentPage"));

const UserHealthLogPage = lazy(() => import("@/features/health/pages/UserHealthLogPage"));
const UserHealthProgressionPage = lazy(() => import("@/features/health/pages/UserHealthProgressionPage"));

const UserBookTrainerPage = lazy(() => import("@/features/booking/pages/BookTrainerPage"));
const UserMyBookingsPage = lazy(() => import("@/features/booking/pages/MyBookingsPage"));
const { BookingSuccessPage } = lazy(() => import("@/features/booking/pages/BookingSuccessPage"));

const VideoSessionPage = lazy(() => import("@/features/video-session/pages/VideoSessionPage"));
const UserChatPage = lazy(() => import("@/features/chat/pages/UserChatPage"));

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);


export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
    <Route element={<MainLayouts />}>

      <Route
        path={USER_UI_ROUTES.USER_PROFILE}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_CHANGE_PASSWORD}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserChangePasswordPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_SUBSCRIPTIONS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserSubscriptionPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_SUBSCRIPTIONS_SUCCESS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserSubscriptionSuccessPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_SUBSCRIPTIONS_CANCEL}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserSubscriptionCancelPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_TRAINER_DETAILS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserTrainerDetailPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_EXERCISES}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserExercisesPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_EXERCISE_DETAIL}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserExerciseDetailPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_WALLET}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserWalletPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_NOTIFICATIONS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserNotificationPage />
          </Suspense>
        }
      />

      <Route
        path="/client/booking/success"
        element={
          <Suspense fallback={<PageLoader />}>
            <BookingSuccessPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.USER_CATEGORY_DETAILS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserCategoryDetailPage />
          </Suspense>
        }
      />

      {/* Free workout plans */}
      <Route
        path={USER_UI_ROUTES.USER_WORKOUT_PLANS}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserWorkoutPlansPage />
          </Suspense>
        }
      />

      <Route element={<SubscriptionRoute />}>
        <Route
          path={USER_UI_ROUTES.USER_BOOK_TRAINER}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserBookTrainerPage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_MY_BOOKINGS}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserMyBookingsPage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_FITNESS_PROFILE}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserFitnessProfilePage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_PROGRESS}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserWorkoutProgressionPage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_DIET_PLANS}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserDietPlansPage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_HEALTH_LOG}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserHealthLogPage />
            </Suspense>
          }
        />

        <Route
          path={USER_UI_ROUTES.USER_HEALTH_PROGRESS}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserHealthProgressionPage />
            </Suspense>
          }
        />
      </Route>
    </Route>

    {/* Messages - Dedicated Layout with Navbar/Sidebar, no Footer */}
    <Route element={<SubscriptionRoute />}>
      <Route element={<MessagesLayout />}>
        <Route
          path={USER_UI_ROUTES.USER_MESSAGES}
          element={
            <Suspense fallback={<PageLoader />}>
              <UserChatPage />
            </Suspense>
          }
        />
      </Route>
    </Route>

    <Route element={<VideoCallLayout />}>
      <Route
        path={USER_UI_ROUTES.VIDEO_CALL_SESSION}
        element={
          <Suspense fallback={<PageLoader />}>
            <VideoSessionPage />
          </Suspense>
        }
      />
    </Route>

    <Route element={<SubscriptionRoute />}>
      <Route
        path={USER_UI_ROUTES.ONBOARDING_INTRO}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserOnboardingIntroPage />
          </Suspense>
        }
      />

      <Route
        path={USER_UI_ROUTES.ONBOARDING_ASSESSMENT}
        element={
          <Suspense fallback={<PageLoader />}>
            <UserOnboardingAssessmentPage />
          </Suspense>
        }
      />
    </Route>
  </Route>
);