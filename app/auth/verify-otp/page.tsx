"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const VerifyOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length === 6) {
      
      console.log("OTP Verified:", otp);
      router.push("/auth/set-password"); 
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
      <Card className="w-[350px] h-auto border border-white backdrop-blur-3xl bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Enter The OTP
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-2 grid">
          <label htmlFor="otp" className="text-white text-sm">
            Enter The OTP
          </label>
          <input
            type="text"
            name="otp"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white text-center tracking-[0.3em]"
          />
        </CardContent>

        <CardFooter className="gap-3 grid">
          <Button
            variant="outline"
            className="w-full bg-black text-white border-0 text-xs"
            onClick={handleVerify}
          >
            Verify
          </Button>

        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOtp;
