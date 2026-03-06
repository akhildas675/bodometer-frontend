import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/role";
import { VERIFICATION_STATUS } from "@/constants/verification.status";

const ApprovedTrainerRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== ROLES.TRAINER) return <Navigate to="/" replace />;


  if (!user.verificationStatus) {
    return <Navigate to="//trainer/onboarding/workouts" replace />;
  }

  if (user.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
    return <Navigate to="/trainer/status" replace />;
  }

  
  return <Outlet />;
};

export default ApprovedTrainerRoute;