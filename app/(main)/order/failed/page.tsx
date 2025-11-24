"use client";

import React, { useState, useEffect } from "react";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/server/functions/order.fun";
import {IOrder} from "@/server/models/order/order.interface";

export default function FailedPage() {
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
            <div className="max-w-4xl mx-auto text-center">
                {/* Failure Header */}
                <div className="mb-12">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-red-500 mb-4">
                        Order Failed
                    </h1>
                    <p className="text-lg text-gray-700 mb-2">
                        Unfortunately, we couldn&#39;t process your order at this time.
                    </p>
                    {order && (
                        <p className="text-gray-500">
                            Order ID: <span className="font-semibold">{order.orderNumber}</span>
                        </p>
                    )}
                </div>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto mb-8">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">
                        What went wrong?
                    </h2>
                    <div className="text-left space-y-3 text-red-700">
                        <p>• Payment authorization failed</p>
                        <p>• Insufficient funds in your account</p>
                        <p>• Network connectivity issues</p>
                        <p>• Payment gateway timeout</p>
                    </div>
                </div>

                {order && (
                    <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="font-medium">{order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-medium text-[#F27D31]">৳ {order.total?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Method:</span>
                                <span className="font-medium capitalize">
                                    {order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-medium text-red-600">Failed</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-6">
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-[#F27D31] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#e66d1f] transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                        </button>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 border border-[#F27D31] text-[#F27D31] font-semibold px-6 py-3 rounded-full hover:bg-[#F27D31] hover:text-white transition-all"
                        >
                            Return to Cart
                        </Link>
                    </div>

                    <div className="pt-6 border-t">
                        <p className="text-gray-600 mb-4">Need help with your order?</p>
                        <div className="space-x-4">
                            <Link
                                href="/track-order"
                                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#F27D31] transition-colors"
                            >
                                Track Your Order
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#F27D31] transition-colors"
                            >
                                Contact Support
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}