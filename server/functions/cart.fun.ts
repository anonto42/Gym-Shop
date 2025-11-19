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
