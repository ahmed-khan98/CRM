"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBox,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { PiHandWithdrawBold } from "react-icons/pi";

const LeftNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "DASHBOARD", path: "/vendors" },
    { name: "PRODUCTS", path: "/vendors/products", icon: <FaBox /> },
    { name: "ORDERS", path: "/dashboard/orders", icon: <FaShoppingCart /> },
    { name: "WITHDRAW", path: "/dashboard/withdraw", icon: <PiHandWithdrawBold /> },
    { name: "SETTINGS", path: "/dashboard/settings", icon: <FaCog /> },
  ];

  const bottomItems = [
    { icon: <FaExternalLinkAlt />, path: "/external" },
    { icon: <FaUser />, path: "/profile" },
    { icon: <FaSignOutAlt />, path: "/logout" },
  ];

  return (
    <div className="w-60 bg-zinc-800 text-white pbg-zinc-800 flex flex-col justify-between">
      <div>
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.path ||
            (item.name === "PRODUCTS" &&
              (pathname === "/vendors/products" || pathname === "/vendors/addproducts"));

          return (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className={`flex pl-8 items-center space-x-3 p-3 text-sm font-semibold cursor-pointer transition-all duration-200 
              ${isActive ? "bg-white text-gray-800" : "bg-zinc-800"}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          );
        })}

     
        <div className="flex justify-around border-t border-white pt-4">
          {bottomItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className="p-3 cursor-pointer text-2xl hover:text-gray-200 transition-all duration-200"
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
