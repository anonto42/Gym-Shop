"use client"
import RevenueChart from "../chart/RevenueChart";
import ProfitChart from "../chart/ProfitChart";
import StatCard from "../ui/StatCard";

export default function OverviewTab() {
    const stats = {
        totalUsers: 10,
        totalProducts: 15,
        totalOrders: 1232,
        totalRevenue: 123,
    };

    return (
        <div className="space-y-6 p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} />
                <StatCard title="Total Products" value={stats.totalProducts} />
                <StatCard title="Total Orders" value={stats.totalOrders} />
                <StatCard title="Total Revenue" value={stats.totalRevenue} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <ProfitChart />
            </div>

        </div>
    );
}