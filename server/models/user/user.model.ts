import { model, models, Schema } from "mongoose";
import { USER_ROLE, USER_STATUS } from "@/enum/user.enum";
import { IResponse } from "@/server/interface/response.interface";
import {IUser, IUserModel} from "@/server/models/user/user.interfce";

const userSchema = new Schema<IUser, IUserModel>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.ACTIVE,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLE),
            default: USER_ROLE.USER,
        },
        hashToken: {
            type: String,
        },
        otp: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.statics.isPasswordMatch = async function (
    email: string,
    password: string
): Promise<boolean | IResponse> {
    const user = await this.findOne({ email }).lean().exec();
    if (!user)
        return {
            isError: true,
            status: 404,
            message: "Invalid email or password",
        };

    return user.password === password;
};

userSchema.statics.findUserByEmail = async function (
    email: string
): Promise<IUser | null> {
    return await this.findOne({ email }).lean().exec();
};

userSchema.statics.findUserByEmailAndUpdate = async function (
    email: string,
    updatedData: Partial<IUser>
): Promise<IUser | null> {
    return await this.findOneAndUpdate(
        { email },
        { $set: updatedData },
        { new: true }
    )
        .lean()
        .exec();
};

let UserModel: IUserModel;

if (typeof models !== 'undefined' && models.User) {
    UserModel = models.User as unknown as IUserModel;
} else {
    UserModel = model<IUser, IUserModel>("User", userSchema);
}

export { UserModel };