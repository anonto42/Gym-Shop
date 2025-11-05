"use client";
import { lazy, useState } from "react";
import Navbar from "../bar/Navbar";
import Sidebar from "../bar/Sidebar";

// Lazy load the tabs
const OverviewTab = lazy(() => import("../tabs/Overview"));
const Hero = lazy(() => import("../tabs/Hero"));
const Offer = lazy(() => import("../tabs/Offer"));
const Products = lazy(() => import("../tabs/Products"));
const PersonalTraining = lazy(() => import("../tabs/PersonalTraining"));
const PackageManagement = lazy(() => import("../tabs/PackageManagement"));
const AboutMe = lazy(() => import("../tabs/AboutMe"));
const OurTeam = lazy(() => import("../tabs/OurTeam"));
const UserTab = lazy(() => import("../tabs/User"));
const PrivacyPolicy = lazy(() => import("../tabs/PrivacyPolicy"));
const Contact = lazy(() => import("../tabs/Contact"));

export default function DashboardLayout () {

    const [activeTab, setActiveTab] = useState<string>("Overview");

    return (
        <main className={"w-full h-[88vh]"}>
            <Navbar />
            <div className={"w-full h-full flex"}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
                <div className={"w-full h-full overflow-auto"}>
                    { 
                        activeTab == "Overview" ? <OverviewTab /> :
                        activeTab == "Hero" ? <Hero /> :
                        activeTab == "Offer" ? <Offer /> :
                        activeTab == "Products" ? <Products /> :
                        activeTab == "Personal Training" ? <PersonalTraining /> :
                        activeTab == "Package Management" ? <PackageManagement /> :
                        activeTab == "AboutMe" ? <AboutMe /> :
                        activeTab == "OurTeam" ? <OurTeam /> :
                        activeTab == "Contact" ? <Contact /> :
                        activeTab == "User" ? <UserTab /> :
                        activeTab == "PrivacyPolicy" ? <PrivacyPolicy /> :
                        <h1>Not Found</h1> 
                    }
                </div>
            </div>
        </main>
    )
}