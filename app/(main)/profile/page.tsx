"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {getCookie, setCookie} from "@/server/helper/jwt.helper";
import {isAuthenticatedAndGetUser} from "@/server/functions/auth.fun";
import {IUser} from "@/server/models/user/user.interfce";
import {USER_ROLE, USER_STATUS} from "@/enum/user.enum";
import {SquarePen, Save, X, Edit3, Eye, EyeOff, LogOut, Package, Truck, MapPin, CreditCard} from "lucide-react";
import {toast} from "sonner";
import { updateUserProfileServerSide, changeUserPasswordServerSide } from "@/server/functions/user.fun";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {uploadMultipleToCloudinary} from "@/server/helper/cloudinary.helper";
import { getUserOrders } from "@/server/functions/order.fun";

// Order interface matching your order model
interface OrderItem {
    _id: string;
    title: string;
    quantity: number;
    price: number;
    type: string;
    image: string;
    product?: string;
    package?: string;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    district: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    user: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    deliveredAt?: string;
}

const statusSteps = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800" },
    { value: "shipped", label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
];

function ProfilePage() {
    const [user, setUser] = useState<IUser>({
        name: "",
        image: "https://res.cloudinary.com/ddsnont4o/image/upload/v1760025348/jhkjjhk_iesrwh.png",
        email: "",
        password: "",
        status: USER_STATUS.ACTIVE,
        isVerified: true,
        role: USER_ROLE.USER,
        createdAt: new Date()
    });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [passwordMode, setPasswordMode] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: ""
    });

    // Password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const cookie = await getCookie("user");
            if (typeof cookie == 'string' ) {
                const userData = JSON.parse(cookie);
                setUser(userData);
                setPreviewImage(userData.image);
                setFormData({
                    name: userData.name || "",
                    contact: userData.contact || "",
                    email: userData.email || ""
                });
                // Load user orders after setting user data
                await loadUserOrders(userData._id);
            } else {
                const res = await isAuthenticatedAndGetUser();
                if ( typeof res != "string" && res.isError == true) {
                    setUser({
                        name: "Guest User",
                        image: "https://res.cloudinary.com/ddsnont4o/image/upload/v1760025348/jhkjjhk_iesrwh.png",
                        email: "guest@example.com",
                        password: "",
                        status: USER_STATUS.ACTIVE,
                        isVerified: true,
                        role: USER_ROLE.USER,
                        createdAt: new Date()
                    });
                } else if ( typeof res == "string" ) {
                    await setCookie({name:"user", value: res });
                    const userData = JSON.parse(res);
                    setUser(userData);
                    setPreviewImage(userData.image);
                    setFormData({
                        name: userData.name || "",
                        contact: userData.contact || "",
                        email: userData.email || ""
                    });
                    // Load user orders after setting user data
                    await loadUserOrders(userData._id);
                }
            }
        };

        loadUserData();
    }, []);

    const loadUserOrders = async (userId: string) => {
        try {
            setOrdersLoading(true);
            const result = await getUserOrders(userId);

            if (result.success && result.orders) {
                setOrders(result.orders);
            } else {
                console.log("No orders found or error:", result.error);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error loading user orders:", error);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        // Auto-upload when image is selected
        await handleImageUpload(file);
    };

    const handleImageUpload = async (file: File) => {
        setImageUploading(true);
        try {
            if (!user._id) {
                toast.error("User not found");
                return;
            }

            const uploadedUrls = await uploadMultipleToCloudinary([file]);
            const newImageUrl = uploadedUrls[0];

            if (newImageUrl) {
                const response = await updateUserProfileServerSide(user._id, {
                    image: newImageUrl
                });

                if (!response.isError && response.data) {
                    const updatedUser = { ...user, image: newImageUrl };
                    setUser(updatedUser);
                    await setCookie({name:"user", value: JSON.stringify(updatedUser) });
                    toast.success("Profile image updated successfully");
                } else {
                    toast.error("Failed to update profile image");
                    // Revert preview image on failure
                    setPreviewImage(user.image);
                }
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            // Revert preview image on error
            setPreviewImage(user.image);
        } finally {
            setImageUploading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user._id) {
                toast.error("User not found");
                return;
            }

            const response = await updateUserProfileServerSide(user._id, {
                name: formData.name,
                contact: formData.contact
            });

            if (!response.isError && response.data) {
                const updatedUser = {
                    ...user,
                    name: formData.name,
                    contact: formData.contact
                };
                setUser(updatedUser);
                await setCookie({name:"user", value: JSON.stringify(updatedUser) });
                toast.success("Profile updated successfully");
                setEditMode(false);
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user._id) {
                toast.error("User not found");
                return;
            }

            // Validation
            if (!currentPassword) {
                toast.error("Please enter your current password");
                return;
            }

            if (!newPassword) {
                toast.error("Please enter a new password");
                return;
            }

            if (newPassword.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }

            const response = await changeUserPasswordServerSide(user._id, {
                currentPassword,
                newPassword
            });

            if (!response.isError) {
                toast.success("Password changed successfully");
                // Clear form
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setPasswordMode(false);
            } else {
                toast.error(response.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            // Clear all cookies
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            // Clear localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            toast.success("Logged out successfully");

            // Redirect to home page
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
            window.location.href = "/";
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: user.name || "",
            contact: user.contact || "",
            email: user.email || ""
        });
        setEditMode(false);
        setPreviewImage(user.image);
    };

    const handleCancelPassword = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setPasswordMode(false);
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const closeOrderDetails = () => {
        setIsOrderModalOpen(false);
        setSelectedOrder(null);
    };

    const getStatusColor = (status: string) => {
        const statusStep = statusSteps.find(s => s.value === status);
        return statusStep ? statusStep.color : "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string) => {
        const statusStep = statusSteps.find(s => s.value === status);
        return statusStep ? statusStep.label : status;
    };

    return (
        <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto">
                {/* Header with Actions */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 relative">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#F27D31]">
                        <Image
                            src={previewImage || user.image}
                            alt="profile"
                            fill
                            className="object-cover"
                        />

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="profile-image-upload"
                        />

                        <div className="absolute w-[40px] h-[40px] bottom-2 right-2 bg-[#232323]/20 text-white z-50 cursor-pointer rounded-full">
                            <label
                                htmlFor="profile-image-upload"
                                className="w-full h-full relative flex items-center justify-center cursor-pointer"
                            >
                                {imageUploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <SquarePen className="text-black" />
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex-1">
                        {editMode ? (
                            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-gray-100"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="contact" className="text-sm font-medium">Contact Number</Label>
                                    <Input
                                        id="contact"
                                        value={formData.contact}
                                        onChange={(e) => handleInputChange("contact", e.target.value)}
                                        placeholder="+1234567890"
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#F27D31] hover:bg-[#e56a1a] flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                        className="flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : passwordMode ? (
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#F27D31] hover:bg-[#e56a1a] flex items-center gap-2"
                                    >
                                        {loading ? "Changing..." : "Change Password"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelPassword}
                                        disabled={loading}
                                        className="flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setEditMode(true)}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Edit3 size={16} />
                                            Edit Profile
                                        </Button>
                                        <Button
                                            onClick={() => setPasswordMode(true)}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-500">{user.email}</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Joined: {user.createdAt ? new Date(user.createdAt).toDateString() : 'N/A'}
                                </p>
                                {user.contact && (
                                    <p className="text-gray-500 text-sm mt-1">Contact: {user.contact}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* User Orders */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#F27D31]">
                            My Orders ({orders.length})
                        </h2>
                        {orders.length > 0 && (
                            <p className="text-sm text-gray-500">
                                Total spent: ৳ {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                            </p>
                        )}
                    </div>

                    {ordersLoading ? (
                        <div className="bg-gray-50 rounded-xl shadow-sm p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27D31] mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading your orders...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl shadow-sm divide-y">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => openOrderDetails(order)}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Package className="w-4 h-4 text-[#F27D31]" />
                                                <p className="font-medium text-gray-800">
                                                    Order #{order.orderNumber}
                                                </p>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                                                <div>
                                                    <strong>{order.items.length}</strong> item(s)
                                                </div>
                                                <div>
                                                    Total: <strong>৳ {order.total.toLocaleString()}</strong>
                                                </div>
                                                <div>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-3 h-3" />
                                                    <span className="capitalize">{order.paymentMethod}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Truck className="w-3 h-3" />
                                                    <span>{order.shippingAddress.district}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl shadow-sm p-8 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No orders yet</p>
                            <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here</p>
                            <Button className="mt-4 bg-[#F27D31] hover:bg-[#e56a1a]">
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </div>

                {/* Account Information */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-[#F27D31] mb-6">
                        Account Information
                    </h2>
                    <div className="bg-gray-50 rounded-xl shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-800">Account Status</h3>
                                <p className="text-sm text-gray-600 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      user.status === USER_STATUS.ACTIVE ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                                    {user.status === USER_STATUS.ACTIVE ? 'Active' : 'Inactive'}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800">Verification Status</h3>
                                <p className="text-sm text-gray-600 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      user.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                                    {user.isVerified ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800">Account Role</h3>
                                <p className="text-sm text-gray-600 mt-1 capitalize">
                                    {user.role.toLowerCase()}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800">Member Since</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {isOrderModalOpen && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={closeOrderDetails}
                />
            )}
        </section>
    );
}

// Order Details Modal Component
interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    const getStatusColor = (status: string) => {
        const statusStep = statusSteps.find(s => s.value === status);
        return statusStep ? statusStep.color : "bg-gray-100 text-gray-800";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Order Details: {order.orderNumber}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Status */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            order.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : order.paymentStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                        }`}>
              Payment: {order.paymentStatus}
            </span>
                        <span className="text-sm text-gray-600 capitalize">
              Method: {order.paymentMethod}
            </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <MapPin size={20} />
                                Shipping Address
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.city}, {order.shippingAddress.district}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                    </p>
                                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                    <p className="text-gray-600">{order.shippingAddress.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Package size={20} />
                                Order Summary
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={item._id || index} className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || "/images/placeholder.jpg"}
                                                    alt={item.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                                <p className="text-gray-600 text-xs">
                                                    Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    ৳ {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t mt-4 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>৳ {order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping:</span>
                                        <span>৳ {order.shippingFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax:</span>
                                        <span>৳ {order.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-[#F27D31]">৳ {order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Order Notes</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900">{order.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-6 py-2 bg-[#F27D31] text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;