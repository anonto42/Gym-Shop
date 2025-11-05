"use client";
import {useState} from "react";
import Navbar from "../bar/Navbar";
import Sidebar from "../bar/Sidebar";
import OverviewTab from "../tabs/Overview";
import Hero from "../tabs/Hero";
import Offer from "../tabs/Offer";
import Products from "../tabs/Products";
import PersonalTraining from "./PersonalTraining";
import PackageManagement from "../tabs/PackageManagement";
import AboutMe from "../tabs/AboutMe";
import OurTeam from "../tabs/OurTeam";
import UserTab from "../tabs/User";
import PrivacyPolicy from "../tabs/PrivacyPolicy";
import Contact from "../tabs/Contact";

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
                    activeTab == "PersonalTraining" ? <PersonalTraining /> :
                    activeTab == "PackageManagement" ? <PackageManagement /> :
                    activeTab == "AboutMe" ? <AboutMe /> :
                    activeTab == "OurTeam" ? <OurTeam /> :
                    activeTab == "Contact" ? <Contact /> :
                    activeTab == "User" ? <UserTab /> :
                    activeTab == "PrivacyPolicy" ? <PrivacyPolicy /> :
                    <h1>Not Found</h1> }
                </div>
            </div>
        </main>
    )
}