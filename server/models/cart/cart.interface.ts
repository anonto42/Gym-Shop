import {Model} from "mongoose";

export interface ICart {
    _id?: unknown;
    userId: unknown;
    product: unknown;
    package: unknown;
    isRemoved: boolean;
    isActive?: boolean;
    quantity?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default interface ICartModel extends Model<ICart> {
    getAllByUserId(userId: unknown, page?: number, limit?: number): Promise<ICart[]>;
    getCartByUserId(userId: unknown): Promise<ICart | null>;
    getCartItemById(cartId: unknown): Promise<ICart | null>;
    getCartByUserAndProduct(userId: unknown, productId: unknown): Promise<ICart | null>;
    getCartByUserAndPackage(userId: unknown, packageId: unknown): Promise<ICart | null>;
    getCartCountByUserId(userId: unknown): Promise<number>;
    removeCartItem(cartId: unknown): Promise<ICart | null>;
    clearUserCart(userId: unknown): Promise<{ deletedCount?: number }>;
    updateCartQuantity(cartId: unknown, quantity: number): Promise<ICart | null>;
}
