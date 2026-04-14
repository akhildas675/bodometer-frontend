import { Route } from "react-router-dom";
import MainLayouts from "@/components/layouts/MainLayouts";
import UserProfilePage from "@/pages/user/user-profile.page";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import UserWorkoutsPage from "@/pages/user/user-workouts.page";
import UserWorkoutDetailPage from "@/pages/user/user.workout-detail.page";
import UserSubscriptionPage from "@/pages/user/user-subscription.page";
import UserSubscriptionSuccessPage from "@/pages/user/user.subscription-success.page";
import UserTrainersPage from "@/pages/user/user-trainers.page";
import UserChangePasswordPage from "@/pages/user/user.change-password.page";
import UserTrainerDetailPage from "@/pages/user/user.trainer-detail.page";
import MainLayoutsNoSidebar from "@/components/layouts/user.layouts.ts/MainLayoutsNoSidebar";
import { ROLES } from "@/constants/role";
import UserWorkoutPreferenceTimePage from "@/pages/user/user-workout.preference-time.page";
import UserFitnessGoalPage from "@/pages/user/user.fitness-goal.page";
import UserWorkoutSelectPage from "@/pages/user/user.workout-select.page";
import UserHealthDetailPage from "@/pages/user/user-health.detail.page";
import UserWorkoutHistoryPage from "@/pages/user/user.workout-history.page";
import UserDailyHabitsPage from "@/pages/user/user.daily-habits.page";
import UserOnboardingIntroPage from "@/pages/user/user.onboarding-intro.page";
import UserOnboardingCompletionPage from "@/pages/user/user.onboarding-completion.page";
import UserBmiPage from "@/pages/user/user-bmi.page";

export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
    <Route element={<MainLayouts />}>
      <Route path={USER_UI_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
      <Route
        path={USER_UI_ROUTES.USER_WORKOUTS}
        element={<UserWorkoutsPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_WORKOUT_DETAIL}
        element={<UserWorkoutDetailPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_SUBSCRIPTION}
        element={<UserSubscriptionPage />}
      />

      <Route
        path={USER_UI_ROUTES.USER_CHANGE_PASSWORD}
        element={<UserChangePasswordPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINERS}
        element={<UserTrainersPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINER_DETAILS}
        element={<UserTrainerDetailPage />}
      />
    </Route>




    {/* No Sidebar pages */}
    <Route element={<MainLayoutsNoSidebar />}>
      <Route
        path={USER_UI_ROUTES.USER_SUBSCRIPTION_SUCCESS}
        element={<UserSubscriptionSuccessPage />}
      />


    </Route>
{/* premium users */}
    <Route>
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_BMI}
        element={<UserBmiPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_INTRO}
        element={<UserOnboardingIntroPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_WORKOUT_PREFERENCE_TIME}
        element={<UserWorkoutPreferenceTimePage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_FITNESS_GOALS}
        element={<UserFitnessGoalPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_WORKOUTS}
        element={<UserWorkoutSelectPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_HEALTH_DETAILS}
        element={<UserHealthDetailPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_WORKOUT_HISTORY}
        element={<UserWorkoutHistoryPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_DAILY_HABITS}
        element={<UserDailyHabitsPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_ONBOARDING_COMPLETION}
        element={<UserOnboardingCompletionPage/>}
      />

    </Route>




  </Route>
);
