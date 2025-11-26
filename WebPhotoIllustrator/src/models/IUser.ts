export interface IUser {
    email: string;
    isActivated: boolean;
    isBlocked: boolean;
    roles: string[];
    id: string;
}