"use client";

import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { getOrderById } from "@/server/functions/order.fun";
import { IOrder, IOrderItem } from "@/server/models/order/order.interface";
import ImageWithSkeleton from "@/components/ui/ImageWIthSkeleton";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const trackOrder = async () => {
        if (!orderId.trim()) {
            setError("Please enter an order ID");
            return;
        }

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const result = await getOrderById(orderId.trim());
            if (result.success && result.order) {
                setOrder(result.order);
            } else {
                setError(result.error || "Order not found. Please check your Order ID.");
            }
        } catch (error) {
            console.error('Error tracking order:', error);
            setError("Failed to fetch order details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'confirmed': return 'text-blue-600 bg-blue-100';
            case 'processing': return 'text-purple-600 bg-purple-100';
            case 'shipped': return 'text-indigo-600 bg-indigo-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'processing': return <Package className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusSteps = (currentStatus: string) => {
        const steps = [
            { status: 'pending', label: 'Order Placed', icon: <Package className="w-4 h-4" /> },
            { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" /> },
            { status: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
            { status: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
            { status: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
        ];

        const currentIndex = steps.findIndex(step => step.status === currentStatus);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            current: index === currentIndex,
        }));
    };

    return (
        <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#F27D31] mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enter your order ID to check the current delivery status and estimated delivery time.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Order ID (e.g., ORD-251123-6E0WCN)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:ring-2 focus:ring-[#F27D31] outline-none"
                            />
                        </div>
                        <button
                            onClick={trackOrder}
                            disabled={loading}
                            className="bg-[#F27D31] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e66d1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Track Order
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-center mt-3">{error}</p>
                    )}
                </div>

                {/* Order Details */}
                {order && (
                    <div className="space-y-8">
                        {/* Order Status Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Status</h2>

                            {/* Status Steps */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    {getStatusSteps(order.status).map((step) => (
                                        <div key={step.status} className="flex flex-col items-center flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                                step.completed
                                                    ? 'bg-[#F27D31] text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-sm text-center ${
                                                step.completed ? 'text-[#F27D31] font-medium' : 'text-gray-500'
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Status */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className={`p-3 rounded-full ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 capitalize text-lg">{order.status}</p>
                                    <p className="text-gray-600">
                                        {order.status === 'pending' && 'Your order is being processed'}
                                        {order.status === 'confirmed' && 'Order has been confirmed'}
                                        {order.status === 'processing' && 'Preparing your order for shipment'}
                                        {order.status === 'shipped' && 'Your order is on the way to you'}
                                        {order.status === 'delivered' && 'Order has been successfully delivered'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Order Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-medium">{order.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-medium text-[#F27D31]">
                                            ৳ {order.total?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-medium capitalize">
                                            {order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Status:</span>
                                        <span className={`font-medium ${
                                            order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{order.shippingAddress?.fullName}</p>
                                            <p className="text-gray-600">{order.shippingAddress?.address}</p>
                                            <p className="text-gray-600">
                                                {order.shippingAddress?.city}, {order.shippingAddress?.district}
                                            </p>
                                            <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items?.map((item: IOrderItem, index: number) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                                            <ImageWithSkeleton
                                                className="rounded-lg h-full w-full object-cover"
                                                src={item.image}
                                                alt={item.title}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">
                                                Quantity: {item.quantity} × ৳{item.price.toLocaleString()}
                                            </p>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                                {item.type === "product" ? "Product" : "Package"}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">
                                                ৳ {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}