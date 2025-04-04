"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LeftNav = () => {
  const pathname = usePathname();
  const router = useRouter(); 

  const menuItems = [
    // { name: "APPOINTMENTS", path: "/dashboard" },
    { name: "WISHTLIST", path: "/dashboard/wishlist" },
    { name: "WON ITEMS ", path: "/dashboard/wonitem" },
    // { name: "MY INVENTORY", path: "/dashboard/inventory" },
    // { name: "PURCHASES HISTORY", path: "/purchases" },
    // { name: "MY EARNINGS ($0)", path: "/dashboard/earnings" },
    // { name: "WALLET", path: "/dashboard/wallet" },
    // { name: "NOTIFICATIONS", path: "/notifications" },
    // { name: "FEES & OPEN INVOICES (0)", path: "/fees" },
    // { name: "SAVED SEARCHES", path: "/saved-searches" },
    // { name: "RECEIPTS", path: "/receipts" },
    // { name: "MY ACCOUNT", path: "/dashboard/account" },
    // { name: "ACCOUNT", path: "/dashboard/account2" },
    // { name: "LOG OUT", path: "/" },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("currentuser");
    router.push("/"); 
  };

  return (
    <div className="w-1/5 text-white bg-[#F33E0A]">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.path;

        return (
          <div
            key={index}
            onClick={() => {
              if (item.name === "LOG OUT") {
                handleLogout();
              } else {
                router.push(item.path);
              }
            }}
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
