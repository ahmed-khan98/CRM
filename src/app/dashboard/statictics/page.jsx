"use client";

import {
  ArrowUpRight,
  Clock3,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetDashboardCountQuery } from "@/app/_Services/about/page";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(link)}
      className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 text-left shadow-sm shadow-zinc-200/70 transition hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/80 sm:p-5"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${accent.bgSoft}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${accent.iconShell}`}
        >
          <Icon className={`h-5 w-5 ${accent.icon}`} />
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400">
          {title}
        </p>
        <h3 className="mt-1 truncate text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
          {value}
        </h3>
        <p className="mt-2 text-xs font-semibold text-zinc-500">{hint}</p>
      </div>
    </motion.button>
  );
}

function InsightCard({ title, description, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-zinc-900">{title}</h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const { data, isLoading } = useGetDashboardCountQuery();

  useEffect(() => {
    const cookieUser = Cookies.get("currentuser");
    if (cookieUser) {
      try {
        setCurrentUser(JSON.parse(cookieUser));
      } catch {
        setCurrentUser("");
      }
    }

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 23) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: Package,
        title: "Total Leads",
        value: data?.data?.leadCount || 0,
        hint: "Fresh pipeline records",
        link: "/dashboard/lead",
        accent: {
          bgSoft: "bg-blue-500/10",
          iconShell: "border-blue-500/15 bg-blue-500/10",
          icon: "text-blue-600",
        },
      },
      {
        icon: ShoppingBag,
        title: "New Clients",
        value: data?.data?.clientCount || 0,
        hint: "Client profiles created",
        link: "/dashboard/client",
        accent: {
          bgSoft: "bg-amber-500/10",
          iconShell: "border-amber-500/15 bg-amber-500/10",
          icon: "text-amber-600",
        },
      },
      {
        icon: TrendingUp,
        title: "Total Sales",
        value: formatMoney(data?.data?.saleAmount),
        hint: "SaleDate based revenue",
        link: "/dashboard/sale",
        accent: {
          bgSoft: "bg-emerald-500/10",
          iconShell: "border-emerald-500/15 bg-emerald-500/10",
          icon: "text-emerald-600",
        },
      },
      {
        icon: CreditCard,
        title: "Pending Links",
        value: data?.data?.paymentLinkCount || 0,
        hint: "Awaiting customer checkout",
        link: "/dashboard/paymentLink",
        accent: {
          bgSoft: "bg-rose-500/10",
          iconShell: "border-rose-500/15 bg-rose-500/10",
          icon: "text-rose-600",
        },
      },
    ],
    [data],
  );

  if (isLoading) {
    return (
      <PageLoader
        title="Loading dashboard"
        subtitle="Getting your CRM snapshot ready..."
      />
    );
  }

  return (
    <div className="min-h-screen px-1 pb-6">
      <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-5 text-white shadow-2xl shadow-zinc-300/40 sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-6 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              CRM Overview
            </div>
            <h1 className="max-w-3xl text-2xl font-black tracking-tight sm:text-4xl">
              {greeting}, {currentUser?.fullName || "Team"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-zinc-400">
              Track leads, clients, sale revenue, and pending payment links from
              one clean command center.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-black text-zinc-100">
              {new Date().toLocaleDateString()}{" "}
              <span className="text-zinc-500">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        </div>
      </section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </motion.div>

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
