import { adminApi } from "../../api/api.instance";
import type { AdminGetTrainersResponse, AdminGetUsersResponse } from "../../interface/admin.interface";
import type { ApiResponse } from "../../interface/api-response.interface";

class AdminService {
    async getUsers(): Promise<ApiResponse<AdminGetUsersResponse[]>> {
        const response = await adminApi.
            get<ApiResponse<AdminGetUsersResponse[]>>("/get-users");
        return response.data
    }

    async blockUser(userId: string): Promise<ApiResponse<null>> {
        console.log("frontend userid....", userId)
        const response = await adminApi.patch<ApiResponse<null>>(
            `/users/${userId}/block`
        );
        return response.data;
    }

    async unblockUser(userId: string): Promise<ApiResponse<null>> {
        console.log("frontend userid....", userId)
        const response = await adminApi.patch<ApiResponse<null>>(
            `/users/${userId}/unblock`
        );
        console.log(response.data)
        return response.data;
    }

    async getTrainers():Promise<ApiResponse<AdminGetTrainersResponse[]>>{
        const response = await adminApi.get<ApiResponse<AdminGetTrainersResponse[]>>("/get-trainers");
        return response.data
    }

    async blockTrainer(trainerId:string):Promise<ApiResponse<null>>{
        console.log("trainer id... frontend",trainerId)
        const response = await adminApi.patch<ApiResponse<null>>(
            `/trainer/${trainerId}/block`
        );
        console.log(response.data)
        return response.data
    }

    async unblockTrainer(trainerId:string):Promise<ApiResponse<null>>{
        console.log("trainer id...frontend",trainerId)
        const response = await adminApi.patch<ApiResponse<null>>(
            `trainer/${trainerId}/unblock`
        );
        console.log(response.data)
        return response.data
    }


}


export default new AdminService()