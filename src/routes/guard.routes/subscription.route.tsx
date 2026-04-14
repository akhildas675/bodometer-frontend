import { Navigate, Outlet } from "react-router-dom";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { useAuthStore } from "@/stores/auth.store";
import { SUBSCRIPTION_STATUS } from "@/constants/subscription.constant";

const SubscriptionRoute = () => {
  const { user } = useAuthStore();


  const isPremium = user?.subscription.status==SUBSCRIPTION_STATUS.ACTIVE

  if (!isPremium) {
    return <Navigate to={USER_UI_ROUTES.USER_SUBSCRIPTION} replace />;
  }

  return <Outlet />;
};

export default SubscriptionRoute;