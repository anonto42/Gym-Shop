import React from 'react'
import createMetaData from 'helper/createMetaData'
import { Metadata } from 'next';
import AuthContainer from '../_components/AuthContainer';

export const metadata: Metadata = createMetaData({
    title: "Forgot Password",
    description: "Forgot Password",
    keywords: ["Forgot Password", "Forgot Password Page", "Forgot Password Page"],
    authors: [{ name: "Gym Shop", url: "https://gymshop.com" }],
    openGraph: {
        title: "Forgot Password",
        description: "Forgot Password",
        url: "https://gymshop.com",
        siteName: "Gym Shop",
        images: [
            {
                url: "https://gymshop.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "Gym Shop",
            },
        ],
    },
});

export default function ForgotPasswordPage() {

  return <AuthContainer page='forgot-password' />
}
