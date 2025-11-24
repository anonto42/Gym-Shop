"use server";

import "@/server/models/product/product.model";
import "@/server/models/package/package.model";
import "@/server/models/user/user.model";
import { revalidatePath } from "next/cache";
import connectToDB from "@/server/db";
import {OrderModel} from "@/server/models/order/order.model";
import {CartModel} from "@/server/models/cart/cart.model";
import {IPackage} from "@/server/models/package/package.interface";
import {IProduct} from "@/server/models/product/product.interface";

interface CreateOrderData {
    userId: string;
    items: Array<{
        product?: string;
        package?: string;
        trainingProgram?: string;
        quantity: number;
        price: number;
        title: string;
        image: string;
        type: "product" | "package" | "trainingProgram";
    }>;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    shippingAddress: any;
    paymentMethod: "card" | "cashOnDelivery" | "bankTransfer";
    notes?: string;
}

export async function createOrder(orderData: CreateOrderData) {
    try {
        await connectToDB();

        // Make sure items don't have trainingProgram if you're not using it
        const items = orderData.items.map((item: any) => ({
            product: item.product || undefined,
            package: item.package || undefined,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            image: item.image,
            type: item.type
        }));

        const order = await OrderModel.create({
            ...orderData,
            items,
            subtotal: orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
            tax: orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) * 0.05,
            total: orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) * 1.05 // subtotal + 5% tax
        });

        revalidatePath("/orders");
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await connectToDB();

        const updateData: Record<string, unknown> = { status };

        if (status === "delivered") {
            updateData.deliveredAt = new Date();
        } else if (status === "cancelled") {
            updateData.cancelledAt = new Date();
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Failed to update order status" };
    }
}

export async function getUserOrders(userId: string) {
    try {
        await connectToDB();

        const orders = await OrderModel.find(
            {
                user: userId
            }
        ).lean();
        return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return { success: false, error: "Failed to fetch orders" };
    }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                paymentStatus,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Error updating payment status:", error);
        return { success: false, error: "Failed to update payment status" };
    }
}

export async function getAllOrders() {
    try {
        await connectToDB();

        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .exec();

        return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return { success: false, error: "Failed to fetch orders" };
    }
}

export async function getOrderById(orderId: string) {
    try {
        await connectToDB();

        const order = await OrderModel.findOne({ orderNumber: orderId })
            .populate("user", "name email phone")
            .populate("items.product")
            .populate("items.package")
            // Remove trainingProgram population
            .exec();

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Error fetching order:", error);
        return { success: false, error: "Failed to fetch order" };
    }
}

export async function removeCartItemsAfterOrder({ userId, itemIds }: { userId: string; itemIds: string[] }) {
    try {
        await connectToDB();

        console.log("Removing cart items for user:", userId, "items:", itemIds);

        // Delete the cart items that were ordered
        const result = await CartModel.deleteMany({
            userId: userId,
            _id: { $in: itemIds }
        });

        console.log(`✅ Successfully removed ${result.deletedCount} items from cart`);

        return {
            success: true,
            deletedCount: result.deletedCount,
            message: `Removed ${result.deletedCount} items from cart`
        };
    } catch (error) {
        console.error("❌ Error removing cart items:", error);
        return {
            success: false,
            error: "Failed to remove cart items",
            message: "Please try again"
        };
    }
}