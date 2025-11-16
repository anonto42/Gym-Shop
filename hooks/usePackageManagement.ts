import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { IPackage } from "@/server/models/package/package.interface";
import {
    getAllPackagesServerSide,
    deletePackageServerSide,
    togglePackageFeaturedStatusServerSide
} from "@/server/functions/package.fun";
import {convertToPlainObject, hasToJSON} from "@/lib/packageUtils";

export const usePackageManagement = () => {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const loadPackages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllPackagesServerSide({
                filter: {},
                page: 1,
                limit: 100
            });

            if (!response.isError && response.data) {
                const responseData = response.data as { packages?: IPackage[] };
                const packageData = responseData.packages || [];

                const plainPackages = packageData.map(pkg => {
                    try {
                        let plainPkg: IPackage = hasToJSON(pkg)
                            ? convertToPlainObject(pkg.toJSON()) as IPackage
                            : convertToPlainObject(pkg) as IPackage;

                        // Normalize package data
                        plainPkg = {
                            ...plainPkg,
                            imageUrl: Array.isArray(plainPkg.imageUrl) ? plainPkg.imageUrl :
                                plainPkg.imageUrl ? [plainPkg.imageUrl as string] : [],
                            features: Array.isArray(plainPkg.features) ? plainPkg.features : [],
                            _id: String(plainPkg._id),
                            rating: plainPkg.rating || 0,
                            isActive: plainPkg.isActive ?? true,
                            isFeatured: plainPkg.isFeatured ?? false
                        };

                        return plainPkg;
                    } catch (error) {
                        console.error('Error converting package:', error);
                        return createFallbackPackage();
                    }
                });

                setPackages(plainPackages);
            } else {
                toast.error("Failed to load packages");
            }
        } catch (error) {
            console.error("Error loading packages:", error);
            toast.error("Failed to load packages");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this package?")) {
            return;
        }

        try {
            const response = await deletePackageServerSide(id);
            if (!response.isError) {
                setPackages(prev => prev.filter((pkg) => pkg._id !== id));
                toast.success("Package deleted successfully");
            } else {
                toast.error(response.message || "Failed to delete package");
            }
        } catch (error) {
            console.error("Error deleting package:", error);
            toast.error("Failed to delete package");
        }
    }, []);

    const handleToggleFeatured = useCallback(async (pkg: IPackage) => {
        try {
            const response = await togglePackageFeaturedStatusServerSide(pkg._id.toString());
            if (!response.isError) {
                setPackages(prev => prev.map(item =>
                    item._id === pkg._id
                        ? { ...item, isFeatured: !item.isFeatured }
                        : item
                ));
                toast.success(response.message || "Package status updated");
            } else {
                toast.error(response.message || "Failed to update package status");
            }
        } catch (error) {
            console.error("Error toggling featured status:", error);
            toast.error("Failed to update package status");
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        loadPackages();
    }, [loadPackages]);

    return {
        packages,
        loading,
        isMounted,
        loadPackages,
        handleDelete,
        handleToggleFeatured
    };
};

const createFallbackPackage = (): IPackage => ({
    _id: String(Math.random()),
    title: 'Error loading package',
    description: '',
    price: 0,
    imageUrl: [],
    features: [],
    rating: 0,
    isActive: false,
    isFeatured: false,
    category: 'error',
    createdAt: new Date(),
    updatedAt: new Date()
});