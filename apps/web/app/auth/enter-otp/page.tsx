import React from 'react'
import createMetaData from 'helper/createMetaData'
import { Metadata } from 'next';
import AuthContainer from '../_components/AuthContainer';

export const metadata: Metadata = createMetaData({
    title: "Enter OTP",
    description: "Enter OTP",
    keywords: ["Enter OTP", "Enter OTP Page", "Enter OTP Page"],
    authors: [{ name: "Gym Shop", url: "https://gymshop.com" }],
    openGraph: {
        title: "Enter OTP",
        description: "Enter OTP",
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

export default function EnterOtpPage() {

  return <AuthContainer page='enter-otp' />
}
