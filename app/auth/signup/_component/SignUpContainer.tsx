"use client";

import SignUpPresenter from "@/app/auth/signup/_component/SignUpPresenter";
import {useState} from "react";
import {IUser} from "@/server/models/user/user.interfce";
import {signUpServerSide} from "@/server/functions/auth.fun";
import {IError} from "@/server/interface/error.interface";
import {ISignUpInput} from "@/server/interface/auth.interface";
import {toast} from "sonner";
import {IResponse} from "@/server/interface/response.interface";
import {isErrorResponse} from "@/server/helper/sendResponse.helper";
import {useRouter} from "next/navigation";

export default function SignUpContainer () {

    // Navigator
    const navigator = useRouter();

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

        const user: IUser | IResponse = await signUpServerSide(formData);

        if (isErrorResponse(user)) {
            toast.error(user.message);
            setLoading(false);
            return null;
        }

        setLoading(false);

        setName("");
        setEmail("");
        setPassword("");

        toast.success('Account created successfully!', {
            description: 'Welcome to our platform!',
        });

        navigator.push("/verify-opt")

        return user
    }

    return <SignUpPresenter
        signUp={signUp}
        router={navigator}
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