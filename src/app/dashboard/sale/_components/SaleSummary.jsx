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

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
            {label}
          </p>
          <p className="mt-1 text-xl font-black text-zinc-100">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SaleSummary({ totals }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        icon={BadgeDollarSign}
        label="Revenue"
        value={formatMoney(totals.revenue)}
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
