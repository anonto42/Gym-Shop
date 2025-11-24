import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ProfitChartProps {
    data?: {
        labels: string[];
        orders: number[];
        users: number[];
    };
}

export default function ProfitChart({ data }: ProfitChartProps) {
    const chartData = data || generateGrowthData();

    const growthData = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Daily Orders",
                data: chartData.orders,
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            },
            {
                label: "New Users",
                data: chartData.users,
                borderColor: "rgba(245, 158, 11, 1)",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            }
        ]
    };

    const totalOrders = chartData.orders.reduce((a, b) => a + b, 0);
    const totalUsers = chartData.users.reduce((a, b) => a + b, 0);
    const avgOrdersPerUser = totalUsers > 0 ? (totalOrders / totalUsers).toFixed(1) : "0";

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { maxTicksLimit: 8 }
            },
            y: {
                grid: { color: '#f3f4f6' },
                beginAtZero: true
            }
        },
        elements: {
            point: { radius: 0, hoverRadius: 6 }
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Orders & User Growth</h3>
                    <p className="text-gray-500 text-sm">Last 30 Days Performance</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    +{totalOrders} Orders
                </span>
            </div>
            <div className="h-80">
                <Line data={growthData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-lg font-bold text-blue-600">
                        {totalOrders}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">New Users</p>
                    <p className="text-lg font-bold text-amber-600">
                        {totalUsers}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Avg Orders/User</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {avgOrdersPerUser}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper function to generate realistic growth data
function generateGrowthData() {
    const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    let orders = 15;
    let users = 8;
    const ordersData = [];
    const usersData = [];

    for (let i = 0; i < 30; i++) {
        // Simulate business growth patterns
        orders += Math.random() * 5 - 1;
        users += Math.random() * 3 - 0.5;

        ordersData.push(Math.max(5, orders));
        usersData.push(Math.max(2, users));
    }

    return { labels, orders: ordersData, users: usersData };
}