import {Line} from "react-chartjs-2";
import type { Tick } from 'chart.js';
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

export default function ProfitChart(){

    const labels = Array.from({ length: 30 }, (_, i) => `Dec ${i + 1}`);

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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    maxTicksLimit: 8,
                    color: '#6b7280',
                }
            },
            y: {
                grid: {
                    color: '#f3f4f6',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6b7280',
                    callback: (value: number | string | Tick) => {
                        const num = typeof value === 'number' ? value : Number(value);
                        return `$${(num / 1000).toFixed(0)}k`;
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 6,
                hoverBorderWidth: 2,
            },
            line: {
                tension: 0.4,
                borderWidth: 3,
            }
        },
    }
    const profitData = {
        labels,
        datasets: [
            {
                label: "Profit",
                data: labels.map(() => Math.floor(Math.random() * 80000) + 10000),
                borderColor: "rgba(168, 85, 247, 1)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                fill: true,
                pointBackgroundColor: "rgba(168, 85, 247, 1)",
                pointBorderColor: "#ffffff",
                pointHoverBackgroundColor: "#ffffff",
                pointHoverBorderColor: "rgba(168, 85, 247, 1)",
            }
        ]
    }
    const revenueData = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: labels.map(() => Math.floor(Math.random() * 35000) + 5000),
                borderColor: "rgba(34, 197, 94, 1)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                pointBackgroundColor: "rgba(34, 197, 94, 1)",
                pointBorderColor: "#ffffff",
                pointHoverBackgroundColor: "#ffffff",
                pointHoverBorderColor: "rgba(34, 197, 94, 1)",
            },
            {
                label: "Other Revenue",
                data: labels.map(() => Math.floor(Math.random() * 25000) + 5000),
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#ffffff",
                pointHoverBackgroundColor: "#ffffff",
                pointHoverBorderColor: "rgba(59, 130, 246, 1)",
            }
        ]
    }

    const totalProfit = profitData.datasets[0].data.reduce((a, b) => a + b, 0);
    const totalRevenue = revenueData.datasets[0].data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">User Growth Overview</h3>
                    <p className="text-gray-500 text-sm">December 2024 Performance</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">+8.3%</span>
            </div>
            <div className="h-80">
                <Line data={profitData} options={chartOptions} />
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <p className="text-gray-600">Total Profit</p>
                    <p className="text-2xl font-bold text-purple-600">
                        ${(totalProfit / 1000).toFixed(1)}k
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600">Profit Margin</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {((totalProfit / totalRevenue) * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    )
}