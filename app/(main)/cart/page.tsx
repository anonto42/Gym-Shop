"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getCookie } from "@/server/helper/jwt.helper";
import { getCartItems, removeFromCart, updateCartQuantity } from "@/server/functions/cart.fun";
import { IProduct } from "@/server/models/product/product.interface";
import { IPackage } from "@/server/models/package/package.interface";
import imageUrl from "@/const/imageUrl";
import CartItem from "@/components/card/CartItem";

// Unified cart item type
interface CartItemType {
    _id: string;
    product?: IProduct & { _id: string };
    package?: IPackage & { _id: string };
    quantity: number;
    isActive: boolean;
}

// Cart state interface
interface CartState {
    items: CartItemType[];
    selectedItems: string[];
    loading: boolean;
    updatingItems: string[];
    summary: {
        subtotal: number;
        shipping: number;
        total: number;
        selectedCount: number;
    };
}

// Item quantity state interface
interface ItemQuantityState {
    [itemId: string]: {
        quantity: number;
        totalPrice: number;
    };
}

function CartPage() {
    const router = useRouter();

    // Initial state
    const initialState: CartState = {
        items: [],
        selectedItems: [],
        loading: true,
        updatingItems: [],
        summary: {
            subtotal: 0,
            shipping: 0,
            total: 0,
            selectedCount: 0
        }
    };

    const [cartState, setCartState] = useState<CartState>(initialState);
    const [itemQuantities, setItemQuantities] = useState<ItemQuantityState>({});

    useEffect(() => {
        if (cartState.items.length > 0) {
            const initialQuantities: ItemQuantityState = {};
            cartState.items.forEach(item => {
                const itemData = getItemData(item);
                const price = itemData?.data?.price || 0;
                initialQuantities[item._id] = {
                    quantity: item.quantity,
                    totalPrice: price * item.quantity
                };
            });
            setItemQuantities(initialQuantities);
        }
    }, [cartState.items]);

    useEffect(() => {
        calculateSummary();
    }, [cartState.items, cartState.selectedItems, itemQuantities]);

    // Calculate cart summary
    const calculateSummary = () => {
        const selectedCartItems = cartState.items.filter(item =>
            cartState.selectedItems.includes(item._id)
        );

        const subtotal = selectedCartItems.reduce((sum, item) => {
            const itemQuantity = itemQuantities[item._id]?.quantity || item.quantity;
            const price = item.product?.price || item.package?.price || 0;
            return sum + (price * itemQuantity);
        }, 0);

        const shipping = subtotal > 0 ? 50 : 0;
        const total = subtotal + shipping;
        const selectedCount = selectedCartItems.length;

        setCartState(prev => ({
            ...prev,
            summary: { subtotal, shipping, total, selectedCount }
        }));
    };

    // Update specific state properties
    const updateCartState = (updates: Partial<CartState>) => {
        setCartState(prev => ({ ...prev, ...updates }));
    };

    // Fetch cart items
    const fetchCartItems = async () => {
        try {
            updateCartState({ loading: true });

            const cookie = await getCookie("user");
            if (!cookie) {
                toast.error("Please login to view your cart");
                router.push("/auth/signin");
                return;
            }

            const userCookie = JSON.parse(cookie);
            const response = await getCartItems({ userId: userCookie._id });

            if (response.isError) {
                toast.error(response.message);
                return;
            }

            if (response.data) {
                updateCartState({
                    items: response.data as CartItemType[],
                    selectedItems: []
                });
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            toast.error("Failed to load cart items");
        } finally {
            updateCartState({ loading: false });
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (itemId: string) => {
        try {
            updateCartState({
                updatingItems: [...cartState.updatingItems, itemId]
            });

            const response = await removeFromCart({ cartId: itemId });

            if (response.isError) {
                toast.error(response.message);
                return;
            }

            toast.success("Item removed from cart");

            // Remove from local state
            updateCartState({
                items: cartState.items.filter(item => item._id !== itemId),
                selectedItems: cartState.selectedItems.filter(id => id !== itemId)
            });

            // Remove from quantities state
            setItemQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[itemId];
                return newQuantities;
            });

        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item");
        } finally {
            updateCartState({
                updatingItems: cartState.updatingItems.filter(id => id !== itemId)
            });
        }
    };

    // Update quantity - NEW: Updated to handle state management
    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            updateCartState({
                updatingItems: [...cartState.updatingItems, itemId]
            });

            const response = await updateCartQuantity({
                cartId: itemId,
                quantity: newQuantity
            });

            if (response.isError) {
                toast.error(response.message);
                return;
            }

            // Update local quantities state
            const item = cartState.items.find(item => item._id === itemId);
            if (item) {
                const itemData = getItemData(item);
                const price = itemData?.data?.price || 0;

                setItemQuantities(prev => ({
                    ...prev,
                    [itemId]: {
                        quantity: newQuantity,
                        totalPrice: price * newQuantity
                    }
                }));
            }

            // Also update the main cart state
            updateCartState({
                items: cartState.items.map(item =>
                    item._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            });

        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Failed to update quantity");
        } finally {
            updateCartState({
                updatingItems: cartState.updatingItems.filter(id => id !== itemId)
            });
        }
    };

    // NEW: Update quantity locally (for immediate UI updates)
    const updateQuantityLocal = (itemId: string, newQuantity: number) => {
        const item = cartState.items.find(item => item._id === itemId);
        if (!item) return;

        const itemData = getItemData(item);
        const price = itemData?.data?.price || 0;
        const maxQuantity = itemData?.maxStock || 999;

        // Validate quantity bounds
        if (newQuantity < 1 || newQuantity > maxQuantity) return;

        setItemQuantities(prev => ({
            ...prev,
            [itemId]: {
                quantity: newQuantity,
                totalPrice: price * newQuantity
            }
        }));
    };

    // Toggle item selection
    const toggleSelection = (id: string) => {
        const newSelectedItems = cartState.selectedItems.includes(id)
            ? cartState.selectedItems.filter(item => item !== id)
            : [...cartState.selectedItems, id];

        updateCartState({ selectedItems: newSelectedItems });
    };

    // Select all items
    const selectAllItems = () => {
        const allSelected = cartState.selectedItems.length === cartState.items.length;

        updateCartState({
            selectedItems: allSelected ? [] : cartState.items.map(item => item._id)
        });
    };

    // Check if all items are selected
    const isAllSelected = cartState.items.length > 0 &&
        cartState.selectedItems.length === cartState.items.length;

    // Check if an item is selected
    const isItemSelected = (id: string) => cartState.selectedItems.includes(id);

    // Check if an item is being updated
    const isItemUpdating = (id: string) => cartState.updatingItems.includes(id);

    // Get item data with proper typing
    const getItemData = (item: CartItemType) => {
        if (item.product) {
            return {
                type: "product" as const,
                data: item.product,
                image: item.product.images?.[0] || imageUrl.packageImage.image1,
                maxStock: item.product.stock
            };
        } else if (item.package) {
            return {
                type: "package" as const,
                data: item.package,
                image: item.package.imageUrl?.[0] || imageUrl.packageImage.image1,
                maxStock: Infinity // Packages don't have stock limits
            };
        }
        return null;
    };

    // Get item quantity and total price from state
    const getItemQuantity = (itemId: string) => {
        return itemQuantities[itemId]?.quantity || cartState.items.find(item => item._id === itemId)?.quantity || 0;
    };

    const getItemTotalPrice = (itemId: string) => {
        return itemQuantities[itemId]?.totalPrice || 0;
    };

    // Checkout handler
    const handleCheckout = () => {
        if (cartState.summary.selectedCount === 0) {
            toast.error("Please select items to checkout");
            return;
        }

        toast.success(`Proceeding to checkout with ${cartState.summary.selectedCount} items`);
        // router.push("/checkout");
    };

    // Continue shopping
    const handleContinueShopping = () => {
        router.push("/shop");
    };

    // Clear all selected items
    const clearSelection = () => {
        updateCartState({ selectedItems: [] });
    };

    // Load cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    if (cartState.loading) {
        return (
            <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
                <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
                    <div className="text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your cart...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Your Cart</h1>
                <p className="text-gray-600">
                    Select one or more products to proceed with your purchase.
                </p>
            </div>

            {cartState.items.length === 0 ? (
                <div className="w-full max-w-6xl mx-auto text-center py-20">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some products to get started!</p>
                    <button
                        onClick={handleContinueShopping}
                        className="bg-[#F27D31] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#e66d1f] transition-all"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
                    {/* Product List */}
                    <div className="flex-1">
                        {/* Select All Header */}
                        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                        isAllSelected
                                            ? "bg-[#F27D31] border-[#F27D31]"
                                            : "border-gray-300 bg-white"
                                    }`}
                                    onClick={selectAllItems}
                                >
                                    {isAllSelected && <Check className="text-white w-4 h-4" />}
                                </div>
                                <span className="text-gray-700 font-medium">
                                    Select all items ({cartState.items.length})
                                </span>
                            </div>
                            {cartState.selectedItems.length > 0 && (
                                <button
                                    onClick={clearSelection}
                                    className="text-sm text-[#F27D31] hover:text-[#e66d1f] transition-all"
                                >
                                    Clear selection
                                </button>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-6">
                            {cartState.items.map((item) => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    getItemData={getItemData}
                                    isItemSelected={isItemSelected}
                                    toggleSelection={toggleSelection}
                                    isItemUpdating={isItemUpdating}
                                    handleQuantityChange={handleQuantityChange}
                                    handleRemoveItem={handleRemoveItem}
                                    quantity={getItemQuantity(item._id)}
                                    totalPrice={getItemTotalPrice(item._id)}
                                    updateQuantityLocal={updateQuantityLocal}
                                />
                            ))}
                        </div>

                        {/* Cart Actions */}
                        {cartState.items.length > 0 && (
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-gray-600 text-sm">
                                    <span className="font-medium">{cartState.items.length}</span> items in cart
                                    {cartState.selectedItems.length > 0 && (
                                        <span className="text-[#F27D31] ml-2">
                                            ({cartState.selectedItems.length} selected)
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleContinueShopping}
                                    className="text-[#F27D31] font-semibold hover:text-[#e66d1f] transition-all"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 bg-gray-50 p-6 rounded-2xl shadow-md h-fit sticky top-20">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Order Summary
                        </h2>

                        {cartState.summary.selectedCount > 0 ? (
                            <>
                                {/* Selected Items List */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {cartState.items
                                        .filter(item => isItemSelected(item._id))
                                        .map((item) => {
                                            const itemData = getItemData(item);
                                            if (!itemData) return null;

                                            const itemQuantity = getItemQuantity(item._id);
                                            const itemTotal = getItemTotalPrice(item._id);

                                            return (
                                                <div key={item._id} className="flex justify-between items-start text-gray-700 text-sm pb-2 border-b border-gray-200">
                                                    <div className="flex-1">
                                                        <p className="font-medium truncate">{itemData.data.title}</p>
                                                        <p className="text-gray-500">
                                                            {itemQuantity} × ৳{itemData.data.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold whitespace-nowrap ml-2">
                                                        ৳ {itemTotal.toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                </div>

                                <hr className="my-4" />

                                {/* Price Breakdown */}
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between">
                                        <p>Subtotal ({cartState.summary.selectedCount} items)</p>
                                        <p>৳ {cartState.summary.subtotal.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Shipping</p>
                                        <p>৳ {cartState.summary.shipping.toLocaleString()}</p>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold text-gray-800 text-lg">
                                        <p>Total</p>
                                        <p>৳ {cartState.summary.total.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    className="mt-6 w-full bg-[#F27D31] text-white font-semibold py-3 rounded-full hover:bg-[#e66d1f] transition-all shadow-md"
                                >
                                    Proceed to Checkout ({cartState.summary.selectedCount} items)
                                </button>

                                {/* Security Notice */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        🔒 Secure checkout · Free returns
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">No items selected</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Select items from your cart to see the order summary and proceed to checkout.
                                </p>
                                <button
                                    onClick={handleContinueShopping}
                                    className="text-[#F27D31] font-semibold hover:text-[#e66d1f] transition-all"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default CartPage;