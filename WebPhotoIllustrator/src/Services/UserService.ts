import $api from "../http";
import { AxiosResponse } from 'axios';
import {IPassResponse} from "../models/response/PasswordResponse";
import {IUser} from "../models/IUser";


export default class UserService {
    static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/admin/users');
    }

    static async requestReset(email:string): Promise<AxiosResponse<IPassResponse>> {
        return $api.post('/password/forgot',{email});
    }

    static async resetPassword(token:string,newPassword:string): Promise<AxiosResponse<{message:string}>> {
        return $api.post('/password/reset',{token,newPassword});
    }
    static async blockUser(userId: string): Promise<{ data: IUser }> {
        return $api.post<IUser>('/admin/user/block', { userId });
    }

    static async unblockUser(userId: string): Promise<{ data: IUser }> {
        return $api.post<IUser>('/admin/user/unblock', { userId });
    }
    
    static async deleteUser(userId: string): Promise<any> {
        return $api.delete(`/admin/user/${userId}`);
    }
    
}