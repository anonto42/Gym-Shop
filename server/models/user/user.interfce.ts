import {Model} from "mongoose";
import {USER_STATUS} from "@/enum/user.enum";

export interface IUser {
    _id?: string;
    name: string;
    image: string;
    email: string;
    password: string;
    status: USER_STATUS;
    id?: string;
    isVerified: boolean;
    role: string;
    otp?: string;
    hashToken?: string;
    contact?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IUserModel extends Model<IUser>{
    isPasswordMac: (email: string,password: string) => boolean | { isError: boolean, status: number, message: string };
    findUserByEmail(email: string): IUser;
    findUserByEmailAndUpdate: (email: string, updatedData: Partial<IUser>) => Promise<IUser | null>;
}