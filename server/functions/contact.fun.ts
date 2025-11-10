"use server";

import { ContactMessageModel } from "@/server/models/contact/contact.model";
import { connectToDB } from "@/server/db";
import { handleServerError } from "@/server/helper/ErrorHandler";

// Create new contact message
export async function createContactMessageServerSide(formData: FormData) {
    try {
        await connectToDB();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        // Validation
        if (!name || !email || !subject || !message) {
            return {
                isError: true,
                status: 400,
                message: "All fields are required"
            };
        }

        const newMessage = await ContactMessageModel.create({
            name,
            email,
            subject,
            message
        });

        return {
            isError: false,
            status: 201,
            message: "Thank you for your message! We'll get back to you soon.",
            data: { message: newMessage }
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Get all contact messages for admin
export async function getAllContactMessagesServerSide() {
    try {
        await connectToDB();

        const messages = await ContactMessageModel.find()
            .sort({ createdAt: -1 })
            .exec();

        return {
            isError: false,
            status: 200,
            message: "Contact messages fetched successfully",
            data: { messages }
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Get unread messages count
export async function getUnreadContactMessagesCountServerSide() {
    try {
        await connectToDB();

        const count = await ContactMessageModel.getUnreadCount();

        return {
            isError: false,
            status: 200,
            message: "Unread count fetched successfully",
            data: { count }
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Mark message as read
export async function markContactMessageAsReadServerSide(messageId: string) {
    try {
        await connectToDB();

        const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
            messageId,
            {
                $set: {
                    isRead: true,
                    status: "replied"
                }
            },
            { new: true }
        ).exec();

        if (!updatedMessage) {
            return {
                isError: true,
                status: 404,
                message: "Contact message not found"
            };
        }

        return {
            isError: false,
            status: 200,
            message: "Message marked as read",
            data: { message: updatedMessage }
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Update message status
export async function updateContactMessageStatusServerSide(
    messageId: string,
    status: "pending" | "replied" | "resolved"
) {
    try {
        await connectToDB();

        const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
            messageId,
            { $set: { status } },
            { new: true }
        ).exec();

        if (!updatedMessage) {
            return {
                isError: true,
                status: 404,
                message: "Contact message not found"
            };
        }

        return {
            isError: false,
            status: 200,
            message: "Message status updated successfully",
            data: { message: updatedMessage }
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Delete contact message
export async function deleteContactMessageServerSide(messageId: string) {
    try {
        await connectToDB();

        const deletedMessage = await ContactMessageModel.findByIdAndDelete(messageId).exec();

        if (!deletedMessage) {
            return {
                isError: true,
                status: 404,
                message: "Contact message not found"
            };
        }

        return {
            isError: false,
            status: 200,
            message: "Contact message deleted successfully"
        };

    } catch (error) {
        return handleServerError(error);
    }
}