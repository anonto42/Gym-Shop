"use client"
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
    TooltipItem,
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
        [key: string]: number;
    };
    title?: string;
    showStats?: boolean;
}

// Define proper types for Chart.js callbacks
interface TooltipContext {
    parsed: {
        y: number;
    };
    dataset: {
        label?: string;
    };
}

export default function RevenueChart({
                                         data,
                                         title = "Revenue Analytics",
                                         showStats = true
                                     }: RevenueChartProps) {
    // Convert simple object to chart data
    const chartData = formatChartData(data);

    const revenueData = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Revenue",
                data: chartData.values,
                borderColor: "rgba(34, 197, 94, 1)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            }
        ]
    };

    const totalRevenue = chartData.values.reduce((a, b) => a + b, 0);
    const averageRevenue = totalRevenue / chartData.values.length;

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
                    label: function(context: TooltipItem<'line'>) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
                        return `৳${context.parsed.y.toLocaleString()}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                grid: { color: '#f3f4f6' },
                ticks: {
                    callback: function(value: string | number) {
                        if (typeof value === 'number') {
                            return `৳${(value / 1000).toFixed(0)}k`;
                        }
                        return value;
                    }
                }
            }
        },
        elements: {
            point: { radius: 3, hoverRadius: 6 }
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <p className="text-gray-500 text-sm">Monthly Performance</p>
                </div>
            </div>

            <div className="h-80">
                <Line data={revenueData} options={chartOptions} />
            </div>

            {showStats && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                        <p className="text-lg font-bold text-green-600">
                            ৳{(totalRevenue / 1000).toFixed(1)}k
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Average Monthly</p>
                        <p className="text-lg font-semibold text-gray-800">
                            ৳{(averageRevenue / 1000).toFixed(1)}k
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to format simple object into chart data
function formatChartData(data?: { [key: string]: number }) {
    if (!data) {
        // Generate sample data if none provided
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const values = months.map(() => Math.floor(Math.random() * 5000) + 1000);
        return { labels: months, values };
    }

    // Convert object to sorted arrays
    const labels = Object.keys(data);
    const values = Object.values(data);

    return { labels, values };
}