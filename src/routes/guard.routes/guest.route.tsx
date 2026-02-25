import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

const GuestRoute = () => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();


  if (!isInitialized) {
    return null; 
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case "trainer":
        return <Navigate to="/trainer/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "user":
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default GuestRoute;