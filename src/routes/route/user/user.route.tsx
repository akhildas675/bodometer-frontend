import { Route } from "react-router-dom";
import MainLayouts from "@/ui.components/layouts/MainLayouts";
import UserProfilePage from "@/features/user/user.users/pages/user-profile.page";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import SubscriptionRoute from "@/routes/guard.routes/subscription.route";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import UserChangePasswordPage from "@/features/user/user.users/pages/user.change-password.page";
import UserTrainerDetailPage from "@/features/user/user.trainers/pages/user.trainer-detail.page";
import { ROLES } from "@/constants/role";
import UserCategoryDetailPage from "@/features/user/user.category/pages/user.category-detail.page";
import UserSubscriptionPage from "@/features/user/user.subscription/pages/user-subscription.page";
import UserSubscriptionSuccessPage from "@/features/user/user.subscription/pages/user.subscription-success.page";
import UserSubscriptionCancelPage from "@/features/user/user.subscription/pages/user.subscription-cancel.page";
import UserOnboardingIntroPage from "@/features/user/user.onboarding/pages/user.onboarding-intro.page";
import UserOnboardingAssessmentPage from "@/features/user/user.onboarding/pages/user.onboarding-assessment.page";
import UserFitnessProfilePage from "@/features/user/user.users/pages/user.fitness-profile.page";
import UserExercisesPage from "@/features/user/user.exercise/pages/user-exercises.page";
import UserExerciseDetailPage from "@/features/user/user.exercise/pages/user-exercise.detail.page";

import UserWorkoutPlansPage from "@/features/user/workout-plan/pages/user-workout-plans.page";
import UserWorkoutProgressionPage from "@/features/user/workout-plan/pages/user-workout-progression.page";
import { UserDietPlansPage } from "@/features/user/user.diet-plan/pages/user-diet-plans.page";
import UserHealthLogPage from "@/features/user/user.health-log/pages/user-health-log.page";
import UserHealthProgressionPage from "@/features/user/user.health-log/pages/user-health-progression.page";
import UserBookTrainerPage from "@/features/user/user.trainers/pages/user.book-trainer.page";
import UserMyBookingsPage from "@/features/user/user.trainers/pages/user.my-bookings.page";
import UserWalletPage from "@/features/user/user.wallet/pages/user.wallet.page";
import { BookingSuccessPage } from "@/features/client/booking/components/booking-success.page";
import UserNotificationPage from "@/features/user/user.notification/pages/user-notification.page";

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
      <Route
        path={USER_UI_ROUTES.USER_BOOK_TRAINER}
        element={<UserBookTrainerPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_MY_BOOKINGS}
        element={<UserMyBookingsPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_WALLET}
        element={<UserWalletPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_NOTIFICATIONS}
        element={<UserNotificationPage />}
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
        <Route path={USER_UI_ROUTES.USER_FITNESS_PROFILE} element={<UserFitnessProfilePage/>} />
        <Route path={USER_UI_ROUTES.USER_EXERCISES} element={<UserExercisesPage />} />
        <Route path={USER_UI_ROUTES.USER_EXERCISE_DETAIL} element={<UserExerciseDetailPage />} />
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
