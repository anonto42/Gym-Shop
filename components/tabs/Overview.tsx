"use client"
import { useEffect, useState } from "react";
import RevenueChart from "../chart/RevenueChart";
import StatCard from "../ui/StatCard";
import { getDashboardStats } from "@/server/functions/dashboard.fun";

interface ICratedata {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: { [key: string]: number };
}

export default function OverviewTab() {
    const [stats, setStats] = useState<ICratedata>();
    const [loading, setLoading] = useState(false);

    async function fetchData () {
        setLoading(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData().then( e => console.log( e ));
    },[])


    if (loading) {
        return (
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-32"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
                    <div className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
                </div>
            </div>
        );
    }

    const displayStats = {
        totalUsers: stats?.totalUsers || 0,
        totalProducts: stats?.totalProducts || 0,
        totalOrders: stats?.totalOrders || 0,
        totalRevenue: stats?.totalRevenue || 0,
        monthlyRevenue: stats?.monthlyRevenue || {}
    };

    return (
        <div className="space-y-6 p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={displayStats.totalUsers}
                    icon="👥"
                    // trend={12.5}
                />
                <StatCard
                    title="Total Products"
                    value={displayStats.totalProducts}
                    icon="📦"
                    // trend={8.2}
                />
                <StatCard
                    title="Total Orders"
                    value={displayStats.totalOrders}
                    icon="🛒"
                    // trend={15.3}
                />
                <StatCard
                    title="Total Revenue"
                    value={displayStats.totalRevenue}
                    icon="💰"
                    isCurrency={true}
                    // trend={18.7}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart
                    data={displayStats.monthlyRevenue}
                />
            </div>
        </div>
    );
}