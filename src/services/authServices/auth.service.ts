import { userInstance } from "../../api/axiosInstance";
import type { RegisterSuccessData, RegisterPayload } from "../../Interface/userInterface";

export interface ApiResponse<T = unknown>{
    success:boolean;
    message:string;
    data?:T;
    error?:string;
}

//SRP
class AuthService{
    async registerUser(data:RegisterPayload):Promise<ApiResponse>{
        const response = await userInstance.post<ApiResponse<RegisterSuccessData>>("/auth/register",data);
        return response.data
    }
}

export default new AuthService();