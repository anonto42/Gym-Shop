"use server";

import { connectToDB } from "@/server/db";
import { OrderModel } from "@/server/models/order/order.model";
import {UserModel} from "@/server/models/user/user.model";
import {ProductModel} from "@/server/models/product/product.model";
import {USER_ROLE} from "@/enum/user.enum";

// export async function getDashboardStats() {
//     try {
//         await connectToDB();
//
//         const totalUsers = await UserModel.countDocuments({ role: USER_ROLE.USER }).exec();
//         const totalProducts = await ProductModel.countDocuments().exec();
//         const totalOrders = await OrderModel.countDocuments().exec();
//         const totalRevenue = await OrderModel.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, totalRevenue: { $sum: "$total" } } } ]).exec();
//
//         return  {
//             totalUsers,
//             totalProducts,
//             totalOrders,
//             totalRevenue: totalRevenue[0]?.totalRevenue || 0,
//
//         };
//
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         throw new Error("Failed to fetch dashboard statistics");
//     }
// }

export async function getDashboardStats() {
    try {
        await connectToDB()

        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            UserModel.countDocuments(),
            ProductModel.countDocuments(),
            OrderModel.countDocuments()
        ]);

        // Get total revenue
        const totalRevenue = await OrderModel.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
        ]).exec();

        // Get monthly revenue data for the chart
        const monthlyRevenueData = await OrderModel.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
                        $lte: new Date() // Until now
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $month: "$createdAt" // Group by month (1-12)
                    },
                    revenue: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by month
            }
        ]).exec();

        // Convert to the format you want: { jan: 100, feb: 200, ... }
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthlyRevenue: { [key: string]: number } = {};

        // Initialize all months with 0
        monthNames.forEach(month => {
            monthlyRevenue[month] = 0;
        });

        // Fill with actual data
        monthlyRevenueData.forEach(item => {
            const monthIndex = item._id - 1; // Convert month number (1-12) to array index (0-11)
            const monthName = monthNames[monthIndex];
            monthlyRevenue[monthName] = item.revenue;
        });

        return {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.totalRevenue || 0,
            monthlyRevenue // Add this new field
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            monthlyRevenue: {
                jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
                jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
            }
        };
    }
}