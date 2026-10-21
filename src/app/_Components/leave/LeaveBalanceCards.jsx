"use client";

import { StatCard } from "@/app/dashboard/employee/_components/hrmsUi";

const BALANCE_TINTS = [
  "border-violet-500/40 bg-violet-950/70",
  "border-emerald-500/40 bg-emerald-950/70",
  "border-sky-500/40 bg-sky-950/70",
  "border-amber-500/40 bg-amber-950/70",
  "border-rose-500/40 bg-rose-950/70",
];

export default function LeaveBalanceCards({ balances = [], loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/60"
          />
        ))}
      </div>
    );
  }

  if (!balances.length) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-[#121212] px-4 py-6 text-center text-sm text-zinc-500">
        No leave balances found for this year.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
      {balances.map((row, index) => {
        const type = row.leaveTypeId;
        return (
          <StatCard
            key={row._id}
            label={type?.name || "Leave"}
            value={`${row.remaining ?? 0} days`}
            hint={`Allocated ${row.allocated ?? 0} · Used ${row.used ?? 0}`}
            className={BALANCE_TINTS[index % BALANCE_TINTS.length]}
          />
        );
      })}
    </div>
  );
}
