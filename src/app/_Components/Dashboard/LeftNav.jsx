"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Home, Calendar, User, Users, LogOut, ChevronRight, ChevronDown,
  LayoutDashboard, BadgeDollarSign, ChartBar, Mail, LayoutPanelTop,
  AtSign, List, Mails, Building, Link, MegaphoneIcon,
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
  const [logout] = useLogoutMutation();

  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: ["/dashboard/dashboardcount"] },
    { name: "Department", icon: <Building className="w-4 h-4" />, path: ["/dashboard/department"] },
    { name: "Brand", icon: <Home className="w-4 h-4" />, path: ["/dashboard/brand"] },
    { name: "Announcement", icon: <MegaphoneIcon className="w-4 h-4" />, path: ["/dashboard/announcement"] },
    { name: "Employee", icon: <Users className="w-4 h-4" />, path: ["/dashboard/employee"] },
    { name: "Client", icon: <User className="w-4 h-4" />, path: ["/dashboard/client"] },
    { name: "leads", icon: <ChartBar className="w-4 h-4" />, path: ["/dashboard/lead"] },
    {
      name: "Payment Link",
      icon: <Link className="w-4 h-4" />,
      path: ["/dashboard/paymentLink", "/dashboard/createLeadPayment", "/dashboard/createPaymentLink"],
    },
    {
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      path: ["/dashboard/EmailTemplate", "/dashboard/BrandEmail", "/dashboard/SendEmail", "/dashboard/EmailList", "/dashboard/TmEmailList", "/dashboard/BulkEmail", "/dashboard/SentBulkEmail", "/dashboard/SentTMBulkEmail"],
      submenu: [
        { name: "Brand Email", path: "/dashboard/BrandEmail", icon: <AtSign className="w-3.5 h-3.5" /> },
        { name: "Email Template", path: "/dashboard/EmailTemplate", icon: <LayoutPanelTop className="w-3.5 h-3.5" /> },
        { name: "Email List", path: "/dashboard/EmailList", icon: <List className="w-3.5 h-3.5" /> },
        { name: "TM Email List", path: "/dashboard/TmEmailList", icon: <List className="w-3.5 h-3.5" /> },
        { name: "Bulk Email", path: "/dashboard/BulkEmail", icon: <Mails className="w-3.5 h-3.5" /> },
        { name: "TM Bulk Email", path: "/dashboard/TmBulkEmail", icon: <Mails className="w-3.5 h-3.5" /> },
      ],
    },
    { name: "Sales", icon: <BadgeDollarSign className="w-4 h-4" />, path: ["/dashboard/sale"] },
    { name: "My Account", icon: <User className="w-4 h-4" />, path: ["/dashboard/profile", "/dashboard/changepassword"] },
    {
      name: "Attendance",
      icon: <Calendar className="w-4 h-4" />,
      path: ["/dashboard/attendance", "/dashboard/attendance/departmentAttendence"],
      submenu: [
        { name: "My Attendance", path: "/dashboard/attendance" },
        { name: "Team Attendance", path: "/dashboard/attendance/departmentAttendence" },
      ],
    },
  ];

  const USER_ALLOWED_TABS = ["Dashboard", "Client", "leads", "Email", "Payment Link", "Sales", "My Account", "Attendance"];
  const SUBADMIN_ALLOWED_TABS = ["Dashboard", "Employee", "Brand", "Announcement", "Client", "leads", "Email", "Payment Link", "Sales", "My Account", "Attendance"];

  const filteredMenuItems =
    user?.role === "USER"
      ? menuItems.filter((item) => USER_ALLOWED_TABS.includes(item.name))
      : user?.role === "SUBADMIN"
        ? menuItems.filter((item) => SUBADMIN_ALLOWED_TABS.includes(item.name))
        : menuItems;

  const clearExtensionAndRedirect = () => {
    if (typeof window !== "undefined" && window.chrome && window.chrome.runtime) {
      window.postMessage({ type: "LOGOUT" }, "*");
      router.push("/");
    } else {
      router.push("/");
    }
  };

  const finalizeLogout = (msg) => {
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
      if (response.statusCode === 200) finalizeLogout(response?.message);
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  const toggleSubmenu = (index) => setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  const isMenuActive = (paths) => paths.some((path) => pathname.startsWith(path));
  const isSubmenuActive = (path) => pathname === path;

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl mx-2 bg-zinc-950 border border-white/[0.07] ">
      {/* Top accent line */}
      <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/30 to-white/5" />

      {/* Scrollable nav */}
      <nav
        className="flex-1 overflow-y-auto py-2 px-2 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredMenuItems.map((item, index) => {
          const isActive = isMenuActive(item.path);
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus[index] || isActive;

          return (
            <div key={index} className="mb-[2px]">
              {/* Main row */}
              <div
                onClick={() => {
                  if (hasSubmenu) toggleSubmenu(index);
                  else { router.push(item.path[0]); if (set) set(); }
                }}
                className={`relative flex items-center justify-between px-3 py-[9px] cursor-pointer rounded-xl border transition-all duration-150 group
                  ${isActive
                    ? "bg-white/[0.09] border-white/[0.12]"
                    : "border-transparent hover:bg-white/[0.04]"
                  }`}
              >
                {/* Active left pill */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-white rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150
                    ${isActive ? "bg-white/15 text-white" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"}`}
                  >
                    {item.icon}
                  </span>
                  <span className={`text-[13px] font-semibold capitalize tracking-wide leading-none transition-colors duration-150
                    ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"}`}
                  >
                    {sidebars?.data?.[index]?.title ?? item?.name}
                  </span>
                  {item.badge && (
                    <span className="ml-1 px-2 py-[1px] text-[10px] font-bold rounded-full bg-white/[0.08] text-zinc-400 border border-white/10">
                      {item.badge}
                    </span>
                  )}
                </div>

                {hasSubmenu && (
                  <span className={`flex-shrink-0 transition-all duration-200 ${isActive ? "text-zinc-300" : "text-zinc-700 group-hover:text-zinc-500"}`}>
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="ml-4 mt-[2px] mb-1 pl-3 py-1 space-y-[2px] border-l border-white/[0.07]">
                  {item.submenu.map((subItem, subIndex) => {
                    const subActive = isSubmenuActive(subItem.path);
                    return (
                      <div
                        key={subIndex}
                        onClick={() => { if (set) set(); router.push(subItem.path); }}
                        className={`flex items-center gap-2 py-[7px] px-3 rounded-lg cursor-pointer transition-all duration-150 border
                          ${subActive
                            ? "bg-white/[0.08] border-white/10 text-zinc-200"
                            : "border-transparent text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"
                          }`}
                      >
                        <span className={subActive ? "text-zinc-300" : "text-zinc-700"}>
                          {subItem.icon}
                        </span>
                        <span className="text-xs font-semibold tracking-wide">{subItem.name}</span>
                        {subActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 flex-shrink-0 h-px bg-white/[0.06]" />

      {/* Logout */}
      <div className="flex-shrink-0 px-2 py-3">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-[9px] rounded-xl cursor-pointer transition-all duration-150 border border-transparent hover:bg-white/5 hover:border-white/[0.08] group"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-zinc-500 group-hover:text-zinc-300 flex-shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </span>
          <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;