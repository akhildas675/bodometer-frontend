import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

const PublicGuard = () => {
  const { isAuthenticated, user } = useAuthStore();

 
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "trainer") {
      return <Navigate to="/trainer" replace />;
    }
  }

  return <Outlet />;
};

export default PublicGuard;
