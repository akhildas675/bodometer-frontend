import { AUTH_API_ROUTES } from "@/features/auth/api/auth.api-routes";
import { authInstance } from "@/infrastructure/api/auth-client";
import { useAuthStore } from "@/stores/auth.store";

import type { ApiResponse } from "@/types/api.types";
import type { LoginResponseData } from "@/features/auth/types/auth.types";

class AuthInitService {
  private initPromise: Promise<void> | null = null;

  async initializeAuth(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    const { isInitialized } = useAuthStore.getState();
    if (isInitialized) {
      return;
    }

    this.initPromise = (async () => {
      const { setAuth, clearAuth, setInitialized } = useAuthStore.getState();

      try {
        const response = await authInstance.post<ApiResponse<LoginResponseData>>(
          AUTH_API_ROUTES.REFRESH_TOKEN
        );

        if (response.data.success && response.data.data) {
          const { accessToken, user, onboardingComplete, hasActiveSubscription, trainerStatus } =
            response.data.data;
          const userWithFlags = {
            ...user,
            onboardingComplete,
            hasActiveSubscription,
          };
          setAuth({ accessToken, user: userWithFlags, trainerStatus });
        } else {
          clearAuth();
        }
      } catch (_error: unknown) {
        clearAuth();
      } finally {
        setInitialized(true);
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }


  async logout(): Promise<ApiResponse<null>> {
    const response = await authInstance.post<ApiResponse<null>>(AUTH_API_ROUTES.LOGOUT);
    return response.data;
  }
}

export default new AuthInitService();
