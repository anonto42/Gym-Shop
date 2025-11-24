"use client"
import { useEffect, useState } from "react";
import RevenueChart from "../chart/RevenueChart";
import ProfitChart from "../chart/ProfitChart";
import StatCard from "../ui/StatCard";
import { getDashboardStats } from "@/server/functions/dashboard.fun";

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    monthlyOrders: number;
    activeUsers: number;
    conversionRate: number;
}

export default function OverviewTab() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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

    const displayStats = stats || {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        monthlyOrders: 0,
        activeUsers: 0,
        conversionRate: 0
    };

    return (
        <div className="space-y-6 p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={displayStats.totalUsers}
                    icon="👥"
                    trend={12.5}
                />
                <StatCard
                    title="Total Products"
                    value={displayStats.totalProducts}
                    icon="📦"
                    trend={8.2}
                />
                <StatCard
                    title="Total Orders"
                    value={displayStats.totalOrders}
                    icon="🛒"
                    trend={15.3}
                />
                <StatCard
                    title="Total Revenue"
                    value={displayStats.totalRevenue}
                    icon="💰"
                    isCurrency={true}
                    trend={18.7}
                />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Monthly Revenue"
                    value={displayStats.monthlyRevenue}
                    icon="📈"
                    isCurrency={true}
                    size="sm"
                />
                <StatCard
                    title="Active Users"
                    value={displayStats.activeUsers}
                    icon="👤"
                    size="sm"
                />
                <StatCard
                    title="Conversion Rate"
                    value={displayStats.conversionRate}
                    icon="🎯"
                    isPercentage={true}
                    size="sm"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <ProfitChart />
            </div>
        </div>
    );
}