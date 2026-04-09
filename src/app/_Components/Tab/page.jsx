"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Tab = ({ tabs }) => {
  const pathname = usePathname();

  return (

       <div className="flex flex-wrap gap-1">
          <div className="flex bg-white rounded-full shadow-sm p-1">
            {tabs?.map((tab) => {
                        const isActive = pathname === tab.path;
          return (
              <Link href={tab.path} key={tab.path} passHref>
               <div
                 className={`relative rounded-full mx-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                   isActive
                     ? "text-white"
                     : "text-gray-600 hover:bg-zinc-800 hover:bg-gray-100"
                 }`}
               >
                 {isActive && (
                   <motion.div
                     layoutId="activeTabBackground"
                     className="absolute inset-0 bg-zinc-800 rounded-full"
                     initial={false}
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <span className="relative flex items-center gap-1">
                   {tab.icon}
                   {tab.name}
                 </span>
               </div>
             </Link>
              )
            })}
          </div>
        </div>
  );
};

export default Tab;
