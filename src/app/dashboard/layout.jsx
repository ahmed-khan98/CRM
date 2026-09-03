import DashboardClientLayout from "@/app/_Components/Layout/DashboardClientLayout";

export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s | CRM Zytron World",
  },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
