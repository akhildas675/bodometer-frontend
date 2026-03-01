import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import type { Role } from "@/constants/role";

interface Props {
  allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

 
  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "trainer":
        return <Navigate to="/trainer" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;