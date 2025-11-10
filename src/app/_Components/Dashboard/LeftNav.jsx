"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
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
  BadgeDollarSign,
  ChartBar,
  Mail,
  LayoutPanelTop,
  AtSign,
  List,
  Mails,
  Building,
  Link,
} from "lucide-react";
import { useGetSidebarTitleQuery } from "@/app/_Services/services/page";

const LeftNav = ({ set }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebars = [];
  const [expandedMenus, setExpandedMenus] = useState({});
  // const { data:sidebars, error, isLoading } = useGetSidebarTitleQuery();
  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: ["/dashboard/dashboardcount"],
    },
    {
      name: "Department",
      icon: <Building className="w-5 h-5" />,
      path: ["/dashboard/department"],
    },
    {
      name: "Brand",
      icon: <Home className="w-5 h-5" />,
      path: ["/dashboard/brand"],
    },
    {
      name: "Employee",
      icon: <Users className="w-5 h-5" />,
      path: ["/dashboard/employee"],
    },
    {
      name: "Client",
      icon: <User className="w-5 h-5" />,
      path: ["/dashboard/client"],
    },
    {
      name: "leads",
      icon: <ChartBar className="w-5 h-5" />,
      path: ["/dashboard/lead"],
    },
    {
      name: "Payment Link",
      icon: <Link className="w-5 h-5" />,
      path: ["/dashboard/paymentLink","/dashboard/createLeadPayment","/dashboard/createPaymentLink"],
      
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      path: [
        "/dashboard/EmailTemplate",
        "/dashboard/BrandEmail",
        "/dashboard/SendEmail",
        "/dashboard/EmailList",
        "/dashboard/BulkEmail",
        "/dashboard/SentBulkEmail",
      ],
      submenu: [
        {
          name: "Brand Email",
          path: "/dashboard/BrandEmail",
          icon: <AtSign className="w-4 h-4" />,
        },
        {
          name: "Email Template",
          path: "/dashboard/EmailTemplate",
          icon: <LayoutPanelTop className="w-4 h-4" />,
        },
        {
          name: "Email List",
          path: "/dashboard/EmailList",
          icon: <List className="w-4 h-4" />,
        },
        {
          name: "Bulk Email",
          path: "/dashboard/BulkEmail",
          icon: <Mails className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Sales",
      icon: <BadgeDollarSign className="w-5 h-5" />,
      path: ["/dashboard/sale"],
    },
    // {
    //   name: "My Auction",
    //   icon: <Home className="w-5 h-5" />,
    //   path: [
    //     "/dashboard/Bidding",
    //     "/dashboard/wonitem",
    //     "/dashboard/lostitem",
    //     "/dashboard/wishlist",
    //   ],
    // },
    // {
    //   name: "Purchase",
    //   icon: <ShoppingCart className="w-5 h-5" />,
    //   path: [
    //     "/dashboard/paidItem",
    //     "/dashboard/unpaidItem",
    //     "/dashboard/penalizedItem",
    //   ],
    // },
    // {
    //   name: "Appointments",
    //   icon: <Calendar className="w-5 h-5" />,
    //   path: ["/dashboard/appointment"],
    // },
    // {
    //   name: "My Store",
    //   icon: <Store className="w-5 h-5" />,
    //   path: user?.isStore
    //     ? [
    //         "/dashboard/myItem",
    //         "/dashboard/createListing",
    //         "/dashboard/box",
    //         "/dashboard/pickupdropoff",
    //       ]
    //     : ["/dashboard/myItem"],
    //   submenu: user?.isStore
    //     ? [
    //         { name: "Store Item", path: "/dashboard/myItem" },
    //         { name: "Create Listing", path: "/dashboard/createListing" },
    //         { name: "Send a Box", path: "/dashboard/box" },
    //         { name: "Pickup & Drop Off", path: "/dashboard/pickupdropoff" },
    //       ]
    //     : [{ name: "Store Item", path: "/dashboard/myItem" }],
    // },
    // {
    //   name: "Wallet",
    //   icon: <Wallet className="w-5 h-5" />,
    //   path: [
    //     "/dashboard/wallet/walletDashboard",
    //     "dashboard/wallet/ManageCard",
    //   ],
    //   submenu: [
    //     { name: "Wallet Dashboard", path: "/dashboard/wallet/walletDashboard" },
    //     { name: "Manage Card", path: "/dashboard/wallet/ManageCard" },
    //   ],
    // },
    // {
    //   name: "Notification",
    //   icon: <Bell className="w-5 h-5" />,
    //   path: ["/dashboard/notification"],
    // },
    {
      name: "My Account",
      icon: <User className="w-5 h-5" />,
      path: ["/dashboard/profile", "/dashboard/changepassword"],
    },
    // {
    //   name: "Refer a Friend",
    //   icon: <Users className="w-5 h-5" />,
    //   path: ["/dashboard/refferal"],
    // },
    // {
    //   name: "Fees",
    //   icon: <DollarSign className="w-5 h-5" />,
    //   path: [
    //     "/dashboard/UnpaidItem",
    //     "/dashboard/missedAppointment",
    //     "/dashboard/penalizedFeeProduct",
    //   ],
    // },
    // {
    //   name: "Help",
    //   icon: <HelpCircle className="w-5 h-5" />,
    //   path: ["/dashboard/contactform", "/dashboard/response"],
    // },
  ];

  const handleLogout = () => {
    if (set) {
      set();
    }
    Cookies.remove("token");
    Cookies.remove("currentuser");
    router.push("/");
  };

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isMenuActive = (paths) => {
    return paths.some((path) => pathname.startsWith(path));
  };

  const isSubmenuActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="h-full bg-white overflow-y-auto m-0 md:m-4 shadow-xl rounded-2xl border border-gray-100">
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <span className="text-[#5f2781] font-bold text-xl">Dashboard</span>
        </div>
      </div> */}

      <div className="py-2">
        {menuItems.map((item, index) => {
          const isActive = isMenuActive(item.path);
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus[index] || isActive;

          return (
            <div key={index} className="mb-0">
              <div
                onClick={() => {
                  if (hasSubmenu) {
                    toggleSubmenu(index);
                  } else {
                    router.push(item.path[0]);
                    if (set) {
                      set();
                    }
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-[#f7f7f7] text-[#5f2781] border-l-4 border-[#5f2781]"
                    : "text-gray-700 hover:bg-[#f7f7f7] hover:text-[#5f2781]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={isActive ? "text-[#5f2781]" : "text-gray-500"}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">
                    {sidebars?.data?.[index]?.title ?? item?.name}
                  </span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                {hasSubmenu && (
                  <span className="text-gray-400">
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="bg-gray-50 pl-6 pr-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => {
                        if (set) {
                          set();
                        }
                        router.push(subItem.path);
                      }}
                      className={`flex gap-2 py-2 px-3 text-[12px] font-medium cursor-pointer transition-colors hover:bg-white ${
                        isSubmenuActive(subItem.path)
                          ? "text-[#5f2781] font-medium"
                          : "text-gray-600 hover:text-[#5f2781]"
                      }`}
                    >
                      {" "}
                      <span
                        className={
                          isSubmenuActive(subItem.path)
                            ? "text-[#5f2781]"
                            : "text-gray-500"
                        }
                      >
                        {subItem.icon}
                      </span>
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-4 text-[#5f2781] hover:b-[#4f1f6d] cursor-pointer transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
