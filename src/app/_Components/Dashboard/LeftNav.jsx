"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Home,
  Calendar,
  User,
  Users,
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
  MegaphoneIcon,
} from "lucide-react";
import { useLogoutMutation } from "@/app/_Services/authentication/page";
import toast from "react-hot-toast";
import { removeAttendence, resumeWork } from "@/redux/filterSlice";
import { useDispatch } from "react-redux";

const LeftNav = ({ set }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const sidebars = [];
  const [expandedMenus, setExpandedMenus] = useState({});
  const [logout, { isLoading: isSubmitting }] = useLogoutMutation();

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
      name: "Announcement",
      icon: <MegaphoneIcon className="w-5 h-5" />,
      path: ["/dashboard/announcement"],
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
      path: [
        "/dashboard/paymentLink",
        "/dashboard/createLeadPayment",
        "/dashboard/createPaymentLink",
      ],
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      path: [
        "/dashboard/EmailTemplate",
        "/dashboard/BrandEmail",
        "/dashboard/SendEmail",
        "/dashboard/EmailList",
        "/dashboard/TmEmailList",
        "/dashboard/BulkEmail",
        "/dashboard/SentBulkEmail",
        "/dashboard/SentTMBulkEmail",
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
          name: "TM Email List",
          path: "/dashboard/TmEmailList",
          icon: <List className="w-4 h-4" />,
        },
        {
          name: "Bulk Email",
          path: "/dashboard/BulkEmail",
          icon: <Mails className="w-4 h-4" />,
        },
        {
          name: "TM Bulk Email",
          path: "/dashboard/TmBulkEmail",
          icon: <Mails className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Sales",
      icon: <BadgeDollarSign className="w-5 h-5" />,
      path: ["/dashboard/sale"],
    },
    {
      name: "My Account",
      icon: <User className="w-5 h-5" />,
      path: ["/dashboard/profile", "/dashboard/changepassword"],
    },
    {
      name: "Attendance",
      icon: <Calendar className="w-5 h-5" />,
      path: [
        "/dashboard/attendance",
        "/dashboard/attendance/departmentAttendence",
      ],
      submenu: [
        {
          name: "My Attendance",
          path: "/dashboard/attendance",
        },
        {
          name: "Team Attendance",
          path: "/dashboard/attendance/departmentAttendence",
        },
      ],
    },
  ];

  const USER_ALLOWED_TABS = [
    "Dashboard",
    "Client",
    "leads",
    "Email",
    "Payment Link",
    "Sales",
    "My Account",
    "Attendance",
  ];

  const SUBADMIN_ALLOWED_TABS = [
    "Dashboard",
    "Employees",
    "Brand",
    "Announcement",
    "Client",
    "leads",
    "Email",
    "Payment Link",
    "Sales",
    "My Account",
    "Attendance",
  ];

  const filteredMenuItems =
    user?.role === "USER"
      ? menuItems.filter((item) => USER_ALLOWED_TABS.includes(item.name))
      : user?.role === "SUBADMIN"
        ? menuItems.filter((item) => SUBADMIN_ALLOWED_TABS.includes(item.name))
        : menuItems;

  const clearExtensionAndRedirect = (response) => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.postMessage(
        {
          type: "LOGOUT",
        },
        "*",
      );
      router.push("/");
      // window.postMessage(
      //   // "ipmkoccmjmjepnnepibolhakgijemoed",
      //   { type: "LOGOUT",
      // userId: user._id,
      // token: accessToken, },
      //   "*",
      //   (res) => {
      //     console.log("SUCCESS! Extension replied:", res);
      //     // finalizeLogout(response.message);
      //     router.push("/");
      //   },
      // );
    } else {
      console.log("Chrome Extension API not found");
      // finalizeLogout(response.message);
      router.push("/");
    }
  };

  const finalizeLogout = (msg) => {
    console.log("Finalizing Logout - Removing Cookies...");
    Cookies.remove("token", { path: "/" });
    Cookies.remove("currentuser", { path: "/" });
    dispatch(resumeWork());
    dispatch(removeAttendence());
    toast.success(msg);
    clearExtensionAndRedirect();
  };

  const handleLogout = async () => {
    if (set) set();

    try {
      const response = await logout().unwrap();
      console.log(response, "response");
      if (response.statusCode === 200) {
        finalizeLogout(response?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
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
  <div className="h-full bg-zinc-900 overflow-y-auto mx-2 drop-shadow-xl rounded-2xl">
  <div className="py-2">
    {filteredMenuItems.map((item, index) => {
      const isActive = isMenuActive(item.path);
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isExpanded = expandedMenus[index] || isActive;

      return (
        <div key={index} className="mb-1 px-2"> {/* Added slight padding for floating effect */}
          <div
            onClick={() => {
              if (hasSubmenu) {
                toggleSubmenu(index);
              } else {
                router.push(item.path[0]);
                if (set) set();
              }
            }}
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-zinc-800/40 text-zinc-400 shadow-sm border border-zinc-800"
                : "text-zinc-300 hover:bg-zinc-800/40 hover:text-zinc-400"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={isActive ? "text-zinc-400" : " hover:text-zinc-400"}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">
                {sidebars?.data?.[index]?.title ?? item?.name}
              </span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] rounded-full border ">
                  {item.badge}
                </span>
              )}
            </div>
            {hasSubmenu && (
              <span className="text-zinc-600">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </div>

          {/* Submenu with darker contrast */}
          {hasSubmenu && isExpanded && (
            <div className="mt-1 ml-4 pl-4 pr-2 space-y-1">
              {item.submenu.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  onClick={() => {
                    if (set) set();
                    router.push(subItem.path);
                  }}
                  className={`flex gap-2 py-2 px-3 text-[12px] font-medium rounded-lg cursor-pointer transition-colors ${
                    isSubmenuActive(subItem.path)
                     ? "bg-zinc-800/40 text-zinc-800 shadow-sm border border-zinc-800"
                : "text-zinc-300 hover:bg-zinc-800/40 hover:text-zinc-400"
                  }`}
                >
                  <span className={isSubmenuActive(subItem.path) ? "text-zinc-300" : "hover:text-zinc-400"}>
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

    {/* Logout Button updated */}
    <div
      onClick={() => handleLogout()}
      className="flex items-center gap-3 px-6 py-3 mt-4 text-red-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all duration-200 rounded-xl mx-2"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-medium text-sm">Logout</span>
    </div>
  </div>
</div>
  );
};

export default LeftNav;
