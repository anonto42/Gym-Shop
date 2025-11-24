interface StatCardProps {
    title: string;
    value: number;
    icon?: string;
    isCurrency?: boolean;
    isPercentage?: boolean;
    trend?: number;
    size?: "sm" | "md" | "lg";
}

export default function StatCard({
                                     title,
                                     value,
                                     icon,
                                     isCurrency = false,
                                     isPercentage = false,
                                     trend,
                                     size = "md"
                                 }: StatCardProps) {
    const formatValue = (val: number) => {
        if (isCurrency) {
            return `৳${val.toLocaleString()}`;
        }
        if (isPercentage) {
            return `${val.toFixed(1)}%`;
        }
        return val.toLocaleString();
    };

    const getSizeClasses = () => {
        switch (size) {
            case "sm": return "p-4 h-24";
            case "lg": return "p-6 h-36";
            default: return "p-5 h-32";
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${getSizeClasses()} transition-all hover:shadow-xl`}>
            <div className="flex items-start justify-between h-full">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
                    <p className={`font-bold text-gray-800 ${
                        size === "sm" ? "text-2xl" : "text-3xl"
                    }`}>
                        {formatValue(value)}
                    </p>
                    {trend && (
                        <div className={`flex items-center mt-2 ${
                            trend >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                            <span className="text-sm font-medium">
                                {trend >= 0 ? "↗" : "↘"} {Math.abs(trend)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">from last month</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="text-2xl opacity-80">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}