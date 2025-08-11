"use client"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

const FeeTab = () => {
  const pathname = usePathname()

  const tabs = [
    {
      path: "/dashboard/UnpaidItem",
      name: "Unpaid Items",
    },
    {
      path: "/dashboard/missedAppointment",
      name: "Missed Appointment",
    },
    {
      path: "/dashboard/penalizedFeeProduct",
      name: "Penalized Product Fee",
    },
    {
      path: "/dashboard/lostitem",
      name: "Invoices",
    }

  ]

  return (
    <div className="relative flex justify-start md:pl-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 bg-white rounded-2xl md:rounded-full p-1.5 shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path

          return (
            <Link href={tab.path} key={tab.path} passHref>
              <div
                className={`relative rounded-full px-5 py-2.5 sm:my-4 md:my-0 text-sm font-medium transition-all duration-200 ${
                  isActive ? " text-white  shadow-md" : "text-gray-600 hover:bg-gray-100 "
                  // isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className={`absolute inset-0 rounded-full bg-red-600`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
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

export default FeeTab
