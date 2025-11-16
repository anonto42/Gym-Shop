"use client";

import React from "react";
import { Package, Plus } from "lucide-react";

interface EmptyStateProps {
    onAddNew: () => void;
}

const EmptyState = React.memo(({ onAddNew }: EmptyStateProps) => (
    <div className="col-span-full text-center py-12">
        <div className="text-gray-400 mb-4">
            <Package size={64} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages available</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first package</p>
        <button
            onClick={onAddNew}
            className="bg-[#125BAC] hover:bg-[#0d4793] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
            <Plus size={20} />
            Add Your First Package
        </button>
    </div>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;