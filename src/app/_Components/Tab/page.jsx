"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Tab = ({ tabs, variant = "light" }) => {
  const pathname = usePathname();
  const isDark = variant === "dark";

  return (
    <div className="flex flex-wrap gap-1">
      <div
        className={`flex rounded-full p-1 ${
          isDark
            ? "border border-white/[0.08] bg-[#121212] shadow-sm"
            : "bg-white shadow-sm"
        }`}
      >
        {tabs?.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link href={tab.path} key={tab.path} passHref>
              <div
                className={`relative rounded-full mx-0.5 px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? "text-zinc-100"
                      : "text-white"
                    : isDark
                      ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                      : "text-gray-600 hover:bg-zinc-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={isDark ? "activeTabBackgroundDark" : "activeTabBackground"}
                    className={`absolute inset-0 rounded-full ${
                      isDark ? "bg-white/[0.1] border border-white/10" : "bg-zinc-800"
                    }`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.icon}
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Tab;
