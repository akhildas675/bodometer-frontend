import { userInstance } from "../../api/axiosInstance";
import type { ApiResponse } from "../../Interface/apiResponseInterface";
import type { RegisterSuccessData, RegisterPayload } from "../../Interface/userInterface";

//SRP
class AuthService{
    async registerUser(data:RegisterPayload):Promise<ApiResponse<RegisterSuccessData>>{
        console.log('Register payload in auth.services frontend...',data)
        const response = await userInstance.post<ApiResponse<RegisterSuccessData>>("/auth/register",data);
        return response.data
    }
}

export default new AuthService();