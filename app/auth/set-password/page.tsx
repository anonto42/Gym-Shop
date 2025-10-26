"use client";

import React, { useState } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {IError} from "@/server/interface/error.interface";
import {ISetPasswordInput} from "@/server/interface/auth.interface";
import Loader from "@/components/loader/Loader";
import {setPasswordServerSide} from "@/server/functions/auth.fun";
import {toast} from "sonner";

const SetPassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IError>({field: null, message: null});

  const email = params.get("email");
  const token = params.get("token");

  const handleSetPassword = async () => {
    setLoading(true);
    setError({field: null, message: null});

    if (!password.trim()){
        setError({field: "password", message: "You must specify a new password."});
        setLoading(false);
        return;
    }
    if (!confirm.trim()){
        setError({field: "confirm-password", message: "You must re-type the password."});
        setLoading(false);
        return;
    }
    if (!password || !confirm) {
      setLoading(false);
      setError({field: "confirm-password", message: "Passwords do not match"});
      return;
    }

    const formData = new FormData() as FormData & ISetPasswordInput;

    formData.append("password", password);
    formData.append("email", email!);
    formData.append("token", token!);

    const response = await setPasswordServerSide(formData);
    if(response.isError){
        toast.error(response.message)
        setLoading(false);
        return;
    }

    toast.success(response.message);

    setLoading(false);
    router.push("/auth/signin");
  };

  return (
    <div className="flex items-center justify-center h-screen shadow-xl shadow-black">
        { loading && <Loader size={"lg"} overlay={true} message={"Loading..."} /> }
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
            { error.field == "password" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}

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
            { error.field == "confirm-password" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}
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
