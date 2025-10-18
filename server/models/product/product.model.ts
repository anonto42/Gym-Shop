import {model, Schema} from "mongoose";
import {IProduct} from "@/server/models/product/product.interface";

const productSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: [String], required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        keyWords: { type: String, required: true },
    },{
        versionKey: false,
        timestamps: true
    }
);

export const Product = model<IProduct>("Product", productSchema);