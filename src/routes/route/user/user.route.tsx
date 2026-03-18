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

export const userRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
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
        path={USER_UI_ROUTES.USER_SUBSCRIPTION_SUCCESS}
        element={<UserSubscriptionSuccessPage />}
      />
      <Route
        path={USER_UI_ROUTES.USER_TRAINERS}
        element={<UserTrainersPage/>}
      />
      <Route
        path={USER_UI_ROUTES.USER_CHANGE_PASSWORD}
        element={<UserChangePasswordPage/>}
      />
    </Route>
  </Route>
);
