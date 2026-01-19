import { authInstance } from "../../api/auth.instance";
import type { ApiResponse } from "../../interface/api-response.interface";
import type { LoginResponseData, LoginPayload, RegisterPayload, RegisterResponse, ForgotPasswordPayload, ForgotPasswordResponse, ResetPasswordPayload, ResetPasswordResponse, GoogleLoginPayload, GoogleLoginResponse } from "../../interface/auth.interface";
import { type Role } from "../../constants/role";
import type { OtpResendPayload, OtpVerifyPayload, OtpVerifyResponse } from "../../interface/otp.interface";
import { useAuthStore } from "../../stores/auth.store";

//SRP
class AuthService {

    async register(role: Exclude<Role, "admin">, data: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
        const response = await authInstance.post<ApiResponse<RegisterResponse>>("/register", { ...data, role, });
        return response.data
    }

    async verifyOtp(data: OtpVerifyPayload): Promise<ApiResponse<OtpVerifyResponse>> {
        const response = await authInstance.post<ApiResponse<OtpVerifyResponse>>("/otp-verify", { ...data, });
        return response.data
    }

    async resendOtp(data: OtpResendPayload): Promise<ApiResponse<OtpVerifyResponse>> {
        const response = await authInstance.post<ApiResponse<OtpVerifyResponse>>("/otp-resend", { ...data, });
        return response.data
    }

    async login(data: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
        const response = await authInstance.post<ApiResponse<LoginResponseData>>("/login", data);
        if (response.data.success && response.data.data) {
            const { accessToken, user } = response.data.data;
            useAuthStore.getState().setAuth({ accessToken, user });
        }

        return response.data;
    }

    async completeRegister(data: RegisterPayload & { role: Role }): Promise<ApiResponse<RegisterResponse>> {
        const response = await authInstance.post<ApiResponse<RegisterResponse>>("register/complete", data);
        return response.data
    }

    async forgotPassword(data: ForgotPasswordPayload) {
        const response = await authInstance.post<ApiResponse<ForgotPasswordResponse>>("/forgot-password", data);
        return response.data;
    }

    async resetPassword(data: ResetPasswordPayload) {
        const response = await authInstance.post<ApiResponse<ResetPasswordResponse>>("/reset-password", data);
        return response.data;
    }

    async googleLogin(data: GoogleLoginPayload) {
        const response = await authInstance.post<ApiResponse<GoogleLoginResponse>>("/google-login", data)
        if (response.data.success && response.data.data) {
            const { accessToken, user } = response.data.data;
            useAuthStore.getState().setAuth({ accessToken, user });
        }
        return response.data;
    }
}

export default new AuthService();