"use client";

import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  Clock3,
  Link as LinkIcon,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useGetDashboardAttendanceSummaryQuery,
  useGetDashboardCountQuery,
  useGetDashboardMonthlySalesQuery,
} from "@/app/_Services/about/page";
import { useMemo } from "react";
import Card from "@/app/_Components/ui/saas/Card";
import Skeleton from "@/app/_Components/ui/saas/Skeleton";

const isQueryPending = (query) =>
  !query.isError && (query.isLoading || (query.isFetching && !query.data));

const DashboardAttendancePieChart = dynamic(
  () => import("@/app/_Components/dashboard/DashboardAttendancePieChart"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[320px] w-full rounded-3xl border border-zinc-800 bg-zinc-900" />
    ),
  },
);

const DashboardMonthlySalesChart = dynamic(
  () => import("@/app/_Components/dashboard/DashboardMonthlySalesChart"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[360px] w-full rounded-3xl border border-zinc-800 bg-zinc-900" />
    ),
  },
);

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

function StatCard({ icon: Icon, title, value, hint, accent, link }) {
  const router = useRouter();

  return (
    <motion.button
      type="button"
      variants={cardVariants}
      initial={false}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(link)}
      className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#121212] p-5 text-left shadow-none transition hover:-translate-y-0.5 hover:border-zinc-700 sm:p-3"
    >
      {/* <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${accent.bgSoft}`}
      /> */}
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${accent.iconShell}`}
        >
          <Icon className={`h-5 w-5 ${accent.icon}`} />
        </div>
         <h3 className="mt-1 truncate text-xl font-bold tracking-tight text-zinc-100">
          {value}
        </h3>
        {/* <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-100">
          <ArrowUpRight className="h-4 w-4" />
        </span> */}
      </div>

      <div className="relative mt-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          {title}
        </p>
       
        <p className="text-[10px] text-zinc-500">{hint}</p>
      </div>
    </motion.button>
  );
}

function InsightCard({ title, description, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
        </div>
      </div>
    </Card>
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="theme-zyro-dark -mx-1 min-h-screen rounded-2xl bg-ink px-1 pb-4">
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900" />
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900" />
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900" />
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <Skeleton className="h-[320px] rounded-3xl border border-zinc-800 bg-zinc-900 lg:col-span-3" />
        <Skeleton className="h-[360px] rounded-3xl border border-zinc-800 bg-zinc-900 lg:col-span-9" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900 lg:col-span-2" />
        <Skeleton className="h-28 rounded-3xl border border-zinc-800 bg-zinc-900" />
      </div>
    </div>
  );
}

export default function DashboardStatisticsPage() {
  const countQuery = useGetDashboardCountQuery();
  const attendanceQuery = useGetDashboardAttendanceSummaryQuery();
  const salesQuery = useGetDashboardMonthlySalesQuery();

  const { data, isError } = countQuery;
  const waiting =
    isQueryPending(countQuery) ||
    isQueryPending(attendanceQuery) ||
    isQueryPending(salesQuery);

  const stats = useMemo(
    () => [
      {
        icon: Package,
        title: "Total Leads",
        value: data?.data?.leadCount || 0,
        hint: "Fresh pipeline records",
        link: "/dashboard/lead",
        accent: {
          bgSoft: "bg-blue-100",
          iconShell: "border-zinc-700 bg-blue-100",
          icon: "text-blue-500",
        },
      },
      {
        icon: ShoppingBag,
        title: "New Clients",
        value: data?.data?.clientCount || 0,
        hint: "Client profiles created",
        link: "/dashboard/client",
        accent: {
          bgSoft: "bg-purple-200",
          iconShell: "border-zinc-700 bg-purple-200",
          icon: "text-purple-600",
        },
      },
      {
        icon: TrendingUp,
        title: "Total Sales",
        value: formatMoney(data?.data?.saleAmount),
        hint: "SaleDate based revenue",
        link: "/dashboard/sale",
        accent: {
          bgSoft: "bg-green-100",
          iconShell: "border-zinc-700 bg-green-100",
          icon: "text-green-500",
        },
      },
      {
        icon: LinkIcon,
        title: "Pending Links",
        value: data?.data?.paymentLinkCount || 0,
        hint: "Awaiting customer checkout",
        link: "/dashboard/paymentLink",
        accent: {
          bgSoft: "bg-yellow-100",
          iconShell: "border-zinc-700 bg-yellow-100",
          icon: "text-yellow-500",
        },
      },
    ],
    [data],
  );

  if (waiting) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="theme-zyro-dark -mx-1 min-h-screen rounded-2xl bg-ink px-1 pb-4">
      {isError ? (
        <p className="mb-3 rounded-2xl border border-rose-900/50 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
          Could not refresh dashboard counts. Showing the last available values.
        </p>
      ) : null}

      <motion.div
        initial={false}
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <DashboardAttendancePieChart />
        </div>
        <div className="lg:col-span-9">
          <DashboardMonthlySalesChart />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InsightCard
            icon={Clock3}
            title="Recent Activity"
            description="No recent activity is available yet. Once leads, sales, and payment actions start flowing, this area can show the latest business events."
          />
        </div>
        <InsightCard
          icon={DollarSign}
          title="Revenue Focus"
          description="Sales revenue is now aligned with sale date, so dashboard numbers match the business reporting period more accurately."
        />
      </div>
    </div>
  );
}
