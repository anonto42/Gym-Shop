import { model, Schema, Model } from "mongoose";
import {IUser} from "@/server/models/user/user.interfce";
import {USER_ROLE} from "@/enum/user.enum";

let UserModel: Model<IUser>;

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        image: { type: String, default: '' },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER },
    }, {
        timestamps: true,
        versionKey: false
    }
);

// Create model only if it doesn't exist
try {
    UserModel = model<IUser>("User");
} catch {
    UserModel = model<IUser>("User", userSchema);
}

export { UserModel };