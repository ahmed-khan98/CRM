'use client'
import React from 'react'
import { usePathname, useRouter } from "next/navigation";


const PurchaseTab = () => {

      const pathname = usePathname();
        const router = useRouter(); 

    const tabs = [
        { path: "/dashboard/paidItem", label: "Paid", color: "bg-blue-500" },
        { path: "/dashboard/unpaidItem", label: "Un Paid", color: "bg-yellow-400" },
        { path: "/dashboard/penalizedItem", label: "Penalized", color: "bg-red-500" },
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

export default PurchaseTab