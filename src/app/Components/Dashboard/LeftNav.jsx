"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const LeftNav = () => {
  const pathname = usePathname();
  const router = useRouter(); 

  const menuItems = [
    { name: "APPOINTMENTS", path: "/dashboard" },
    { name: "WON ITEMS (0)", path: "/dashboard/wonitem" },
    { name: "WATCHLIST", path: "/dashboard/watchlist" },
    { name: "MY INVENTORY", path: "/dashboard/inventory" },
    { name: "PURCHASES HISTORY", path: "/purchases" },
    { name: "MY EARNINGS ($0)", path: "/dashboard/earnings" },
    { name: "WALLET", path: "/dashboard/wallet" },
    { name: "NOTIFICATIONS", path: "/notifications" },
    { name: "FEES & OPEN INVOICES (0)", path: "/fees" },
    { name: "SAVED SEARCHES", path: "/saved-searches" },
    { name: "RECEIPTS", path: "/receipts" },
    { name: "MY ACCOUNT", path: "/dashboard/account" },
    { name: "ACCOUNT", path: "/dashboard/account2" },
    { name: "LOG OUT", path: "/dashboard/logout" },
  ];

  return (
    <div className="w-1/4 text-white">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.path;

        return (
          <div
            key={index}
            onClick={() => router.push(item.path)}
            className={`p-3 pl-5 text-sm font-semibold cursor-pointer transition-all montserrat duration-200 
            ${isActive ? "bg-white text-[#F33E0A]" : " bg-[#F33E0A]"}`}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default LeftNav;
