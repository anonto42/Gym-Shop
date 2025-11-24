import { connectToDB } from "@/server/db";
import { OrderModel } from "@/server/models/order/order.model";
import {UserModel} from "@/server/models/user/user.model";
import {ProductModel} from "@/server/models/product/product.model";

export async function getDashboardStats() {
    try {
        await connectToDB();

        // Get counts in parallel for better performance
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            monthlyOrders,
            activeUsers,
            revenueData
        ] = await Promise.all([
            // Total Users
            UserModel.countDocuments(),

            // Total Products
            ProductModel.countDocuments({ isActive: true }),

            // Total Orders
            OrderModel.countDocuments(),

            // Monthly Orders (last 30 days)
            OrderModel.countDocuments({
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }),

            // Active Users (users with orders in last 30 days)
            OrderModel.distinct("user", {
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }),

            // Revenue Data
            OrderModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$total" },
                        monthlyRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $gte: [
                                            "$createdAt",
                                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                        ]
                                    },
                                    "$total",
                                    0
                                ]
                            }
                        }
                    }
                }
            ])
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        const monthlyRevenue = revenueData[0]?.monthlyRevenue || 0;

        // Calculate conversion rate (simplified)
        const conversionRate = totalUsers > 0 ? (monthlyOrders / totalUsers) * 100 : 0;

        return {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            monthlyRevenue,
            monthlyOrders,
            activeUsers: activeUsers.length,
            conversionRate: Math.min(conversionRate, 100) // Cap at 100%
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error("Failed to fetch dashboard statistics");
    }
}