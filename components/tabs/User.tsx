"use client";
import { useState } from "react";
import { Pen } from "lucide-react";
import ImageWithSkeleton from "@/components/ui/ImageWIthSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileTabs() {
    const [tab, setTab] = useState<"profile" | "password">("profile");
    const [name, setName] = useState("Shakir Ahmed");
    const [contact, setContact] = useState("+123456789");

    const image =
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."; // your base64 string

    return (
        <div className="w-full h-[85vh] px-6">
            {/* Tabs */}
            <div className="flex gap-6 p-6 text-white">
                <h2
                    onClick={() => setTab("profile")}
                    className={`text-xl font-semibold cursor-pointer ${
                        tab === "profile" ? "text-[#125BAC] underline" : ""
                    }`}
                >
                    Edit Profile
                </h2>
                <h2
                    onClick={() => setTab("password")}
                    className={`text-xl font-semibold cursor-pointer ${
                        tab === "password" ? "text-[#125BAC] underline" : ""
                    }`}
                >
                    Change Password
                </h2>
            </div>

            {/* Content Card */}
            <div className="max-w-[700px] mx-auto shadow-md p-6 rounded-sm bg-white">
                {tab === "profile" && (
                    <>
                        {/* Profile Image */}
                        <div className="w-[200px] h-[200px] mx-auto rounded-full bg-green-600 relative overflow-hidden">
                            {/* Overlay Edit Icon */}
                            <button className="absolute bottom-2 right-2 z-20 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                                <Pen size={20} />
                            </button>

                            {/* Skeleton / Image */}
                            <ImageWithSkeleton
                                src={image}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Form Fields */}
                        <div className="mt-6 flex flex-col gap-4 max-w-[400px] mx-auto">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="contact">Contact Number</Label>
                                <Input
                                    id="contact"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </div>

                            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                                Update
                            </Button>
                        </div>
                    </>
                )}

                {tab === "password" && (
                    <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>

                        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                            Change Password
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
