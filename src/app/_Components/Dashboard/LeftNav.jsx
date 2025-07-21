"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {
  Home,
  ShoppingCart,
  Calendar,
  Store,
  Wallet,
  Bell,
  User,
  Users,
  DollarSign,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react"
import { useGetSidebarTitleQuery } from "@/app/_Services/services/page"

const LeftNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const sidebars=[]
  const [expandedMenus, setExpandedMenus] = useState({})
      // const { data:sidebars, error, isLoading } = useGetSidebarTitleQuery();
  console.log(sidebars,'sidebars')

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard  className="w-5 h-5" />,
      path: ["/dashboard/dashboardcount"],

    },
    {
      name: "My Auction",
      icon: <Home className="w-5 h-5" />,
      path: ["/dashboard/wishlist", "/dashboard/wonitem", "/dashboard/lostitem"],
    },
    {
      name: "Purchase",
      icon: <ShoppingCart className="w-5 h-5" />,
      path: ["/dashboard/paidItem", "/dashboard/unpaidItem", "/dashboard/penalizedItem"],
    },
    {
      name: "Appointments",
      icon: <Calendar className="w-5 h-5" />,
      path: ["/dashboard/appointment",],
      // submenu: [
      //   { name: "Upcoming", path: "/dashboard/upcomingItem" },
      //   { name: "Missed", path: "/dashboard/missedItem" },
      // ],
    },
    {
      name: "My Store",
      icon: <Store className="w-5 h-5" />,
      path: ["/dashboard/myItem"],
    },
    {
      name: "Wallet",
      icon: <Wallet className="w-5 h-5" />,
      path: ["/dashboard/wallet/walletDashbaord","dashboard/wallet/ManageCard"],
      submenu: [
        { name: "Wallet Dashbaord", path: "/dashboard/wallet/walletDashbaord" },
        { name: "Manage Card", path: "/dashboard/wallet/ManageCard" },
      ],
    },
    {
      name: "Notification",
      icon: <Bell className="w-5 h-5" />,
      path: ["/dashboard/notification"],
    },
    {
      name: "My Account",
      icon: <User className="w-5 h-5" />,
      path: ["/dashboard/profile", "/dashboard/changepassword"],
    },
    {
      name: "Refer a Friend",
      icon: <Users className="w-5 h-5" />,
      path: ["/dashboard/refferal"],
    },
    {
      name: "Fees",
      icon: <DollarSign className="w-5 h-5" />,
      path: ["/dashboard/UnpaidItem","/dashboard/missedAppointment",'/dashboard/penalizedFeeProduct'],
      // badge: "0",
    },
    {
      name: "Help",
      icon: <HelpCircle className="w-5 h-5" />,
      path: ["/dashboard/contactform", "/dashboard/response"],
    },
  ]

  const handleLogout = () => {
    Cookies.remove("token")
    Cookies.remove("currentuser")
    router.push("/")
  }

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const isMenuActive = (paths) => {
    return paths.some((path) => pathname.startsWith(path))
  }

  const isSubmenuActive = (path) => {
    return pathname === path
  }

  return (
    <div className="h-full bg-white overflow-y-auto m-0 md:m-4 shadow-md rounded-xl border border-gray-100">
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <span className="text-[#F33E0A] font-bold text-xl">Dashboard</span>
        </div>
      </div> */}

      <div className="py-2">
        {menuItems.map((item, index) => {
          const isActive = isMenuActive(item.path)
          const hasSubmenu = item.submenu && item.submenu.length > 0
          const isExpanded = expandedMenus[index] || isActive

          return (
            <div key={index} className="mb-0">
              <div
                onClick={() => {
                  if (hasSubmenu) {
                    toggleSubmenu(index)
                  } else {
                    router.push(item.path[0])
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-[#F33E0A] border-l-4 border-[#F33E0A]"
                    : "text-gray-700 hover:bg-orange-50 hover:text-[#F33E0A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-[#F33E0A]" : "text-gray-500"}>{item.icon}</span>
                  <span className="font-medium text-sm">{sidebars?.data?.[index]?.title ?? item?.name }</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                {hasSubmenu && (
                  <span className="text-gray-400">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="bg-gray-50 pl-12 pr-4">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => router.push(subItem.path)}
                      className={`py-2.5 px-3 text-sm cursor-pointer transition-colors ${
                        isSubmenuActive(subItem.path)
                          ? "text-[#F33E0A] font-medium"
                          : "text-gray-600 hover:text-[#F33E0A]"
                      }`}
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 cursor-pointer transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log Out</span>
        </div>
      </div>
    </div>
  )
}

export default LeftNav
