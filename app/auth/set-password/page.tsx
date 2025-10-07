"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSetPassword = () => {
    if (!password || !confirm) {
      alert("Please fill out both fields");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    // ✅ Later: connect this to your backend API for setting a new password
    console.log("New password set successfully ✅");

    // Redirect to sign-in page after success
    router.push("/auth/signin");
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
      <Card className="w-[350px] h-auto border border-white backdrop-blur-3xl bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Set New Password
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-2 grid">
          <label htmlFor="password" className="text-white text-sm">
            New Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />

          <label htmlFor="confirm" className="text-white text-sm">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />
        </CardContent>

        <CardFooter className="gap-3 grid">
          <Button
            variant="outline"
            className="w-full bg-black text-white border-0 text-xs"
            onClick={handleSetPassword}
          >
            Set Password
          </Button>

          <Button
            variant="outline"
            className="w-full bg-white text-black border-0 text-xs"
            onClick={() => router.push("/auth/signin")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetPassword;
