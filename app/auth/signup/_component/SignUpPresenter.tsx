"use client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Dispatch, SetStateAction} from "react";
import {router} from "next/client";
import {IUser} from "@/server/models/user/user.interfce";
import {IError} from "@/server/interface/error.interface";
import Loader from "@/components/loader/Loader";

interface Props {
    signUp: () => Promise<IUser | null>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    loading: boolean;
    error: IError;
}

export default function SignUpPresenter ( props: Props ) {

    const {
        signUp,
        email,
        setEmail,
        name,
        setName,
        password,
        setPassword,
        loading,
        error,
    } = props;

    return (
        <div className="flex items-center justify-center h-screen shadow-xl shadow-black">

            {/* Loading added */}
            { loading && <Loader size={"lg"} overlay={true} message={"Loading..."} /> }

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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
                    />
                    { error.field == "name" && (<span className={"text-red-500 text-xs font-semibold"}>{error.message}</span>)}

                    <label htmlFor="email" className="text-white text-sm">
                        Email Address
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
                    />
                    { error.field == "email" && (<span className={"text-red-600 text-xs font-semibold"}>{error.message}</span>)}

                    <label htmlFor="password" className="text-white text-sm">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="w-full p-2 border border-white rounded-md focus:outline-amber-200 focus:outline-1 placeholder:text-white placeholder:font-light text-white"
                    />
                    { error.field == "password" && (<span className={"text-red-600 text-xs font-semibold"}>{error.message}</span>)}

                </CardContent>

                <CardFooter className="gap-3 grid">
                    <Button
                        variant="outline"
                        className="w-full bg-black text-white border-0 text-xs placeholder:text-white placeholder:font-light"
                        onClick={() => signUp()}
                    >
                        Create Account
                    </Button>

                    {/*<Button*/}
                    {/*    variant="outline"*/}
                    {/*    className="w-full bg-white text-black border-0 text-xs"*/}
                    {/*>*/}
                    {/*    Continue With Google*/}
                    {/*</Button>*/}

                    <CardDescription className="text-center text-xs text-white">
                        Already have an account?{" "}
                        <span
                            className="text-xs font-bold cursor-pointer underline"
                            onClick={() => router.push("/auth/signin")}
                        >
                          Log In
                        </span>
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}