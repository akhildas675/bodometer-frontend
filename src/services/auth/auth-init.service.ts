import { authInstance } from "../../api/auth.instance";
import { useAuthStore } from "../../stores/auth.store";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { LoginResponseData } from "../../interface/auth.interface";

class AuthInitService {
  /**
   * Initialize auth state from refresh token cookie
   * Called on app startup
   */
  async initializeAuth(): Promise<void> {
    const { setAuth, clearAuth, setInitialized } = useAuthStore.getState();

    try {
      // Try to refresh access token using the HTTP-only refresh token cookie
      const response = await authInstance.post<ApiResponse<LoginResponseData>
      >("/refresh-token");

      if (response.data.success && response.data.data) {
        const { accessToken, user } = response.data.data;
        setAuth({ accessToken, user });
      } else {
        clearAuth();
      }
    } catch  {
      // No valid refresh token or it expired
      console.log("No active session found");
      clearAuth();
    } finally {
      setInitialized(true);
    }
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    const { clearAuth } = useAuthStore.getState();

    try {
      // Call backend to clear refresh token cookie
      await authInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  }
}

export default new AuthInitService();