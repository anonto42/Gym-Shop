"use client";

import SignUpPresenter from "@/app/auth/signup/_component/SignUpPresenter";
import {useState} from "react";
import {IUser} from "@/server/models/user/user.interfce";
import {signUpServerSide} from "@/server/functions/auth.fun";
import {IError} from "@/server/interface/error.interface";
import {ISignUpInput} from "@/server/interface/auth.interface";
import {toast} from "sonner";

export default function SignUpContainer () {

    // Stats
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError>({field: null, message: null});
    const [name, setName] = useState("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Function
    const signUp = async (): Promise<IUser | null> => {

        setLoading(true);

        if(name.trim() === "") {
            setError({field: "name", message: "Name is required"});
            setLoading(false);
            return null;
        }
        if(email.trim() === "") {
            setError({field: "email", message: "Email is required"});
            setLoading(false);
            return null;
        }
        if(password.trim() === "") {
            setError({field: "password", message: "Password is required"});
            setLoading(false);
            return null;
        }

        const formData = new FormData() as FormData & ISignUpInput ;

        // Form data appended
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name);

        setName("");
        setEmail("");
        setPassword("");

        const user = await signUpServerSide(formData);

        setLoading(false);

        toast.success('Account created successfully!', {
            description: 'Welcome to our platform!',
        });

        return user
    }

    return <SignUpPresenter
        signUp={signUp}
        name={name}
        email={email}
        password={password}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        error={error}
    />
}