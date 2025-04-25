'use client'
import React from 'react'
import { usePathname, useRouter } from "next/navigation";


const MyAccountTab = () => {

      const pathname = usePathname();
        const router = useRouter(); 

    const tabs = [
        { path: "/dashboard/profile", label: "Profile ", color: "bg-blue-500" },
        { path: "/dashboard/changepassword", label: "Change Password", color: "bg-green-400" },
    ];

    return (
        <div className="flex gap-1 my-2 w-full mx-6">
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    onClick={() =>router.push(tab.path)}
                    className={`w-[18%] px-4 py-2 font-semibold flex items-center justify-center rounded-tl-lg rounded-tr-lg shadow-lg text-white cursor-pointer ${pathname === tab.path
                        ? `border-1 border-black ${tab.color}`
                        : `${tab.color}`
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>)
}

export default MyAccountTab