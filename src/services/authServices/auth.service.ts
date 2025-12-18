

import { userInstance } from "../../api/axiosInstance";
import type { ApiResponse } from "../../interface/apiResponseInterface";
import type { RegisterSuccessData, RegisterPayload, LoginPayload, LoginSuccessData } from "../../interface/userInterface";

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

}

export default new AuthService();

