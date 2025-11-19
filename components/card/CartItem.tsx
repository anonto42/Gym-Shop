"use client";

import React from "react";
import Image from "next/image";
import { Check, Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
    item: {
        _id: string;
        product?: {
            _id: string;
            title: string;
            price: number;
            images: string[];
            description: string;
            stock: number;
        };
        package?: {
            _id: string;
            title: string;
            price: number;
            imageUrl: string[];
            description: string;
        };
        quantity: number;
        isActive: boolean;
    };
    getItemData: (item: any) => any;
    isItemSelected: (id: string) => boolean;
    toggleSelection: (id: string) => void;
    isItemUpdating: (id: string) => boolean;
    handleQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
    handleRemoveItem?: (itemId: string) => Promise<void>;
    quantity: number;
    totalPrice: number;
    updateQuantityLocal: (itemId: string, newQuantity: number) => void;
}

function CartItem({
                      item,
                      getItemData,
                      isItemSelected,
                      toggleSelection,
                      isItemUpdating,
                      handleQuantityChange,
                      handleRemoveItem,
                      quantity,
                      totalPrice,
                      updateQuantityLocal
                  }: CartItemProps) {
    const itemData = getItemData(item);
    const selected = isItemSelected(item._id);
    const isUpdating = isItemUpdating(item._id);

    // Handle quick quantity changes with optimistic updates
    const handleQuickQuantityChange = async (change: number) => {
        if (!itemData?.data?.price) return;

        const newQuantity = quantity + change;
        const maxQuantity = itemData.maxStock || 999;

        // Validate quantity bounds
        if (newQuantity < 1 || newQuantity > maxQuantity) return;

        // Optimistic update - update local state immediately
        updateQuantityLocal(item._id, newQuantity);

        // Then update on server
        try {
            await handleQuantityChange(item._id, newQuantity);
        } catch (error) {
            // Revert on error - parent will handle this through the original quantity
            console.error("Failed to update quantity:", error);
        }
    };

    // Handle increment
    const handleIncrement = () => handleQuickQuantityChange(1);

    // Handle decrement
    const handleDecrement = () => handleQuickQuantityChange(-1);

    // Handle remove item
    const handleRemove = async () => {
        if (handleRemoveItem) {
            await handleRemoveItem(item._id);
        }
    };

    // Early return if no item data
    if (!itemData || !itemData.data) {
        return (
            <div className="border rounded-2xl p-6 flex items-center justify-center">
                <div className="text-gray-500">Loading item...</div>
            </div>
        );
    }

    const isDisabled = isUpdating;
    const maxQuantity = itemData.maxStock || 999;
    const canIncrement = quantity < maxQuantity;
    const canDecrement = quantity > 1;
    const unitPrice = itemData.data.price || 0;

    return (
        <div
            className={`relative border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm transition-all ${
                selected ? "border-[#F27D31] bg-orange-50" : "border-gray-200"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {/* Selection Checkbox */}
            <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    selected
                        ? "bg-[#F27D31] border-[#F27D31]"
                        : "border-gray-300 bg-white"
                } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !isDisabled && toggleSelection(item._id)}
            >
                {selected && <Check className="text-white w-4 h-4" />}
            </div>

            {/* Item Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                    src={itemData.image}
                    alt={itemData.data.title || "Product image"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        // Fallback image handling
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.jpg";
                    }}
                />
            </div>

            {/* Item Info */}
            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-800 text-lg mb-1">
                            {itemData.data.title || "Untitled Product"}
                        </h2>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                            {itemData.data.description || "No description available"}
                        </p>

                        {/* Price Information */}
                        <div className="space-y-1">
                            <p className="text-gray-900 font-semibold text-lg">
                                ৳ {totalPrice.toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm">
                                ৳ {unitPrice.toLocaleString()} × {quantity}
                            </p>
                            {itemData.type === "product" && (
                                <p className="text-gray-500 text-xs">
                                    Stock: {maxQuantity} | Unit Price: ৳ {unitPrice.toLocaleString()}
                                </p>
                            )}
                            {itemData.type === "package" && (
                                <p className="text-gray-500 text-xs">
                                    Package | Unit Price: ৳ {unitPrice.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-3 absolute bottom-6 right-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrement}
                                disabled={isDisabled || !canDecrement}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title={canDecrement ? "Decrease quantity" : "Minimum quantity reached"}
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            {/* Quantity Display */}
                            <div className="relative">
                                <div className="w-16 text-center border border-gray-300 rounded py-1 px-2 bg-white">
                                    {quantity}
                                </div>
                                {isUpdating && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                                        <div className="w-4 h-4 border-2 border-[#F27D31] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleIncrement}
                                disabled={isDisabled || !canIncrement}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title={canIncrement ? "Increase quantity" : "Maximum quantity reached"}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Stock Indicator */}
                        {itemData.type === "product" && (
                            <div className="text-xs text-gray-500">
                                {quantity >= maxQuantity ? (
                                    <span className="text-red-500">Max stock reached</span>
                                ) : (
                                    <span>{maxQuantity - quantity} left in stock</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
                    <button
                        onClick={handleRemove}
                        disabled={isDisabled}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove from Cart
                    </button>

                    {/* Price Summary */}
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Total: ৳ {totalPrice.toLocaleString()}
                    </div>
                </div>

                {/* Loading Indicator */}
                {isUpdating && (
                    <div className="mt-2 text-xs text-[#F27D31] flex items-center gap-1 justify-center md:justify-start">
                        <div className="w-3 h-3 border-2 border-[#F27D31] border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartItem;