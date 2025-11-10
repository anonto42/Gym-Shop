import {Model, Types} from "mongoose";

export interface IContactMessage {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    status: "pending" | "replied" | "resolved";
    createdAt: Date;
    updatedAt: Date;
}

export interface IContactMessageModel extends Model<IContactMessage> {
    getUnreadCount(): Promise<number>;
    getMessagesByStatus(status: string): Promise<IContactMessage[]>;
}