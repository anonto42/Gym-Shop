"use client";

import React, { useState } from "react";
import { X, Package, CreditCard, Truck, CheckCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import {createOrder} from "@/server/functions/order.fun";
import Image from "next/image"; // Add this import

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderSuccess?: () => void;
    items: Array<{
        product?: string;
        package?: string;
        quantity: number;
        price: number;
        title: string;
        image: string;
        type: "product" | "package";
    }>;
    userId: string;
    shippingInfo?: {
        provider: string;
        area: string;
        district: string;
        cost: number;
        deliveryTime: string;
    };
    orderSummary?: {
        subtotal: number;
        shipping: number;
        total: number;
    };
}

interface ShippingFormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export default function OrderModal({
                                       isOpen,
                                       onClose,
                                       onOrderSuccess,
                                       items,
                                       userId,
                                       shippingInfo,
                                       orderSummary
                                   }: OrderModalProps) {
    const [step, setStep] = useState<"details" | "confirmation">("details");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cashOnDelivery" | "bankTransfer">("cashOnDelivery");

    const [formData, setFormData] = useState<ShippingFormData>({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Bangladesh"
    });

    if (!isOpen) return null;

    // Use provided order summary or calculate from items
    const subtotal = orderSummary?.subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = orderSummary?.shipping || (subtotal > 2000 ? 0 : (shippingInfo?.cost || 60));
    const tax = subtotal * 0.05;
    const total = orderSummary?.total || (subtotal + shippingFee + tax);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                userId,
                items: items,
                shippingAddress: {
                    ...formData,
                    district: shippingInfo?.district || formData.city
                },
                paymentMethod,
                notes: `Order from cart with ${items.length} items - ${shippingInfo?.provider || 'Standard'} Delivery`
            };

            console.log("Creating order with data:", orderData);

            // Call your server action to create order
            const result = await createOrder(orderData);

            if (result.success) {
                toast.success("Order created successfully! 🎉");
                setStep("confirmation");

                // Call success callback to remove items from cart
                if (onOrderSuccess) {
                    onOrderSuccess();
                }
            } else {
                toast.error(result.error || "Failed to create order");
            }

        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSelection = (method: "card" | "cashOnDelivery" | "bankTransfer") => {
        setPaymentMethod(method);

        // Show appropriate toast message based on payment method
        if (method === "cashOnDelivery") {
            toast.info("💰 Cash on Delivery selected. You'll pay when you receive your order.");
        } else if (method === "card") {
            toast.info("💳 Online payment selected. You'll be redirected to payment gateway.");
        } else if (method === "bankTransfer") {
            toast.info("🏦 Bank transfer selected. Please complete the transfer within 24 hours.");
        }
    };

    const handleClose = () => {
        setStep("details");
        setFormData({
            fullName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            postalCode: "",
            country: "Bangladesh"
        });
        onClose();
    };

    const handleOnlinePayment = () => {
        toast.info("🔄 Online payment system is starting... This feature will be implemented soon!");
        // Here you would integrate with your payment gateway
        // For now, we'll just show a toast
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {step === "details" ? "Complete Your Order" : "Order Confirmed!"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === "details" ? (
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Order Summary */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                                {/* Selected Items */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShoppingBag className="w-5 h-5 text-[#F27D31]" />
                                        <span className="font-medium text-gray-700">
                                            Selected Items ({items.length})
                                        </span>
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {items.map((item, index) => (
                                            <div key={index} className="flex gap-3 border rounded-lg p-3 bg-gray-50">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                                                    <p className="text-gray-600 text-xs">
                                                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                                                    </p>
                                                    <p className="text-[#F27D31] font-semibold text-sm">
                                                        ৳ {(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                                        {item.type === "product" ? "Product" : "Package"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                {shippingInfo && (
                                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Truck className="w-4 h-4 inline mr-1 text-blue-600" />
                                                <span className="font-medium text-blue-800 text-sm">
                                                    {shippingInfo.provider} - {shippingInfo.area}
                                                </span>
                                                <p className="text-blue-600 text-xs mt-1">
                                                    📍 {shippingInfo.district} • 🕒 {shippingInfo.deliveryTime}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-blue-800">
                                                    ৳ {shippingInfo.cost.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        {shippingFee === 0 && (
                                            <div className="text-green-600 text-xs mt-2 font-medium">
                                                🎉 Free shipping applied!
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({items.length} items):</span>
                                        <span>৳ {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>{shippingFee === 0 ? "Free" : `৳ ${shippingFee.toLocaleString()}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (5%):</span>
                                        <span>৳ {tax.toLocaleString()}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total:</span>
                                        <span className="text-[#F27D31]">৳ {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping & Payment */}
                            <div className="space-y-6">
                                {/* Shipping Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name *"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                            disabled={loading}
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number *"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                            disabled={loading}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address *"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                            disabled={loading}
                                        />
                                        <textarea
                                            name="address"
                                            placeholder="Full Address *"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31] resize-none"
                                            rows={3}
                                            disabled={loading}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City *"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                                disabled={loading}
                                            />
                                            <input
                                                type="text"
                                                name="postalCode"
                                                placeholder="Postal Code"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                                disabled={loading}
                                            />
                                        </div>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
                                            disabled={loading}
                                        >
                                            <option value="Bangladesh">Bangladesh</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                            paymentMethod === "cashOnDelivery" ? "border-[#F27D31] bg-orange-50" : "border-gray-300 hover:bg-gray-50"
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cashOnDelivery"
                                                checked={paymentMethod === "cashOnDelivery"}
                                                onChange={() => handlePaymentSelection("cashOnDelivery")}
                                                className="text-[#F27D31] focus:ring-[#F27D31]"
                                                disabled={loading}
                                            />
                                            <Package className="w-5 h-5" />
                                            <div className="flex-1">
                                                <span className="font-medium">Cash on Delivery</span>
                                                <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                            paymentMethod === "card" ? "border-[#F27D31] bg-orange-50" : "border-gray-300 hover:bg-gray-50"
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={paymentMethod === "card"}
                                                onChange={() => handlePaymentSelection("card")}
                                                className="text-[#F27D31] focus:ring-[#F27D31]"
                                                disabled={loading}
                                            />
                                            <CreditCard className="w-5 h-5" />
                                            <div className="flex-1">
                                                <span className="font-medium">Credit/Debit Card</span>
                                                <p className="text-sm text-gray-600">Pay securely online</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                            paymentMethod === "bankTransfer" ? "border-[#F27D31] bg-orange-50" : "border-gray-300 hover:bg-gray-50"
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="bankTransfer"
                                                checked={paymentMethod === "bankTransfer"}
                                                onChange={() => handlePaymentSelection("bankTransfer")}
                                                className="text-[#F27D31] focus:ring-[#F27D31]"
                                                disabled={loading}
                                            />
                                            <CreditCard className="w-5 h-5" />
                                            <div className="flex-1">
                                                <span className="font-medium">Bank Transfer</span>
                                                <p className="text-sm text-gray-600">Transfer to our bank account</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Online Payment Button (for card payments) */}
                                    {paymentMethod === "card" && (
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                onClick={handleOnlinePayment}
                                                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all"
                                            >
                                                💳 Proceed to Online Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 mt-8 pt-6 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#F27D31] text-white rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Order...
                                    </div>
                                ) : paymentMethod === "cashOnDelivery" ? (
                                    `Place Order - ৳ ${total.toLocaleString()}`
                                ) : (
                                    `Confirm Order - ৳ ${total.toLocaleString()}`
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Confirmation Step */
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Order Placed Successfully!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase. We&#39;ve sent a confirmation to your email.
                        </p>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <h4 className="font-semibold mb-3 text-center">Order Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span>{items.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <span className="capitalize">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-semibold text-[#F27D31]">৳ {total.toLocaleString()}</span>
                                </div>
                                {paymentMethod === "cashOnDelivery" && (
                                    <div className="text-green-600 text-sm mt-2">
                                        💰 You&#39;ll pay when you receive your order
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold mb-2">What&#39;s Next?</h4>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span>Order Confirmation</span>
                                </div>
                                <Truck className="w-4 h-4" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Delivery</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="px-8 py-3 bg-[#F27D31] text-white rounded-xl hover:bg-orange-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}