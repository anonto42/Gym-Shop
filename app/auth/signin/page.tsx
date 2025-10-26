"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import {signInServerSide} from "@/server/functions/auth.fun";
import Loader from "@/components/loader/Loader";
import {IError} from "@/server/interface/error.interface";
import {ISignInInput, ISignUpInput} from "@/server/interface/auth.interface";
import {isErrorResponse} from "@/server/helper/sendResponse.helper";
import {toast} from "sonner";
import {setCookie} from "@/server/helper/jwt.helper";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<IError>({field: null, message: null});
  const [email, setEmail] =useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
      setLoading(true);
      setError({field: null, message: null});

      if (!email) {
          setError({field: "email", message: "Email is required"});
          setLoading(false);
          return null;
      }
      if (!password) {
          setError({field: "password", message: "Password is required"});
          setLoading(false);
          return null;
      }

      const formData = new FormData() as FormData & ISignInInput;

      // Form data appended
      formData.append("email", email);
      formData.append("password", password);

      const response = await signInServerSide(formData);
      if ( typeof response != "string" && isErrorResponse(response)) {
          toast.error(response.message);
          setLoading(false);
          return null;
      }

      setLoading(false);
      setEmail("");
      setPassword("");

      toast.success('Login successfully!', {
          description: 'Welcome to our platform!',
      });

      setCookie({ value: response });

      router.push('/');
  }

  return (
    <div className='flex items-center justify-center h-screen shadow-xl shadow-black'>
        { loading && <Loader size={"lg"} overlay={true} message={"Loading..."} /> }
        <Card className='w-[350px] h-auto border border-white backdrop-blur-3xl bg-white/20'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-white'>Log In</CardTitle>
        </CardHeader>
        <CardContent className='gap-2 grid'>
          <label htmlFor="email" className='text-white text-sm'>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text" 
            name="email"
            placeholder='email'
            className='w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white'
          />
            { error.field == "email" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}
          <label htmlFor="password" className='text-white text-sm'>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            name="password"
            placeholder='password'
            className='w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white'
          />
            { error.field == "password" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}
          <Link href="/auth/forgot-password" className='text-right text-white text-xs'>Forgot Password?</Link>
        </CardContent>
        <CardFooter className='gap-3 grid'>
          <Button variant="outline" className='w-full bg-black text-white border-0 text-xs active:scale-95 duration-100 cursor-pointer' onClick={handleSignIn}>Log In</Button>
          <Button variant="outline" className='w-full bg-white text-black border-0 text-xs'>Continue With Google</Button>
          <CardDescription className='text-center text-xs text-white'>
          {"Don't have an account? "} <span className='text-xs font-bold cursor-pointer' onClick={() => router.push('/auth/signup')}>Sign Up</span></CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn