"use client"; // Next.js 13+ के लिए

import React from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "APPOINTMENTS", path: "/dashboard" },
  { name: "WON ITEMS ", path: "/dashboard/wonitem" },
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
  { name: "LOG OUT", path: "/dashboard" },
];

const HeadingDashboard = () => {
  const pathname = usePathname(); 
  const matchedItem = menuItems.find((item) => item.path === pathname);
  const heading = matchedItem ? matchedItem.name : "HOME / DASHBOARD";

  return (
    <div className="container px-10 border-b border-[#DDDDDD] mx-auto my-10 pb-5">
      <h1 className="text-[#999999] text-sm montserrat">{heading}</h1>
      <h3 className="text-[#242424] text-[20px] font-extrabold montserrat">{heading}</h3>
    </div>
  );
};

export default HeadingDashboard;
