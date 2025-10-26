"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";
import {isAuthenticatedAndGetUser} from "@/server/functions/auth.fun";
import {IUser} from "@/server/models/user/user.interfce";
import {getCookie, setCookie} from "@/server/helper/jwt.helper";

const TopBar = () => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        ;( async ()=> {
            const cookie = await getCookie("user");
            if (typeof cookie == 'string' ) return setUser( JSON.parse(cookie) );
            else {
                const res = await isAuthenticatedAndGetUser();
                if ( typeof res != "string" && res.isError == true) {
                    console.log(res);
                    setUser(null)
                    return;
                } else if ( typeof res == "string" ) {
                    await setCookie({name:"user", value: res });
                    setUser(JSON.parse(res));
                    return;
                }
            }
        })()
    }, []);

  return (
    <div className="w-full bg-[#222222]">
      <div className=" text-white sm:text-xs text-[7px] py-2 px-4 flex justify-end items-center max-w-[1540px] mx-auto">
        {/* Left links */}
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:underline border-r pr-3">
            Privacy & Return Policy
          </Link>
          <Link href="/track-order" className="hover:underline border-r pr-3 mr-3">
            Track Order
          </Link>
        </div>

        {/* Right links */}
        <div className="flex gap-3">
            {
                user?
                    (
                        <Link href="/profile" className="hover:underline" title={"Profile"}>
                            <UserCircle size={16} />
                        </Link>
                    )   :
                    (
                        <>
                          <Link href="/auth/signin" className="hover:underline">
                            Sign In
                          </Link>
                          <span>/</span>
                          <Link href="/auth/signup" className="hover:underline">
                            Sign Up
                          </Link>
                        </>
                    )
            }
        </div>
      </div>
    </div>
  );
};

export default TopBar;
