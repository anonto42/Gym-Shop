"use client";

import React from "react";
import { IPackage } from "@/server/models/package/package.interface";
import EmptyState from "./EmptyState";
import PackageCard from "@/components/card/PackageCart";

interface PackageGridProps {
    packages: IPackage[];
    onEdit: (pkg: IPackage) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (pkg: IPackage) => void;
    renderStars: (rating: number) => React.ReactNode;
}

const PackageGrid = React.memo(({
                                    packages,
                                    onEdit,
                                    onDelete,
                                    onToggleFeatured,
                                    renderStars
                                }: PackageGridProps) => {
    if (packages.length === 0) {
        return <EmptyState onAddNew={() => {}} />;
    }

    return (
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 overflow-auto">
            {packages.map((pkg) => (
                <PackageCard
                    key={pkg._id}
                    pkg={pkg}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFeatured={onToggleFeatured}
                    renderStars={renderStars}
                />
            ))}
        </div>
    );
});

PackageGrid.displayName = 'PackageGrid';

export default PackageGrid;