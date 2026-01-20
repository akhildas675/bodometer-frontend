import { authInstance } from "../../api/auth.instance";
import { useAuthStore } from "../../stores/auth.store";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { LoginResponseData } from "../../interface/auth.interface";

class AuthInitService {

  async initializeAuth(): Promise<void> {
    const { setAuth, clearAuth, setInitialized } = useAuthStore.getState();

    try {
     
      const response = await authInstance.post<ApiResponse<LoginResponseData>
      >("/refresh-token");

      if (response.data.success && response.data.data) {
        const { accessToken, user } = response.data.data;
        setAuth({ accessToken, user });
      } else {
        clearAuth();
      }
    } catch  {
     
      console.log("No active session found");
      clearAuth();
    } finally {
      setInitialized(true);
    }
  }


  async logout(): Promise<void> {
    const { clearAuth } = useAuthStore.getState();

    try {

      await authInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  }
}

export default new AuthInitService();