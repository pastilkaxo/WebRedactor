import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../Services/AuthService";
import UserService from "../Services/UserService";
import axios from "axios";
import {IAuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import {IPassResponse} from "../models/response/PasswordResponse";
import { AxiosResponse } from 'axios';

export default  class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    constructor() {
        makeAutoObservable(this);
    }
    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    async requestPasswordReset(email:string) : Promise<{ data?: IPassResponse; error?: string }> {
        try{
            const response = await UserService.requestReset(email);
            console.log(response);
            localStorage.setItem('passwordToken', response.data.passwordToken);
            return {data:response.data};
        }
        catch (err:any){
            return {error:err.response?.data?.message || "Unknown error"};
        }
    }

    async resetPassword(token:string,newPassword:string) : Promise<{message?:string; error?:string}> {
        try{
            const response = await UserService.resetPassword(token,newPassword);
            console.log(response);
            localStorage.removeItem('passwordToken');
            return {message:response.data.message}
        }
        catch (err:any){
            return {error:err.response?.data?.message || "Unknown error"};
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

        }
        catch(err:any){
            console.log(err.response?.data?.message);
        }
    }

    async register(email: string, password: string) {
        try{
            const response = await AuthService.register(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch(err:any){
            console.log(err.response?.data?.message);
        }
    }

    async logout() {
        try{
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem("token");
            this.setAuth(false);
            this.setUser({} as IUser);
        }
        catch(err:any){
            console.log(err.response?.data?.message);
        }
    }

    async checkAuth(){
        this.setIsLoading(true);
        try{
            const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`,{withCredentials:true});
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch(err:any){
            console.log(err.response?.data?.message);
        }
        finally {
            this.setIsLoading(false);
        }
    }

    async checkIsResseting(){
        this.setIsLoading(true);
        try{}
        catch(err:any){}
        finally {
            this.setIsLoading(false);
        }
    }




}