import {Model} from "mongoose";

export interface IUser {
    _id?: string;
    name: string;
    image: string;
    email: string;
    password: string;
    id?: string;
    isVerified: boolean;
    role: string;
    otp?: string;
}

export interface IUserModel extends Model<IUser>{
    isPasswordMac: (email: string,password: string) => boolean | { isError: boolean, status: number, message: string };
    findUserByEmail(email: string): IUser;
}