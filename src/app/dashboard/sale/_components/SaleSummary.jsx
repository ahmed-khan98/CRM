"use client";

import { memo } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const tones = {
  emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  sky: "text-sky-400 border-sky-500/20 bg-sky-500/10",
  red: "text-red-400 border-red-500/20 bg-red-500/10",
  violet: "text-violet-400 border-violet-500/20 bg-violet-500/10",
};

const currencySymbols = {
  USD: "$",
  CAD: "C$",
  AUD: "A$",
  GBP: "£",
  EUR: "€",
  PKR: "Rs",
  INR: "₹",
  AED: "د.إ",
};

const getCurrencySymbol = (currency) => {
  const code = currency?.toString().trim().toUpperCase();
  return currencySymbols[code] || code || "$";
};

const formatMoney = (value, currency) => {
  const amount = Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

  return currency === "Mixed"
    ? `${amount} Mixed`
    : `${getCurrencySymbol(currency)} ${amount}`;
};

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 shadow-lg shadow-zinc-950/10 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-3">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500 sm:text-[10px]">
            {label}
          </p>
          <p className="mt-1 truncate text-lg font-black text-zinc-100 sm:text-xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10 ${tones[tone]}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

function SaleSummary({ totals }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={BadgeDollarSign}
        label="Revenue"
        value={formatMoney(totals.revenue, totals.currency)}
        tone="emerald"
      />
      <SummaryCard
        icon={TrendingUp}
        label="Total Sales"
        value={totals.totalSales}
        tone="indigo"
      />
      <SummaryCard
        icon={DollarSign}
        label="Paid Sales"
        value={totals.paidSales}
        tone="sky"
      />
      <SummaryCard
        icon={AlertTriangle}
        label="Charge Backs"
        value={totals.chargeBacks}
        tone="red"
      />
      <SummaryCard
        icon={Calendar}
        label="Fresh / Up Sell"
        value={`${totals.fresh} / ${totals.upsell}`}
        tone="violet"
      />
    </div>
  );
}

export default memo(SaleSummary);
