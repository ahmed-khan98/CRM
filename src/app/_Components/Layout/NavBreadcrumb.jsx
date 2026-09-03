"use client";

import { usePathname } from "next/navigation";

const LABELS = {
  dashboard: "Dashboard",
  statictics: "Overview",
  department: "Departments",
  brand: "Brands",
  announcement: "Announcements",
  employee: "Employees",
  client: "Clients",
  projects: "Projects",
  tasks: "Tasks",
  chat: "Chat",
  fleet: "Fleet",
  vendors: "Vendors",
  vehicles: "Vehicles",
  lead: "Leads",
  detail: "Detail",
  paymentLink: "Payment links",
  createPaymentLink: "Create link",
  createLeadPayment: "Lead payment",
  month: "Months",
  sale: "Sales",
  attendance: "Attendance",
  teamAttendence: "Team attendance",
  break: "Breaks",
  teamBreak: "Team breaks",
  profile: "Profile",
  changepassword: "Password",
};

export default function NavBreadcrumb() {
  const pathname = usePathname() || "";
  const parts = pathname.split("/").filter(Boolean).slice(1);
  if (!parts.length) return null;

  return (
    <p className="hidden xl:block truncate text-xs text-zinc-500">
      {parts.map((part, i) => (
        <span key={`${part}-${i}`}>
          {i > 0 && <span className="mx-1.5 text-zinc-700">/</span>}
          <span className={i === parts.length - 1 ? "text-zinc-300" : ""}>
            {LABELS[part] || (part.length === 24 ? "Record" : part)}
          </span>
        </span>
      ))}
    </p>
  );
}
