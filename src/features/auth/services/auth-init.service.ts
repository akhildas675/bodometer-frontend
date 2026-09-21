import { AUTH_API_ROUTES } from "@/features/auth/api/auth.api-routes";
import { authInstance } from "@/infrastructure/api/auth-client";
import { useAuthStore } from "@/stores/auth.store";

import type { ApiResponse } from "@/types/api.types";
import type { LoginResponseData } from "@/features/auth/types/auth.types";

class AuthInitService {

  async initializeAuth(): Promise<void> {
    const { setAuth, clearAuth, setInitialized } = useAuthStore.getState();

    try {
     
      const response = await authInstance.post<ApiResponse<LoginResponseData>
      >(AUTH_API_ROUTES.REFRESH_TOKEN);

      if (response.data.success && response.data.data) {
        const { accessToken, user, onboardingComplete, hasActiveSubscription, trainerStatus } = response.data.data;
        const userWithFlags = {
          ...user,
          onboardingComplete,
          hasActiveSubscription
        };
        setAuth({ accessToken, user: userWithFlags, trainerStatus });
      } else {
        clearAuth();
      }
    } catch (_error: unknown) {
      clearAuth();
    } finally {
      setInitialized(true);
    }
  }


  async logout(): Promise<ApiResponse<null>> {
    const response = await authInstance.post<ApiResponse<null>>(AUTH_API_ROUTES.LOGOUT);
    return response.data;
  }
}

export default new AuthInitService();
