"use client"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, Award, XCircle, ShoppingBag, Clock } from "lucide-react"
import Link from "next/link"

const AuctionTab = () => {
  const pathname = usePathname()

  const tabs = [
    {
      path: "/dashboard/wishlist",
      name: "Wishlist",
      icon: <Heart className="h-4 w-4" />,
      color: "#0578ff", // Indigo
    },
    {
      path: "/dashboard/wonitem",
      name: "Won",
      icon: <Award className="h-4 w-4" />,
      color: "#10B981", // Green
    },
    {
      path: "/dashboard/lostitem",
      name: "Lost",
      icon: <XCircle className="h-4 w-4" />,
      color: "#EF4444", // Red
    },

  ]
  return (
    <div className="relative flex justify-start md:pl-8">
      <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path

          return (
            <Link href={tab.path} key={tab.path} passHref>
              <div
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className={`absolute inset-0 rounded-full`}
                    style={{ backgroundColor: tab.color }}
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
          )
        })}
      </div>
    </div>
  )
}

export default AuctionTab
