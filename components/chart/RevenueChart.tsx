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

interface RevenueChartProps {
    data?: {
        labels: string[];
        revenue: number[];
        profit: number[];
    };
}

export default function RevenueChart({ data }: RevenueChartProps) {
    // Generate realistic data if not provided
    const chartData = data || generateRevenueData();

    const revenueData = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Revenue",
                data: chartData.revenue,
                borderColor: "rgba(34, 197, 94, 1)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            },
            {
                label: "Profit",
                data: chartData.profit,
                borderColor: "rgba(168, 85, 247, 1)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            }
        ]
    };

    const totalRevenue = chartData.revenue.reduce((a, b) => a + b, 0);
    const totalProfit = chartData.profit.reduce((a, b) => a + b, 0);
    const profitMargin = ((totalProfit / totalRevenue) * 100);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                }
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `৳${context.parsed.y.toLocaleString()}`;
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { maxTicksLimit: 8 }
            },
            y: {
                grid: { color: '#f3f4f6' },
                ticks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: function(value: any) {
                        return `৳${(value / 1000).toFixed(0)}k`;
                    }
                }
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
                    <h3 className="text-xl font-bold text-gray-800">Revenue & Profit Analytics</h3>
                    <p className="text-gray-500 text-sm">Last 30 Days Performance</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    +{profitMargin.toFixed(1)}% Margin
                </span>
            </div>
            <div className="h-80">
                <Line data={revenueData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-lg font-bold text-green-600">
                        ৳{(totalRevenue / 1000).toFixed(1)}k
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Total Profit</p>
                    <p className="text-lg font-bold text-purple-600">
                        ৳{(totalProfit / 1000).toFixed(1)}k
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Profit Margin</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper function to generate realistic revenue data
function generateRevenueData() {
    const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    let revenue = 5000;
    let profit = 2000;
    const revenueData = [];
    const profitData = [];

    for (let i = 0; i < 30; i++) {
        // Add some randomness but maintain trend
        revenue += Math.random() * 1000 - 200;
        profit += Math.random() * 500 - 100;

        // Ensure profit is always less than revenue
        profit = Math.min(profit, revenue * 0.6);

        revenueData.push(Math.max(1000, revenue));
        profitData.push(Math.max(500, profit));
    }

    return { labels, revenue: revenueData, profit: profitData };
}