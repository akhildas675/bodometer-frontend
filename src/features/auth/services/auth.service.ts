import { authInstance } from "@/infrastructure/api/auth-client";
import { useAuthStore } from "@/stores/auth.store";

import type { ApiResponse } from "@/types/api.types";
import type {
    LoginResponseData,
    LoginPayload,
    RegisterPayload,
    RegisterResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    GoogleLoginPayload,
    GoogleLoginResponse,
} from "@/features/auth/types/auth.types";

import type {
    OtpResendPayload,
    OtpVerifyPayload,
    OtpVerifyResponse,
} from "@/features/auth/types/otp.types";

import type { Role } from "@/constants/roles.constants";

import { AUTH_API_ROUTES } from "@/features/auth/api/auth.api-routes";
//SRP
class AuthService {

    async register(role: Exclude<Role, "admin">, data: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
        const response = await authInstance.post<ApiResponse<RegisterResponse>>(AUTH_API_ROUTES.REGISTER, { ...data, role, });
        return response.data
    }

    async verifyOtp(data: OtpVerifyPayload): Promise<ApiResponse<OtpVerifyResponse>> {
        const response = await authInstance.post<ApiResponse<OtpVerifyResponse>>(AUTH_API_ROUTES.OTP_VERIFY, { ...data, });
        return response.data
    }

    async resendOtp(data: OtpResendPayload): Promise<ApiResponse<OtpVerifyResponse>> {
        const response = await authInstance.post<ApiResponse<OtpVerifyResponse>>(AUTH_API_ROUTES.OTP_RESEND, { ...data, });
        return response.data
    }

    async login(data: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
        const response = await authInstance.post<ApiResponse<LoginResponseData>>(AUTH_API_ROUTES.LOGIN, data);
        if (response.data.success && response.data.data) {
            const { accessToken, user } = response.data.data;
            useAuthStore.getState().setAuth({ accessToken, user });
        }


        return response.data;
    }

    async completeRegister(data: RegisterPayload & { role: Role }): Promise<ApiResponse<RegisterResponse>> {
        const response = await authInstance.post<ApiResponse<RegisterResponse>>(AUTH_API_ROUTES.COMPLETE_REGISTER, data);
        return response.data
    }

    async forgotPassword(data: ForgotPasswordPayload) {
        const response = await authInstance.post<ApiResponse<ForgotPasswordResponse>>(AUTH_API_ROUTES.FORGET_PASSWORD, data);
        return response.data;
    }

    async resetPassword(data: ResetPasswordPayload) {
        const response = await authInstance.post<ApiResponse<ResetPasswordResponse>>(AUTH_API_ROUTES.RESET_PASSWORD, data);
        return response.data;
    }

    async googleLogin(data: GoogleLoginPayload) {
        const response = await authInstance.post<ApiResponse<GoogleLoginResponse>>(AUTH_API_ROUTES.GOOGLE_LOGIN, data)
        if (response.data.success && response.data.data) {
            const { accessToken, user } = response.data.data;
            useAuthStore.getState().setAuth({ accessToken, user });
        }
        return response.data;
    }
}

export const authService = new AuthService();
