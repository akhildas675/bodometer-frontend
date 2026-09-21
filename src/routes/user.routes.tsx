import { Route } from "react-router-dom";
import MainLayouts from "@/components/layout/MainLayout";
import UserProfilePage from "@/features/user/pages/UserProfilePage";
import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import SubscriptionRoute from "@/routes/guards/SubscriptionRoute";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import UserChangePasswordPage from "@/features/user/pages/UserChangePasswordPage";
import UserTrainerDetailPage from "@/features/user/pages/UserTrainerDetailPage";
import { ROLES } from "@/constants/roles.constants";
import UserCategoryDetailPage from "@/features/workout/pages/UserCategoryDetailPage";
import UserSubscriptionPage from "@/features/subscription/pages/UserSubscriptionPage";
import UserSubscriptionSuccessPage from "@/features/subscription/pages/UserSubscriptionSuccessPage";
import UserSubscriptionCancelPage from "@/features/subscription/pages/UserSubscriptionCancelPage";
import UserOnboardingIntroPage from "@/features/onboarding/pages/UserOnboardingIntroPage";
import UserOnboardingAssessmentPage from "@/features/onboarding/pages/UserOnboardingAssessmentPage";
import UserFitnessProfilePage from "@/features/onboarding/pages/UserFitnessProfilePage";
import UserExercisesPage from "@/features/workout/pages/UserExercisesPage";
import UserExerciseDetailPage from "@/features/workout/pages/UserExerciseDetailPage";

import UserWorkoutPlansPage from "@/features/workout/pages/UserWorkoutPlansPage";
import UserWorkoutProgressionPage from "@/features/workout/pages/UserWorkoutProgressionPage";
import { UserDietPlansPage } from "@/features/diet/pages/UserDietPlansPage";
import UserHealthLogPage from "@/features/health/pages/UserHealthLogPage";
import UserHealthProgressionPage from "@/features/health/pages/UserHealthProgressionPage";
import UserBookTrainerPage from "@/features/booking/pages/BookTrainerPage";
import UserMyBookingsPage from "@/features/booking/pages/MyBookingsPage";
import UserWalletPage from "@/features/user/pages/UserWalletPage";
import { BookingSuccessPage } from "@/features/booking/pages/BookingSuccessPage";
import UserNotificationPage from "@/features/notification/pages/UserNotificationPage";
import VideoSessionPage from "@/features/video-session/pages/VideoSessionPage";


export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
    <Route element={<MainLayouts />}>
      {/* Non-premium user profile pages */}
      <Route path={USER_UI_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
      <Route
        path={USER_UI_ROUTES.USER_CHANGE_PASSWORD}
        element={<UserChangePasswordPage />}
      />

      {/* accessible to non-subscribed users) */}
      <Route 
        path={USER_UI_ROUTES.USER_SUBSCRIPTIONS}
        element={<UserSubscriptionPage />}
      />
      <Route path={USER_UI_ROUTES.USER_SUBSCRIPTIONS_SUCCESS} element={<UserSubscriptionSuccessPage/>}/>
      <Route path={USER_UI_ROUTES.USER_SUBSCRIPTIONS_CANCEL} element={<UserSubscriptionCancelPage/>}/>

      {/* Accessible to all logged-in users */}
      <Route
        path={USER_UI_ROUTES.USER_TRAINER_DETAILS}
        element={<UserTrainerDetailPage />}
      />
        <Route path={USER_UI_ROUTES.USER_EXERCISES} element={<UserExercisesPage />} />
        <Route path={USER_UI_ROUTES.USER_EXERCISE_DETAIL} element={<UserExerciseDetailPage />} />
      <Route
        path={USER_UI_ROUTES.USER_WALLET}
        element={<UserWalletPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_NOTIFICATIONS}
        element={<UserNotificationPage />}
      />
      <Route
        path={USER_UI_ROUTES.VIDEO_CALL_SESSION}
        element={<VideoSessionPage />}
      />
      <Route
        path="/client/booking/success"
        element={<BookingSuccessPage />}
      />
      <Route 
        path={USER_UI_ROUTES.USER_CATEGORY_DETAILS}
        element={<UserCategoryDetailPage />}
      />
      
      {/* Free workout plans accessible without subscription */}
      <Route path={USER_UI_ROUTES.USER_WORKOUT_PLANS} element={<UserWorkoutPlansPage />} />

      {/* Premium Routes inside Main Layout (Subscription Required) */}
      <Route element={<SubscriptionRoute />}>
        <Route
          path={USER_UI_ROUTES.USER_BOOK_TRAINER}
          element={<UserBookTrainerPage />}
        />
        <Route
          path={USER_UI_ROUTES.USER_MY_BOOKINGS}
          element={<UserMyBookingsPage />}
        />
        <Route path={USER_UI_ROUTES.USER_FITNESS_PROFILE} element={<UserFitnessProfilePage/>} />
        <Route path={USER_UI_ROUTES.USER_PROGRESS} element={<UserWorkoutProgressionPage />} />
        <Route path={USER_UI_ROUTES.USER_DIET_PLANS} element={<UserDietPlansPage />} />
        <Route path={USER_UI_ROUTES.USER_HEALTH_LOG} element={<UserHealthLogPage />} />
        <Route path={USER_UI_ROUTES.USER_HEALTH_PROGRESS} element={<UserHealthProgressionPage />} />
      </Route>
    </Route>

    {/*  No Sidebar Layout No Navbar */}
    <Route element={<SubscriptionRoute />}>
      <Route path={USER_UI_ROUTES.ONBOARDING_INTRO} element={<UserOnboardingIntroPage />} />
      <Route path={USER_UI_ROUTES.ONBOARDING_ASSESSMENT} element={<UserOnboardingAssessmentPage />} />
    </Route>
  </Route>
);
