"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Package, Truck, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/server/functions/order.fun";
import {IOrder} from "@/server/models/order/order.interface";

export default function OrderSuccessPage() {
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            if (orderId) {
                try {
                    const result = await getOrderById(orderId);
                    if (result) {
                        setOrder(result.order);
                    }
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

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

    if (loading) {
        return (
            <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F27D31] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        Thank you for your purchase. We&#39;ve sent a confirmation email with your order details.
                    </p>
                    {order && (
                        <p className="text-gray-500">
                            Order ID: <span className="font-semibold">{order.orderNumber}</span>
                        </p>
                    )}
                </div>

                {order ? (
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Order Status */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 capitalize">{order.status}</p>
                                    <p className="text-sm text-gray-600">
                                        {order.status === 'pending' && 'Your order is being processed'}
                                        {order.status === 'confirmed' && 'Order has been confirmed'}
                                        {order.status === 'processing' && 'Preparing your order for shipment'}
                                        {order.status === 'shipped' && 'Your order is on the way'}
                                        {order.status === 'delivered' && 'Order has been delivered'}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700 mb-2">Payment Status</h3>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                                    order.paymentStatus === 'paid'
                                        ? 'text-green-600 bg-green-100'
                                        : 'text-yellow-600 bg-yellow-100'
                                }`}>
                                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Items Total:</span>
                                    <span>৳ {order.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{order.shippingFee === 0 ? 'Free' : `৳ ${order.shippingFee?.toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>৳ {order.tax?.toLocaleString()}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-[#F27D31]">৳ {order.total?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                                <p className="text-gray-600 capitalize">
                                    {order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-12">
                        <p className="text-yellow-800">
                            Order details not found. You can track your order using the form below.
                        </p>
                    </div>
                )}

                {/* Track Another Order & Continue Shopping */}
                <div className="text-center space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Want to track another order?
                        </h3>
                        <Link
                            href="/track-order"
                            className="inline-flex items-center gap-2 bg-[#F27D31] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#e66d1f] transition-all"
                        >
                            Track Another Order
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-x-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 border border-[#F27D31] text-[#F27D31] font-semibold px-6 py-3 rounded-full hover:bg-[#F27D31] hover:text-white transition-all"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-2 bg-gray-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-all"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}