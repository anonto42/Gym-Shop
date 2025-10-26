"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {verifyOtpServerSide} from "@/server/functions/auth.fun";
import {IVerifyOtpInput} from "@/server/interface/auth.interface";
import { useSearchParams } from 'next/navigation';
import Loader from "@/components/loader/Loader";
import {toast} from "sonner";
import {IResponse} from "@/server/interface/response.interface";

const VerifyOtp = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const email = params.get("email");

  const handleVerify = async () => {
    setLoading(true);
    if (otp.length === 6) {

      const fromData = new FormData() as FormData as IVerifyOtpInput;
      fromData.append("otp", otp);
      fromData.append("email", email!);

      const response = await verifyOtpServerSide(fromData) as IResponse & { data: { token: string } };
      if (response.isError){
          toast.error(response.message);
          setLoading(false);
          return null;
      }

      toast.success(response.message);

      setLoading(false);
      router.push(`/auth/set-password?email=${email}&token=${response.data.token}`);
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
        { loading && <Loader size={"lg"} overlay={true} message={"Loading..."} /> }
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
