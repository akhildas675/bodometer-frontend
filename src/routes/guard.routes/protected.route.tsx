import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import type { Role } from "../../constants/role";

interface Props {
  allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  // Wait for auth to initialize
  if (!isInitialized) {
    return null; // AuthProvider handles loading state
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "trainer":
        return <Navigate to="/trainer/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;