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
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Coffee,
  FolderKanban,
  ListTodo,
  Truck,
  MessageCircle,
} from "lucide-react";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { useLogoutMutation } from "@/app/_Services/authentication/page";
import toast from "react-hot-toast";
import { removeAttendence, resumeWork } from "@/redux/filterSlice";
import { useDispatch } from "react-redux";

const LeftNav = ({ set }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const sidebars = [];
  const isMobileDrawer = Boolean(set);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logout] = useLogoutMutation();

  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      path: ["/dashboard/statictics"],
      roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"],
    },
    {
      name: "Department",
      icon: <Building className="w-4 h-4" />,
      path: ["/dashboard/department"],
      roles: ["HR_ADMIN"],
    },
    {
      name: "Brand",
      icon: <Home className="w-4 h-4" />,
      path: ["/dashboard/brand"],
      roles: ["HR_ADMIN", "DEP_ADMIN"],
    },
    {
      name: "Announcement",
      icon: <MegaphoneIcon className="w-4 h-4" />,
      path: ["/dashboard/announcement"],
      roles: ["HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"],
    },
    {
      name: "Employee",
      icon: <Users className="w-4 h-4" />,
      path: ["/dashboard/employee"],
      roles: ["HR_ADMIN", "DEP_ADMIN"],
    },
    {
      name: "Client",
      icon: <User className="w-4 h-4" />,
      path: ["/dashboard/client"],
      roles: ["USER", "DEP_ADMIN"],
    },
    {
      name: "Projects",
      icon: <FolderKanban className="w-4 h-4" />,
      path: ["/dashboard/projects"],
      roles: ["USER", "DEP_ADMIN"],
    },
    {
      name: "All Tasks",
      icon: <ListTodo className="w-4 h-4" />,
      path: ["/dashboard/tasks"],
      roles: ["USER", "DEP_ADMIN"],
    },
    {
      name: "Chat",
      icon: <MessageCircle className="w-4 h-4" />,
      path: ["/dashboard/chat"],
      roles: [
        "USER",
        "HR_ADMIN",
        "FINANCE_ADMIN",
        "DEP_ADMIN",
        "ADMIN",
        "SUBADMIN",
      ],
    },
    {
      name: "Fleet",
      icon: <Truck className="w-4 h-4" />,
      path: ["/dashboard/fleet/vendors", "/dashboard/fleet/vehicles"],
      roles: ["ADMIN", "SUBADMIN"],
      submenu: [
        {
          name: "Vendors",
          path: "/dashboard/fleet/vendors",
          icon: <Building className="w-3.5 h-3.5" />,
          roles: ["ADMIN", "SUBADMIN"],
        },
        {
          name: "Vehicles",
          path: "/dashboard/fleet/vehicles",
          icon: <Truck className="w-3.5 h-3.5" />,
          roles: ["ADMIN", "SUBADMIN"],
        },
      ],
    },
    {
      name: "leads",
      icon: <ChartBar className="w-4 h-4" />,
      path: ["/dashboard/lead"],
      roles: ["USER", "DEP_ADMIN"],
    },
    {
      name: "Payment Link",
      icon: <Link className="w-4 h-4" />,
      path: [
        "/dashboard/paymentLink",
        "/dashboard/createLeadPayment",
        "/dashboard/createPaymentLink",
      ],
      roles: ["USER", "FINANCE_ADMIN", "DEP_ADMIN"],
    },
    // {
    //   name: "Email",
    //   icon: <Mail className="w-4 h-4" />,
    //   path: [
    //     "/dashboard/EmailTemplate",
    //     "/dashboard/BrandEmail",
    //     "/dashboard/SendEmail",
    //     "/dashboard/EmailList",
    //     "/dashboard/TmEmailList",
    //     "/dashboard/BulkEmail",
    //     "/dashboard/SentBulkEmail",
    //     "/dashboard/SentTMBulkEmail",
    //   ],
    //   roles: ["USER", "DEP_ADMIN"],
    //   submenu: [
    //     {
    //       name: "Brand Email",
    //       path: "/dashboard/BrandEmail",
    //       icon: <AtSign className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //     {
    //       name: "Email Template",
    //       path: "/dashboard/EmailTemplate",
    //       icon: <LayoutPanelTop className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //     {
    //       name: "Email List",
    //       path: "/dashboard/EmailList",
    //       icon: <List className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //     {
    //       name: "TM Email List",
    //       path: "/dashboard/TmEmailList",
    //       icon: <List className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //     {
    //       name: "Bulk Email",
    //       path: "/dashboard/BulkEmail",
    //       icon: <Mails className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //     {
    //       name: "TM Bulk Email",
    //       path: "/dashboard/TmBulkEmail",
    //       icon: <Mails className="w-3.5 h-3.5" />,
    //       roles: ["USER", "DEP_ADMIN"],
    //     },
    //   ],
    // },
    {
      name: "All Months",
      icon: <Calendar className="w-4 h-4" />,
      path: ["/dashboard/month"],
      roles: ["DEP_ADMIN", "HR_ADMIN", "FINANCE_ADMIN"],
    },
    {
      name: "Sales",
      icon: <BadgeDollarSign className="w-4 h-4" />,
      path: ["/dashboard/sale"],
      roles: ["DEP_ADMIN", "FINANCE_ADMIN", "USER", "HR_ADMIN"],
    },
    {
      name: "My Account",
      icon: <User className="w-4 h-4" />,
      path: ["/dashboard/profile", "/dashboard/changepassword"],
      roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"],
    },
    {
      name: "Attendance",
      icon: <CalendarDays className="w-4 h-4" />,
      path: ["/dashboard/attendance", "/dashboard/attendance"],
      roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"],
      submenu: [
        {
          name: "My Attendance",
          path: "/dashboard/attendance",
          roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"],
          icon: <CalendarDays className="w-3.5 h-3.5" />,
        },
        {
          name: "Team Attendance",
          path: "/dashboard/attendance/teamAttendence",
          roles: ["HR_ADMIN", "DEP_ADMIN"],
          icon: <CalendarDays className="w-3.5 h-3.5" />,
        },
        {
          name: "My Break",
          path: "/dashboard/attendance/break",
          roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"],
          icon: <Coffee className="w-3.5 h-3.5" />,
        },
        {
          name: "Team Break",
          path: "/dashboard/attendance/teamBreak",
          roles: ["HR_ADMIN", "DEP_ADMIN"],
          icon: <Coffee className="w-3.5 h-3.5" />,
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => {
      if (user?.role === "ADMIN" || user?.role === "SUBADMIN") return true;

      return item.roles?.includes(user?.role);
    })
    .map((item) => {
      if (item.submenu) {
        const filteredSub = item.submenu.filter((sub) => {
          if (user?.role === "ADMIN" || user?.role === "SUBADMIN") return true;
          return sub.roles?.includes(user?.role);
        });

        return { ...item, submenu: filteredSub };
      }
      return item;
    });

  const clearExtensionAndRedirect = () => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
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

  const toggleSubmenu = (index) =>
    setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  const isMenuActive = (paths) =>
    paths.some((path) => pathname.startsWith(path));
  const isSubmenuActive = (path) => pathname === path;

  return (
    /* ── Outer wrapper: width transitions here ── */
    <div
      className={`h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${isMobileDrawer ? "w-full" : isCollapsed ? "w-[74px]" : "w-[230px]"}`}
    >
      <div
        className={`flex flex-col min-h-0 min-w-0 flex-1 overflow-hidden bg-zinc-950 border-white/[0.07] shadow-2xl ${isMobileDrawer ? "mx-3 mb-3 rounded-3xl border" : "mx-1 rounded-2xl border"}`}
      >
        {/* Top accent line */}
        <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/30 to-white/5" />

        {/* ── Header: logo / toggle button ── */}
        {!isMobileDrawer && (
          <div
            className={`flex-shrink-0 flex items-center px-2 py-1
          ${isCollapsed ? "justify-center" : "justify-end"}`}
          >
            <Tooltip
              label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              side="bottom"
            >
              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-zinc-300 hover:bg-white/10 hover:text-zinc-200 transition-all duration-150"
              >
                {isCollapsed ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
              </button>
            </Tooltip>
          </div>
        )}

        {/* ── Scrollable nav ── */}
        <nav
          className={`sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden ${isMobileDrawer ? "p-2" : "p-1"}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
          }}
        >
          {filteredMenuItems.map((item, index) => {
            const isActive = isMenuActive(item.path);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded =
              !isCollapsed && (expandedMenus[index] || isActive);
            const label = sidebars?.data?.[index]?.title ?? item?.name;

            return (
              <div key={index} className="mb-[1px]">
                {/* ── Main row ── */}
                <Tooltip
                  label={isCollapsed ? label : undefined}
                  side="right"
                  className="w-full"
                >
                <div
                  onClick={() => {
                    if (isCollapsed) {
                      // In collapsed mode navigate directly even for submenu parents
                      router.push(item.path[0]);
                      if (set) set();
                    } else if (hasSubmenu) {
                      toggleSubmenu(index);
                    } else {
                      router.push(item.path[0]);
                      if (set) set();
                    }
                  }}
                  className={`relative flex items-center cursor-pointer rounded-xl border transition-all duration-150 group
                    ${isCollapsed ? "justify-center py-[2px]" : isMobileDrawer ? "justify-between px-3 py-2.5 my-1.5" : "justify-between px-2 py-1 my-1"}
                    ${
                      isActive
                        ? "bg-white/[0.09] border-white/[0.12]"
                        : "border-transparent hover:bg-white/[0.04]"
                    }`}
                >
                  {/* Active left pill */}
                  {isActive && !isCollapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-white rounded-r-full" />
                  )}

                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}
                  >
                    {/* Icon */}
                    <span
                      className={` ${isCollapsed ? "w-8 h-8" : isMobileDrawer ? "w-9 h-9" : "w-7 h-7"} flex items-center justify-center  rounded-lg transition-all duration-150 flex-shrink-0
                      ${isActive ? "bg-white/15 text-white" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"}`}
                    >
                      {item.icon}
                    </span>

                    {/* Label — hidden when collapsed */}
                    {!isCollapsed && (
                      <>
                        <span
                          className={`${isMobileDrawer ? "text-[13px] font-semibold" : "text-[12px] font-normal"} capitalize tracking-wide leading-none transition-colors duration-150 whitespace-nowrap
                          ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"}`}
                        >
                          {label}
                        </span>
                        {item.badge && (
                          <span className="ml-1 px-2 py-[1px] text-[10px] font-bold rounded-full bg-white/[0.08] text-zinc-400 border border-white/10">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Chevron — only when expanded */}
                  {hasSubmenu && !isCollapsed && (
                    <span
                      className={`flex-shrink-0 transition-all duration-200 ${isActive ? "text-zinc-300" : "text-zinc-700 group-hover:text-zinc-500"}`}
                    >
                      {isExpanded ? (
                        <ChevronDown size={13} />
                      ) : (
                        <ChevronRight size={13} />
                      )}
                    </span>
                  )}
                </div>
                </Tooltip>

                {/* ── Submenu (hidden when collapsed) ── */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <div
                    className={`${isMobileDrawer ? "ml-5 mb-2 mt-1" : "ml-3 mb-1"} pl-2 py-1 space-y-[1px] border-l border-white/[0.07]`}
                  >
                    {item.submenu.map((subItem, subIndex) => {
                      const subActive = isSubmenuActive(subItem.path);
                      return (
                        <div
                          key={subIndex}
                          onClick={() => {
                            if (set) set();
                            router.push(subItem.path);
                          }}
                          className={`flex items-center gap-2 ${isMobileDrawer ? "py-2 px-3" : "py-1.5 px-3"} rounded-lg cursor-pointer transition-all duration-150 border
                            ${
                              subActive
                                ? "bg-white/[0.08] border-white/10 text-zinc-200"
                                : "border-transparent text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"
                            }`}
                        >
                          <span
                            className={
                              subActive
                                ? "text-zinc-300"
                                : "text-zinc-600 group-hover:text-zinc-300"
                            }
                          >
                            {subItem.icon}
                          </span>
                          <span className="text-xs font-normal tracking-wide">
                            {subItem.name}
                          </span>
                          {subActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                          )}
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

        {/* ── Logout ── */}
        <div
          className={`flex-shrink-0 px-2 ${isMobileDrawer ? "py-2" : "py-1"}`}
        >
          <Tooltip label={isCollapsed ? "Logout" : undefined} side="right">
            <div
              onClick={handleLogout}
              className={`flex items-center cursor-pointer rounded-xl border border-transparent hover:bg-white/5 hover:border-white/[0.08] transition-all duration-150 group
              ${isCollapsed ? "justify-center px-0 py-[4px]" : isMobileDrawer ? "gap-3 px-3 py-2.5" : "gap-3 px-3 py-1"}`}
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-zinc-500 group-hover:text-zinc-300 flex-shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </span>
              {!isCollapsed && (
                <span className="text-[12px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors whitespace-nowrap">
                  Logout
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;

// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import {
//   Home, Calendar, User, Users, LogOut, ChevronRight, ChevronDown,
//   LayoutDashboard, BadgeDollarSign, ChartBar, Mail, LayoutPanelTop,
//   AtSign, List, Mails, Building, Link, MegaphoneIcon,
//   CalendarDays,
// } from "lucide-react";
// import { useLogoutMutation } from "@/app/_Services/authentication/page";
// import toast from "react-hot-toast";
// import { removeAttendence, resumeWork } from "@/redux/filterSlice";
// import { useDispatch } from "react-redux";

// const LeftNav = ({ set }) => {
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const sidebars = [];
//   const [expandedMenus, setExpandedMenus] = useState({});
//     const [isCollapsed, setIsCollapsed] = useState(false);
//   const [logout] = useLogoutMutation();

//   const userCookie = Cookies.get("currentuser");
//   const user = userCookie ? JSON.parse(userCookie) : null;

//   const menuItems = [
//     { name: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: ["/dashboard/dashboardcount"] },
//     { name: "Department", icon: <Building className="w-4 h-4" />, path: ["/dashboard/department"] },
//     { name: "Brand", icon: <Home className="w-4 h-4" />, path: ["/dashboard/brand"] },
//     { name: "Announcement", icon: <MegaphoneIcon className="w-4 h-4" />, path: ["/dashboard/announcement"] },
//     { name: "Employee", icon: <Users className="w-4 h-4" />, path: ["/dashboard/employee"] },
//     { name: "Client", icon: <User className="w-4 h-4" />, path: ["/dashboard/client"] },
//     { name: "leads", icon: <ChartBar className="w-4 h-4" />, path: ["/dashboard/lead"] },
//     {
//       name: "Payment Link",
//       icon: <Link className="w-4 h-4" />,
//       path: ["/dashboard/paymentLink", "/dashboard/createLeadPayment", "/dashboard/createPaymentLink"],
//     },
//     {
//       name: "Email",
//       icon: <Mail className="w-4 h-4" />,
//       path: ["/dashboard/EmailTemplate", "/dashboard/BrandEmail", "/dashboard/SendEmail", "/dashboard/EmailList", "/dashboard/TmEmailList", "/dashboard/BulkEmail", "/dashboard/SentBulkEmail", "/dashboard/SentTMBulkEmail"],
//       submenu: [
//         { name: "Brand Email", path: "/dashboard/BrandEmail", icon: <AtSign className="w-3.5 h-3.5" /> },
//         { name: "Email Template", path: "/dashboard/EmailTemplate", icon: <LayoutPanelTop className="w-3.5 h-3.5" /> },
//         { name: "Email List", path: "/dashboard/EmailList", icon: <List className="w-3.5 h-3.5" /> },
//         { name: "TM Email List", path: "/dashboard/TmEmailList", icon: <List className="w-3.5 h-3.5" /> },
//         { name: "Bulk Email", path: "/dashboard/BulkEmail", icon: <Mails className="w-3.5 h-3.5" /> },
//         { name: "TM Bulk Email", path: "/dashboard/TmBulkEmail", icon: <Mails className="w-3.5 h-3.5" /> },
//       ],
//     },
//     { name: "All Months", icon: <Calendar className="w-4 h-4" />, path: ["/dashboard/month"] },
//     { name: "Sales", icon: <BadgeDollarSign className="w-4 h-4" />, path: ["/dashboard/sale"] },
//     { name: "My Account", icon: <User className="w-4 h-4" />, path: ["/dashboard/profile", "/dashboard/changepassword"] },
//     {
//       name: "Attendance",
//       icon: <CalendarDays  className="w-4 h-4" />,
//       path: ["/dashboard/attendance", "/dashboard/attendance/teamAttendence"],
//       submenu: [
//         { name: "My Attendance", path: "/dashboard/attendance" },
//         { name: "Team Attendance", path: "/dashboard/attendance/teamAttendence" },
//       ],
//     },
//   ];

//   const USER_ALLOWED_TABS = ["Dashboard", "Client", "leads", "Email", "Payment Link", "Sales", "My Account", "Attendance"];
//   const DEP_ADMIN_ALLOWED_TABS = ["Dashboard", "Brand","Employee", "Announcement", "Client", "leads", "Email", "Payment Link", "Sales", "My Account", "Attendance"];
//   const HR_ADMIN_ALLOWED_TABS = ["Dashboard",  "Department", "Brand","Employee", "Announcement", "My Account", "Attendance"];
//   const FINANCE_ADMIN_ALLOWED_TABS = ["Dashboard", "Payment Link", "Sales", "My Account", "Attendance"];

//   const filteredMenuItems =
//     user?.role === "USER"
//       ? menuItems.filter((item) => USER_ALLOWED_TABS.includes(item.name))
//       : user?.role === "DEP_ADMIN"
//         ? menuItems.filter((item) => DEP_ADMIN_ALLOWED_TABS.includes(item.name))
//       : user?.role === "HR_ADMIN"
//         ? menuItems.filter((item) => HR_ADMIN_ALLOWED_TABS.includes(item.name))
//       : user?.role === "FINANCE_ADMIN"
//         ? menuItems.filter((item) => FINANCE_ADMIN_ALLOWED_TABS.includes(item.name))
//         : menuItems;

//   const clearExtensionAndRedirect = () => {
//     if (typeof window !== "undefined" && window.chrome && window.chrome.runtime) {
//       window.postMessage({ type: "LOGOUT" }, "*");
//       router.push("/");
//     } else {
//       router.push("/");
//     }
//   };

//   const finalizeLogout = (msg) => {
//     Cookies.remove("token", { path: "/" });
//     Cookies.remove("currentuser", { path: "/" });
//     dispatch(resumeWork());
//     dispatch(removeAttendence());
//     toast.success(msg);
//     clearExtensionAndRedirect();
//   };

//   const handleLogout = async () => {
//     if (set) set();
//     try {
//       const response = await logout().unwrap();
//       if (response.statusCode === 200) finalizeLogout(response?.message);
//     } catch (error) {
//       toast.error(error?.data?.message || "Logout failed");
//     }
//   };

//   const toggleSubmenu = (index) => setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
//   const isMenuActive = (paths) => paths.some((path) => pathname.startsWith(path));
//   const isSubmenuActive = (path) => pathname === path;

//   return (
//     <div className="h-full flex flex-col overflow-hidden rounded-2xl mx-2 bg-zinc-950 border border-white/[0.07] ">
//       {/* Top accent line */}
//       <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/30 to-white/5" />

//       {/* Scrollable nav */}
//       <nav
//         className="flex-1 overflow-y-auto py-2 px-2 scrollbar-none"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//       >
//         {filteredMenuItems.map((item, index) => {
//           const isActive = isMenuActive(item.path);
//           const hasSubmenu = item.submenu && item.submenu.length > 0;
//           const isExpanded = expandedMenus[index] || isActive;

//           return (
//             <div key={index} className="mb-[2px]">
//               {/* Main row */}
//               <div
//                 onClick={() => {
//                   if (hasSubmenu) toggleSubmenu(index);
//                   else { router.push(item.path[0]); if (set) set(); }
//                 }}
//                 className={`relative flex items-center justify-between px-3 py-[9px] cursor-pointer rounded-xl border transition-all duration-150 group
//                   ${isActive
//                     ? "bg-white/[0.09] border-white/[0.12]"
//                     : "border-transparent hover:bg-white/[0.04]"
//                   }`}
//               >
//                 {/* Active left pill */}
//                 {isActive && (
//                   <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-white rounded-r-full" />
//                 )}

//                 <div className="flex items-center gap-3">
//                   <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150
//                     ${isActive ? "bg-white/15 text-white" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"}`}
//                   >
//                     {item.icon}
//                   </span>
//                   <span className={`text-[13px] font-semibold capitalize tracking-wide leading-none transition-colors duration-150
//                     ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"}`}
//                   >
//                     {sidebars?.data?.[index]?.title ?? item?.name}
//                   </span>
//                   {item.badge && (
//                     <span className="ml-1 px-2 py-[1px] text-[10px] font-bold rounded-full bg-white/[0.08] text-zinc-400 border border-white/10">
//                       {item.badge}
//                     </span>
//                   )}
//                 </div>

//                 {hasSubmenu && (
//                   <span className={`flex-shrink-0 transition-all duration-200 ${isActive ? "text-zinc-300" : "text-zinc-700 group-hover:text-zinc-500"}`}>
//                     {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
//                   </span>
//                 )}
//               </div>

//               {/* Submenu */}
//               {hasSubmenu && isExpanded && (
//                 <div className="ml-4 mt-[2px] mb-1 pl-3 py-1 space-y-[2px] border-l border-white/[0.07]">
//                   {item.submenu.map((subItem, subIndex) => {
//                     const subActive = isSubmenuActive(subItem.path);
//                     return (
//                       <div
//                         key={subIndex}
//                         onClick={() => { if (set) set(); router.push(subItem.path); }}
//                         className={`flex items-center gap-2 py-[7px] px-3 rounded-lg cursor-pointer transition-all duration-150 border
//                           ${subActive
//                             ? "bg-white/[0.08] border-white/10 text-zinc-200"
//                             : "border-transparent text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"
//                           }`}
//                       >
//                         <span className={subActive ? "text-zinc-300" : "text-zinc-700"}>
//                           {subItem.icon}
//                         </span>
//                         <span className="text-xs font-semibold tracking-wide">{subItem.name}</span>
//                         {subActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>

//       {/* Divider */}
//       <div className="mx-3 flex-shrink-0 h-px bg-white/[0.06]" />

//       {/* Logout */}
//       <div className="flex-shrink-0 px-2 py-3">
//         <div
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-3 py-[9px] rounded-xl cursor-pointer transition-all duration-150 border border-transparent hover:bg-white/5 hover:border-white/[0.08] group"
//         >
//           <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-zinc-500 group-hover:text-zinc-300 flex-shrink-0">
//             <LogOut className="w-3.5 h-3.5" />
//           </span>
//           <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
//             Logout
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeftNav;
