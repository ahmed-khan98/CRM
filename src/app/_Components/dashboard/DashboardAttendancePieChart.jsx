"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Users } from "lucide-react";
import Card from "@/app/_Components/ui/saas/Card";
import Skeleton from "@/app/_Components/ui/saas/Skeleton";
import { useGetDashboardAttendanceSummaryQuery } from "@/app/_Services/about/page";

const SLICE_COLORS = {
  Present: "#34d399",
  Absent: "#fb7185",
  Late: "#fbbf24",
};

const chartTooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: "12px",
  color: "#fafafa",
  fontSize: "12px",
};

function CustomTooltip({ active, payload, unit = "employees" }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={chartTooltipStyle} className="px-3 py-2 shadow-lg">
      <p className="font-medium text-zinc-100">{item.name}</p>
      <p className="text-zinc-400">
        {item.value} {unit}
      </p>
    </div>
  );
}

export default function DashboardAttendancePieChart() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError, isFetching } =
    useGetDashboardAttendanceSummaryQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = data?.data;
  const chartData = useMemo(() => {
    if (!summary) return [];
    return [
      { name: "Present", value: summary.present ?? 0 },
      { name: "Absent", value: summary.absent ?? 0 },
      { name: "Late", value: summary.late ?? 0 },
    ].filter((item) => item.value > 0);
  }, [summary]);

  const total = summary?.total ?? 0;
  const isSelfCycle = summary?.mode === "self_cycle";
  const unit = summary?.unit === "days" ? "days" : "employees";
  const hasData = total > 0 && chartData.length > 0;
  const waiting =
    (!mounted && !summary) || isLoading || (isFetching && !summary);

  return (
    <Card className="h-full min-h-[320px] border-zinc-800 bg-zinc-900 shadow-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {isSelfCycle ? "My attendance" : "Today's attendance"}
          </p>
          {isSelfCycle && summary?.monthLabel ? (
            <p className="mt-1 truncate text-xs text-zinc-500">
              {summary.monthLabel}
            </p>
          ) : null}
          {!isSelfCycle && summary?.shiftDate ? (
            <p className="mt-1 truncate text-xs text-zinc-500">
              Shift date: {summary.shiftDate}
            </p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {waiting ? (
        <Skeleton className="mx-auto h-[220px] w-full max-w-[280px] rounded-full" />
      ) : isError ? (
        <p className="py-16 text-center text-sm text-rose-400">
          Could not load attendance summary.
        </p>
      ) : !hasData ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          {isSelfCycle
            ? "No attendance recorded in this cycle yet."
            : "No attendance data for today yet."}
        </p>
      ) : (
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={3}
                stroke="#09090b"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={SLICE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-zinc-400">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {!waiting && !isError && total > 0 ? (
        <p className="mt-2 text-center text-xs text-zinc-500">
          {isSelfCycle
            ? `${total} working days in cycle (to date)`
            : `${total} active employees in scope`}
        </p>
      ) : null}
    </Card>
  );
}
