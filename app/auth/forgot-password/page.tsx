"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {IError} from "@/server/interface/error.interface";
import {toast} from "sonner";
import Loader from "@/components/loader/Loader";
import {forgotPasswordServerSide} from "@/server/functions/auth.fun";
import {IForgotPasswordInput} from "@/server/interface/auth.interface";

const ForgotPassword = () => {
  const router = useRouter();
  const [error, setError] = useState<IError>({field: null, message: null});
  const [email, setEmail] =useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetRequest = async () => {
    setEmail("");
    setLoading(true);
    setError({field: null, message: null});

    if (!email) {
      setError({field: "email", message: "Email is required"});
      setLoading(false);
      return;
    }

    const formData = new FormData() as FormData & IForgotPasswordInput;
    formData.append("email", email);

    const response = await forgotPasswordServerSide(formData);

    if (response.isError) {
        toast.error(response.message);
        setLoading(false);
        return null;
    }

    setLoading(false);

    toast.success('OTP send on email!');

    setTimeout(() => {
        router.push(`/auth/verify-otp?email=${email}`);
    }, 800);

  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
        { loading && <Loader size={"lg"} overlay={true} message={"Loading..."} /> }
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
            { error.field == "email" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}
        </CardContent>

        <CardFooter className="gap-3 grid">
          <Button
            variant="outline"
            className="w-full bg-black text-white border-0 text-xs cursor-pointer"
            onClick={handleResetRequest}
          >
            Send Reset OTP
          </Button>

          <Button
            variant="outline"
            className="w-full bg-white text-black border-0 text-xs cursor-pointer"
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
