

interface StatCardProps {
    title: string;
    value: number;
    className?: string;
}

export default function StatCard({ title, value, className = "" }: StatCardProps) {
    return (
        <div className={`rounded-lg px-6 py-6 shadow-lg bg-white border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
            <h2 className="text-4xl font-bold text-[#125BAC]">{value.toLocaleString()}</h2>
        </div>
    );
}