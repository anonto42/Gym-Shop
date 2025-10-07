"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/auth/verify-otp");
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
      <Card className="w-[350px] h-auto border border-white backdrop-blur-3xl bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-2 grid">
          <label htmlFor="name" className="text-white text-sm">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />

          <label htmlFor="email" className="text-white text-sm">
            Email Address
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />

          <label htmlFor="password" className="text-white text-sm">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
          />
        </CardContent>

        <CardFooter className="gap-3 grid">
          <Button
            variant="outline"
            className="w-full bg-black text-white border-0 text-xs placeholder:text-white placeholder:font-light"
            onClick={handleSignUp}
          >
            Create Account
          </Button>

          <Button
            variant="outline"
            className="w-full bg-white text-black border-0 text-xs"
          >
            Continue With Google
          </Button>

          <CardDescription className="text-center text-xs text-white">
            Already have an account?{" "}
            <span
              className="text-xs font-bold cursor-pointer"
              onClick={() => router.push("/auth/signin")}
            >
              Log In
            </span>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
