import React from 'react'
import createMetaData from 'helper/createMetaData'
import { Metadata } from 'next';
import AuthContainer from '../_components/AuthContainer';

export const metadata: Metadata = createMetaData({
    title: "Set Password",
    description: "Set Password",
    keywords: ["Set Password", "Set Password Page", "Set Password Page"],
    authors: [{ name: "Gym Shop", url: "https://gymshop.com" }],
    openGraph: {
        title: "Set Password",
        description: "Set Password",
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

export default function SetPasswordPage() {

  return <AuthContainer page='set-password' />
}
