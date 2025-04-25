'use client'
import React from 'react'
import { usePathname, useRouter } from "next/navigation";


const AuctionTab = () => {

      const pathname = usePathname();
        const router = useRouter(); 

    const tabs = [
        { path: "/dashboard/wishlist", label: "Wishlist", color: "bg-blue-500" },
        { path: "/dashboard/wonitem", label: "Won", color: "bg-green-500" },
        { path: "/dashboard/lostitem", label: "Lost", color: "bg-red-500" },
    ];

    return (
        <div className="flex gap-1 my-2 w-full mx-6">
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    onClick={() =>router.push(tab.path)}
                    className={`w-[18%] px-4 py-2 font-semibold flex items-center justify-center rounded-tl-lg rounded-tr-lg shadow-lg text-white cursor-pointer ${pathname === tab.path? `border-1 border-black ${tab.color}`
                        : `${tab.color}`
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>)
}

export default AuctionTab