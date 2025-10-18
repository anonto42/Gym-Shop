import type { Metadata } from 'next';
import SignUpContainer from "@/app/auth/signup/_component/SignUpContainer";

export const metadata: Metadata = {
    title: "SignUp",
    description: "SignUp page",
}

const SignUpPage = () => <SignUpContainer />;

export default SignUpPage;
