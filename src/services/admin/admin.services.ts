import { adminApi } from "../../api/api.instance";
import type { AdminGetUsersResponse } from "../../interface/admin.interface";
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
        return response.data;
    }
}


export default new AdminService()