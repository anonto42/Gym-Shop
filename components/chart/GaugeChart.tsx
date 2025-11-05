import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GaugeChartProps {
    value: number;
    max: number;
    label?: string;
    size?: number;
    colors?: {
        active: string;
        background: string;
    };
}

const GaugeChart: React.FC<GaugeChartProps> = ({
                                                   value,
                                                   max,
                                                   label = "Progress",
                                                   size = 200,
                                                   colors = { active: "#F27D31", background: "#E0E0E0" }
                                               }) => {
    const percentage = (value / max) * 100;
    const normalizedValue = Math.min(Math.max(value, 0), max);

    const data = {
        datasets: [
            {
                data: [normalizedValue, max - normalizedValue],
                backgroundColor: [colors.active, colors.background],
                borderWidth: 0,
                cutout: "80%",
                borderRadius: 10,
                circumference: 180,
                rotation: -90,
            },
        ],
    };

    const options = {
        rotation: -90,
        circumference: 180,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context: any) => {
                        return `${label}: ${context.parsed} (${percentage.toFixed(1)}%)`;
                    }
                }
            },
        },
        maintainAspectRatio: false,
        events: [],
    };

    const needleAngle = (normalizedValue / max) * 180 - 90;
    const needleLength = size * 0.35;

    return (
        <div className="relative flex flex-col items-center mt-5" style={{ width: size, height: size / 2 + 40 }}>
            {/* Gauge Container */}
            <div style={{ width: size, height: size / 2 }} className="relative">
                <Doughnut data={data} options={options} />

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 origin-bottom"
                    style={{
                        width: '4px',
                        height: needleLength,
                        backgroundColor: '#374151',
                        borderRadius: '2px',
                        transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                        transformOrigin: 'bottom center',
                        transition: 'transform 1s ease-in-out',
                        zIndex: 10,
                    }}
                />

                {/* Center circle */}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#374151',
                        borderRadius: '50%',
                        zIndex: 11,
                    }}
                />
            </div>

            {/* Labels and Value */}
            <div className="text-center mt-4">
                <div className="text-3xl font-bold text-gray-800">
                    ${value.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600 mt-1">
                    {label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {percentage.toFixed(1)}% of ${max.toLocaleString()}
                </div>
            </div>

            {/* Scale Marks */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between px-4">
                <span className="text-xs text-gray-500">$0</span>
                <span className="text-xs text-gray-500">${max.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default GaugeChart;