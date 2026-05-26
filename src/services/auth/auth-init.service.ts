import { authInstance } from "@/api/auth.instance";
import { useAuthStore } from "@/stores/auth.store";

import type { ApiResponse } from "@/interface/api-response.interface";
import type { LoginResponseData } from "@/interface/auth.interface";

class AuthInitService {

  async initializeAuth(): Promise<void> {
    const { setAuth, clearAuth, setInitialized } = useAuthStore.getState();

    try {
     
      const response = await authInstance.post<ApiResponse<LoginResponseData>
      >("/refresh-token");

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
    } catch (error: unknown) {
      clearAuth();
    } finally {
      setInitialized(true);
    }
  }


  async logout(): Promise<ApiResponse<null>> {
    const response = await authInstance.post<ApiResponse<null>>("/logout");
    return response.data;
  }
}

export default new AuthInitService();