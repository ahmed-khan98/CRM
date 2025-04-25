"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LeftNav = () => {
  const pathname = usePathname();
  const router = useRouter(); 

  const menuItems = [
    { name: "My Auction", path: ["/dashboard/wishlist", "/dashboard/wonitem","/dashboard/lostitem"],    },
    { name: "Purchase", path: ["/dashboard/paidItem",'/dashboard/unpaidItem','/dashboard/penalizedItem'] },
    { name: "Appointments", path: ["/dashboard/upcomingItem",'/dashboard/missedItem'] },
    { name: "My Store", path: "/dashboard/earnings" },
    { name: "Wallet", path: "/dashboard/wallet" },
    // { name: "NOTIFICATIONS", path: "/notifications" },
    // { name: "FEES & OPEN INVOICES (0)", path: "/fees" },
    // { name: "SAVED SEARCHES", path: "/saved-searches" },
    // { name: "RECEIPTS", path: "/receipts" },
    { name: "My Account", path: ["/dashboard/profile","/dashboard/changepassword"] },
    { name: "Refer a Freind", path: "/dashboard/account2" },
    { name: "Fees (0)", path: "/dashboard/account2" },
    { name: "Help", path: ["/dashboard/contactform"] },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("currentuser");
    router.push("/"); 
  };

  return (
    <div className="w-1/4 text-white bg-[#F33E0A]">
      {menuItems.map((item, index) => {
        const isActive = item.path.includes(pathname);

        return (
          <div
            key={index}
            onClick={() => {
              if (item.name === "LOG OUT") {
                handleLogout();
              } else {
                router.push(item.path[0]);
              }
            }}
            className={`p-3 pl-5 text-sm font-semibold cursor-pointer transition-all  duration-200 
            ${isActive  ? "bg-white text-[#F33E0A] border border-red-500" : " bg-[#F33E0A]"}`}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default LeftNav;
