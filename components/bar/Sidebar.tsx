"use client";
import {Contact2, LogOut, Package2, User} from "lucide-react";
import { BiSolidOffer } from "react-icons/bi";
import { FaTeamspeak } from "react-icons/fa";
import { FcAbout, FcPrivacy } from "react-icons/fc";
import { GrDashboard } from "react-icons/gr";
import { MdProductionQuantityLimits } from "react-icons/md";
import { PiFlagBanner } from "react-icons/pi";
import { TbBrandBing } from "react-icons/tb";

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar ({activeTab, setActiveTab}: Props) {

    const tabs = [
        {
            title: "Overview",
            icon: GrDashboard
        },
        {
            title: "Hero",
            icon: PiFlagBanner
        },
        {
            title: "Offer",
            icon: BiSolidOffer
        },
        {
            title: "Products",
            icon: MdProductionQuantityLimits
        },
        {
            title: "PersonalTraining",
            icon: TbBrandBing
        },
        {
            title: "PackageManagement",
            icon: Package2
        },
        {
            title: "AboutMe",
            icon: FcAbout
        },
        {
            title: "OurTeam",
            icon: FaTeamspeak
        },
        {
            title: "PrivacyPolicy",
            icon: FcPrivacy
        },
        {
            title: "Contact",
            icon: Contact2
        },
        {
            title: "User",
            icon: User
        },
    ]

    return (
        <div className={"w-[400px] h-full flex justify-center items-center relative"}>
            <div className="w-[230px] md:w-[260px] xl:w-[300px] h-[95%] bg-white rounded-3xl relative flex flex-col items-end pt-[16px]">
                {
                    tabs.map((Item, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveTab(Item.title)}
                            className={ Item.title == activeTab ? `text-white h-[50px] w-[95%] rounded-bl-full rounded-tl-full bg-[#125BAC] flex justify-start items-center gap-2 pl-4 cursor-pointer duration-200 ease-in-out` : `text-[#125BAC] h-[50px] w-[95%] rounded-bl-full rounded-tl-full flex justify-start items-center gap-2 pl-4 cursor-pointer duration-200 ease-in-out` }
                        >
                            <Item.icon />
                            <span className="font-bold text-sm">{Item.title}</span>
                        </div>
                    ))
                }
            </div>
            {/* Logout button */}
            <div className={"absolute cursor-pointer bottom-9 left-9 text-[#125BAC] flex gap-2"}>
                <LogOut />
                <span>Logout</span>
            </div>
        </div>
    )
}