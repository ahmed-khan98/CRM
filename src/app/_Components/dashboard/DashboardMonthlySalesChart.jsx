"use client";

import { useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "@/app/_Components/ui/saas/Card";
import Skeleton from "@/app/_Components/ui/saas/Skeleton";
import { useGetDashboardMonthlySalesQuery } from "@/app/_Services/about/page";

const TZ = "Asia/Karachi";

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

const chartTooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: "12px",
  color: "#fafafa",
  fontSize: "12px",
};

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={chartTooltipStyle} className="px-3 py-2 shadow-lg">
      <p className="font-medium text-zinc-100">{label}</p>
      <p className="text-emerald-400">{formatMoney(payload[0].value)}</p>
    </div>
  );
}

export default function DashboardMonthlySalesChart() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError, isFetching } =
    useGetDashboardMonthlySalesQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const payload = data?.data;
    if (!payload?.startDate || !payload?.endDate) return [];

    const rangeStart = moment.tz(payload.startDate, "YYYY-MM-DD", TZ).startOf("day");
    const rangeEnd = moment.tz(payload.endDate, "YYYY-MM-DD", TZ).startOf("day");
    if (!rangeStart.isValid() || !rangeEnd.isValid()) return [];

    const amountByDate = new Map(
      (payload.daily ?? []).map((row) => [row.date, row.amount]),
    );

    const days = [];
    const cursor = rangeStart.clone();
    while (cursor.isSameOrBefore(rangeEnd, "day")) {
      const isoDate = cursor.format("YYYY-MM-DD");
      days.push({
        isoDate,
        label: cursor.format("D MMM"),
        amount: amountByDate.get(isoDate) ?? 0,
      });
      cursor.add(1, "day");
    }
    return days;
  }, [data]);

  const monthLabel = data?.data?.monthLabel;
  const salesScope = data?.data?.scope;
  const salesTitle =
    salesScope === "self"
      ? "My sales"
      : salesScope === "department"
        ? "Department sales"
        : "Monthly sales";
  const hasOpenMonth = Boolean(data?.data?.startDate);
  const hasSales = chartData.some((row) => row.amount > 0);
  const waiting =
    (!mounted && !data?.data) ||
    isLoading ||
    (isFetching && !data?.data);

  const { yMax, yTicks } = useMemo(() => {
    const maxAmount = chartData.reduce(
      (max, row) => Math.max(max, Number(row.amount) || 0),
      0,
    );
    const ceiling = Math.max(100, Math.ceil(maxAmount / 100) * 100);
    const ticks = [];
    for (let value = 0; value <= ceiling; value += 100) {
      ticks.push(value);
    }
    return { yMax: ceiling, yTicks: ticks };
  }, [chartData]);

  return (
    <Card className="h-full min-h-[360px] border-zinc-800  shadow-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {salesTitle}
          </p>
          {monthLabel ? (
            <p className="mt-1 text-xs text-zinc-500">{monthLabel}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      {waiting ? (
        <Skeleton className="h-[260px] w-full" />
      ) : isError ? (
        <p className="py-20 text-center text-sm text-rose-400">
          Could not load monthly sales.
        </p>
      ) : !hasOpenMonth ? (
        <p className="py-20 text-center text-sm text-zinc-500">
          No open month found.
        </p>
      ) : !hasSales ? (
        <p className="py-20 text-center text-sm text-zinc-500">
          No sales recorded for the open month yet.
        </p>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >

              <CartesianGrid
                stroke="#27272a"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#3f3f46" }}
                interval="preserveStartEnd"
                minTickGap={24}
              />

              <YAxis
                domain={[0, yMax]}
                ticks={yTicks}
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatMoney(value)}
                width={52}
                allowDecimals={false}
              />

              <Tooltip content={<SalesTooltip />} cursor={{ fill: "#27272a" }} />

              <Bar
                dataKey="amount"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
