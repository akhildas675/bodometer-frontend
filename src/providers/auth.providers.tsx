import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import authInitService from "@/modules/auth/service/auth-init.service";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    const initAuth = async () => {
      await authInitService.initializeAuth();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Show loading screen while checking auth
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
