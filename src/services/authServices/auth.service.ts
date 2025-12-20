

import { userInstance } from "../../api/axiosInstance";
import type { ApiResponse } from "../../interface/apiResponseInterface";
import type { RegisterSuccessData, RegisterPayload, LoginPayload, LoginSuccessData, VerifyOtpPayload, ResendOtpResponse } from "../../interface/userInterface";

//SRP
class AuthService {

    async registerUser(data: RegisterPayload): Promise<ApiResponse<RegisterSuccessData>> {
        console.log('Register payload in auth.services frontend...', data)
        const response = await userInstance.post<ApiResponse<RegisterSuccessData>>("/auth/user-register", data);
        return response.data
    }


    async loginUser(data: LoginPayload)
        : Promise<ApiResponse<LoginSuccessData>> {
        console.log("Login Payload in service", data)
        const response = await userInstance.
            post<ApiResponse<LoginSuccessData>>("/auth/user-login", data);
        console.log("Response from Login.... backend", response.data);
        return response.data
    }

    async logoutUser(): Promise<void> {
        await userInstance.post("/auth/user-logout");
    }

    async verifyRegisterOtp(data: VerifyOtpPayload): Promise<ApiResponse<RegisterSuccessData>> {
        console.log("input otp from frontend service", data)
        const response = await userInstance.post<
            ApiResponse<RegisterSuccessData>
        >("/auth/user-otp-verify", data);

        console.log("Otp verify response form backend", response.data)

        return response.data;
    }


    async resendOtp(email: string): Promise<ApiResponse<ResendOtpResponse>> {
        const response = await userInstance.post<ApiResponse<ResendOtpResponse>>(
            "/auth/user-resend-otp",
            { email }
        );

        return response.data;
    }


}

export default new AuthService();

