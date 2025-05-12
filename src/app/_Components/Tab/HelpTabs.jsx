"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { HelpCircle, MessageSquare } from "lucide-react"

const HelpTabs = ({ activeTab }) => {
  return (
    <div className="relative flex ">
      <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
        <Link href="/dashboard/contactform" passHref>
          <div
            className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === "contact" ? "text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {activeTab === "contact" && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-[#F33E0A] rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </span>
          </div>
        </Link>

        <Link href="/dashboard/response" passHref>
          <div
            className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === "response" ? "text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {activeTab === "response" && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-[#F33E0A] rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              My Queries
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default HelpTabs
