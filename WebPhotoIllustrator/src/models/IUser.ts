export interface IUser {
    email: string;
    firstName?: string;
    lastName?: string;
    isActivated: boolean;
    isBlocked: boolean;
    roles: string[];
    projects: string[];
    favorites: string[];
    id: string;
}