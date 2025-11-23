"use client"

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {useEffect} from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Gym Shop",
//   description: "Gym Shop",
// };

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    // Remove extension-added attributes on client side
    useEffect(() => {
        // Remove attributes that cause hydration mismatch
        document.body.removeAttribute('cz-shortcut-listen');
        document.body.removeAttribute('data-new-gr-c-s-check-loaded');
        document.body.removeAttribute('data-gr-ext-installed');
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning
        >
            <TopBar />
            <Navbar />
            <main className="w-full h-full pt-[55px]">{children}</main>
            <Footer />
        </body>
        </html>
    );
}

