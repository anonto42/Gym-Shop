"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleResetRequest = () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    // ✅ Here you can add your backend API call to send OTP or reset link
    console.log("Reset link sent to:", email);

    // After sending OTP or reset link, redirect to OTP verify page
    router.push("/auth/verify-otp");
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
      <Card className="w-[350px] h-auto border border-white backdrop-blur-3xl bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-2 grid">
          <label htmlFor="email" className="text-white text-sm">
            Enter your registered email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />
        </CardContent>

        <CardFooter className="gap-3 grid">
          <Button
            variant="outline"
            className="w-full bg-black text-white border-0 text-xs"
            onClick={handleResetRequest}
          >
            Send Reset Link
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

export default ForgotPassword;
