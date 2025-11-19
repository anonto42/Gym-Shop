"use server";

import {connectToDB} from "@/server/db";
import {handleServerError} from "@/server/helper/ErrorHandler";
import {CartModel} from "@/server/models/cart/cart.model";

export async function addToCart({userId, productId, packageId}: {userId: unknown, productId?: unknown, packageId?: unknown}) {
    try {
        await connectToDB();

        // Build query dynamically based on what's provided
        const query: any = { userId: userId };

        const orConditions = [];
        if (productId) orConditions.push({ product: productId });
        if (packageId) orConditions.push({ package: packageId });

        if (orConditions.length === 0) {
            return {
                isError: true,
                status: 400,
                message: "Either productId or packageId is required",
                data: null
            };
        }

        query.$or = orConditions;

        const cart = await CartModel.findOne(query).populate("product package").lean();

        if(cart) {
            return {
                isError: true,
                status: 400,
                message: "This item is already in your cart",
                data: cart
            };
        }

        const createdCart = await CartModel.create({
            userId: userId,
            product: productId || null,
            package: packageId || null
        });

        return {
            isError: false,
            status: 200,
            message: "Item added to cart",
            data: createdCart
        };

    } catch (error) {
        return handleServerError(error);
    }
}

export async function countCurrentCartLength({userId}: {userId: unknown}) {
    try {
        await connectToDB();

        return await CartModel.countDocuments({userId: userId});

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getCartItems({ userId }: { userId: unknown }) {
    try {
        await connectToDB();

        const cartItems = await CartModel.find({
            userId: userId,
            isRemoved: false
        })
            .populate("product")
            .populate("package")
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const serializedItems = JSON.parse(JSON.stringify(cartItems));

        return {
            isError: false,
            status: 200,
            message: "Cart items fetched successfully",
            data: serializedItems
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Remove item from cart
export async function removeFromCart({ cartId }: { cartId: unknown }) {
    try {
        await connectToDB();

        const removedCart = await CartModel.findByIdAndUpdate(
            cartId,
            {
                isActive: false,
                isRemoved: true
            },
            { new: true }
        ).exec();

        if (!removedCart) {
            return {
                isError: true,
                status: 404,
                message: "Cart item not found",
                data: null
            };
        }

        return {
            isError: false,
            status: 200,
            message: "Item removed from cart successfully",
            data: removedCart
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Update cart quantity
export async function updateCartQuantity({ cartId, quantity }: { cartId: unknown, quantity: number }) {
    try {
        await connectToDB();

        const updatedCart = await CartModel.findByIdAndUpdate(
            cartId,
            { quantity: quantity },
            { new: true }
        ).exec();

        if (!updatedCart) {
            return {
                isError: true,
                status: 404,
                message: "Cart item not found",
                data: null
            };
        }

        return {
            isError: false,
            status: 200,
            message: "Quantity updated successfully",
            data: updatedCart
        };

    } catch (error) {
        return handleServerError(error);
    }
}

// Clear entire cart
export async function clearCart({ userId }: { userId: unknown }) {
    try {
        await connectToDB();

        const result = await CartModel.updateMany(
            {
                userId: userId,
                isActive: true
            },
            {
                isActive: false,
                isRemoved: true
            }
        ).exec();

        return {
            isError: false,
            status: 200,
            message: "Cart cleared successfully",
            data: { deletedCount: result.modifiedCount }
        };

    } catch (error) {
        return handleServerError(error);
    }
}
