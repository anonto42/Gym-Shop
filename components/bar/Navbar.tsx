import { User } from "lucide-react";

export default function Navbar () {

    return (
        <nav className={"w-full h-[80px] border-b border-black bg-white"}>
            <div className={"w-full h-full px-6 mx-auto flex justify-between items-center"}>
                <div className={"w-[248px] h-[64px] flex justify-center items-center"}>
                    {/* <ImageWithSkeleton src={Logo} /> */}
                    <h1 className="text-3xl font-bold text-[#125BAC] cursor-pointer">Logo</h1>
                </div>
                <div>
                    <div className="p-2 border rounded-full bg-blue-100 cursor-pointer">
                        <User className="text-[#125BAC]" size={30} />
                    </div>
                </div>
            </div>
        </nav>
    )
}