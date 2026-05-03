import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { ScreenLoader } from "@/components/ui/screen-loader";

const GuestRoute = () => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();


  if (!isInitialized) {
    return <ScreenLoader />; 
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case "trainer":
        return <Navigate to="/trainer" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      case "user":
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default GuestRoute;