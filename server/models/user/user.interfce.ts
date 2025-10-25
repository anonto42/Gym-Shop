
export interface IUser {
    name: string;
    image: string;
    email: string;
    password: string;
    id?: string;
    isVerified: boolean;
    role: string;
}