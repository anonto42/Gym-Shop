import { model, models, Schema } from "mongoose";
import {IContactMessage, IContactMessageModel} from "@/server/models/contact/contact.interface";

const contactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
        maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "replied", "resolved"],
        default: "pending"
    }
}, {
    timestamps: true
});

// Indexes for better query performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ isRead: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

// Static methods
contactMessageSchema.statics.getUnreadCount = async function(): Promise<number> {
    return this.countDocuments({ isRead: false });
};

contactMessageSchema.statics.getMessagesByStatus = async function(status: string): Promise<IContactMessage[]> {
    return this.find({ status }).sort({ createdAt: -1 }).exec();
};

let ContactMessageModel: IContactMessageModel;

if (typeof models !== 'undefined' && models.ContactMessage) {
    ContactMessageModel = models.ContactMessage as unknown as IContactMessageModel;
} else {
    ContactMessageModel = model<IContactMessage, IContactMessageModel>("ContactMessage", contactMessageSchema);
}

export { ContactMessageModel };