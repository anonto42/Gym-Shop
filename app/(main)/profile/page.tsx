"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {getCookie, setCookie} from "@/server/helper/jwt.helper";
import {isAuthenticatedAndGetUser} from "@/server/functions/auth.fun";
import {IUser} from "@/server/models/user/user.interfce";
import {USER_ROLE, USER_STATUS} from "@/enum/user.enum";
import {SquarePen, Save, X, Edit3, Eye, EyeOff, LogOut} from "lucide-react";
import {toast} from "sonner";
import { updateUserProfileServerSide, changeUserPasswordServerSide } from "@/server/functions/user.fun";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {uploadMultipleToCloudinary} from "@/server/helper/cloudinary.helper";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  
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

  const [orders] = useState([
    { id: "12345", product: "Smart Lamp", date: "Sep 5, 2025", status: "Delivered" },
    { id: "67890", product: "Air Purifier Pro", date: "Sep 12, 2025", status: "Shipped" },
  ]);

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
            }
        }
    };

    loadUserData();
  }, []);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
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
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
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
      for (let cookie of cookies) {
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
    setSelectedFile(null);
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
          <h2 className="text-2xl font-semibold text-[#F27D31] mb-6">
            Recent Orders
          </h2>
          <div className="bg-gray-50 rounded-xl shadow-sm divide-y">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order.id} — {order.product}
                    </p>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <span
                    className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No orders yet</p>
                <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here</p>
              </div>
            )}
          </div>
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
    </section>
  );
}

export default ProfilePage;