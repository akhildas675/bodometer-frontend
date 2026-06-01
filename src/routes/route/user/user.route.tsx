import { Route } from "react-router-dom";
import MainLayouts from "@/components/layouts/MainLayouts";
import UserProfilePage from "@/pages/user/user-profile.page";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import SubscriptionRoute from "@/routes/guard.routes/subscription.route";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import UserTrainersPage from "@/pages/user/user-fitness/user-trainers.page";
import UserChangePasswordPage from "@/pages/user/user-auth/user.change-password.page";
import UserTrainerDetailPage from "@/pages/user/user-fitness/user.trainer-detail.page";
import { ROLES } from "@/constants/role";
import UserCategoriesPage from "@/pages/user/user-fitness/user-categories.page";
import UserCategoryDetailPage from "@/pages/user/user-fitness/user.category-detail.page";
import UserSubscriptionPage from "@/pages/user/user-subscription/user-subscription.page";
import UserSubscriptionSuccessPage from "@/pages/user/user-subscription/user.subscription-success.page";
import UserSubscriptionCancelPage from "@/pages/user/user-subscription/user.subscription-cancel.page";
import UserOnboardingIntroPage from "@/pages/user/user-fitness/user.onboarding-intro.page";
import UserOnboardingAssessmentPage from "@/pages/user/user-fitness/user.onboarding-assessment.page";
import UserFitnessProfilePage from "@/pages/user/user-fitness/user.fitness-profile.page";
import UserExercisesPage from "@/pages/user/user-fitness/user-exercises.page";
import UserExerciseDetailPage from "@/pages/user/user-fitness/user-exercise.detail.page";

import UserWorkoutPlansPage from "@/pages/user/user-fitness/user-workout-plans.page";
import UserWorkoutProgressionPage from "@/pages/user/user-fitness/user-workout-progression.page";

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
        path={USER_UI_ROUTES.USER_TRAINERS}
        element={<UserTrainersPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINER_DETAILS}
        element={<UserTrainerDetailPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_CATEGORIES}
        element={<UserCategoriesPage />}
      />
      <Route 
        path={USER_UI_ROUTES.USER_CATEGORY_DETAILS}
        element={<UserCategoryDetailPage />}
      />

      {/* Premium Routes inside Main Layout (Subscription Required) */}
      <Route element={<SubscriptionRoute />}>
        <Route path={USER_UI_ROUTES.USER_FITNESS_PROFILE} element={<UserFitnessProfilePage/>} />
        <Route path={USER_UI_ROUTES.USER_EXERCISES} element={<UserExercisesPage />} />
        <Route path={USER_UI_ROUTES.USER_EXERCISE_DETAIL} element={<UserExerciseDetailPage />} />
        <Route path={USER_UI_ROUTES.USER_WORKOUT_PLANS} element={<UserWorkoutPlansPage />} />
        <Route path={USER_UI_ROUTES.USER_PROGRESS} element={<UserWorkoutProgressionPage />} />
      </Route>
    </Route>

    {/*  No Sidebar Layout No Navbar */}
    <Route element={<SubscriptionRoute />}>
      <Route path={USER_UI_ROUTES.ONBOARDING_INTRO} element={<UserOnboardingIntroPage />} />
      <Route path={USER_UI_ROUTES.ONBOARDING_ASSESSMENT} element={<UserOnboardingAssessmentPage />} />
    </Route>
  </Route>
);

