import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import type { Role } from "../../constants/role";

interface Props {
  allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
