'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const Tab = ({tabs}) => {

      const pathname = usePathname();



    return (
        <div className="relative flex justify-Start ">
      <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path

          return (
            <Link href={tab.path} key={tab.path} passHref>
              <div
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-[#F33E0A] rounded-full"
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
    </div>)
}

export default Tab