import React from 'react'
import createMetaData from 'helper/createMetaData'
import { Metadata } from 'next';
import SignInContainer from '../_components/_signIn/SignInContainer';

export const metadata: Metadata = createMetaData({
    title: "Sign In",
    description: "Sign In",
    keywords: ["Sign In", "Sign In Page", "Sign In Page"],
    authors: [{ name: "Gym Shop", url: "https://gymshop.com" }],
    openGraph: {
        title: "Sign In",
        description: "Sign In",
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

export default function SignInPage() {

  return <SignInContainer />
}
