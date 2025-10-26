import { model, Schema } from "mongoose";
import {IUser, IUserModel} from "@/server/models/user/user.interfce";
import {USER_ROLE, USER_STATUS} from "@/enum/user.enum";
import {IResponse} from "@/server/interface/response.interface";

const userSchema = new Schema<IUser, IUserModel>(
    {
        name: { type: String, required: true },
        image: { type: String, default: '' },
        email: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER },
        otp: { type: String },
    }, {
        timestamps: true,
        versionKey: false
    }
);

userSchema.statics.isPasswordMac = async (email: string, password: string): Promise<boolean | IResponse> => {
    const user = await UserModel.findOne({ email }).lean().exec();
    if (!user) return { isError: true, status: 404, message: "Invalid email or password" };

    return user.password === password;
}

userSchema.statics.findUserByEmail = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({ email }).lean().exec();
}

userSchema.statics.findUserByEmailAndUpdate = async (email: string, updatedData: Partial<IUser>): Promise<IUser | null> => {
    return await UserModel.findOneAndUpdate({ email },{ $set: updatedData },{ new: true }).lean().exec();
}

export const UserModel = model<IUser,IUserModel>("User", userSchema);