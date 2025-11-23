import { Document, Model, Types } from "mongoose";

export interface IOrderItem {
    product?: Types.ObjectId;
    package?: Types.ObjectId;
    trainingProgram?: Types.ObjectId;
    quantity: number;
    price: number;
    title: string;
    image: string;
    type: "product" | "package" | "trainingProgram";
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
}

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

export interface IOrder extends Document {
    orderNumber: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    status: OrderStatus;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    paymentMethod: "card" | "cashOnDelivery" | "bankTransfer";
    notes?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderModel extends Model<IOrder> {
    generateOrderNumber(): Promise<string>;
    findByUser(userId: string): Promise<IOrder[]>;
    findByStatus(status: OrderStatus): Promise<IOrder[]>;
}