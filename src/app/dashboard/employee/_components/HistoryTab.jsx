"use client";

import { useMemo } from "react";
import {
  useGetEmployeeSalaryHistoryQuery,
  useGetEmployeeCarHistoryQuery,
  useGetEmployeeFuelHistoryQuery,
  useGetEmployeeAllowancesQuery,
} from "@/app/_Services/employee/hrms";
import {
  History,
  Wallet,
  Car,
  Fuel,
  BadgePercent,
  ArrowRight,
} from "lucide-react";
import {
  SectionCard,
  EmptyState,
  formatDate,
  formatMoney,
} from "./hrmsUi";

const TYPE_META = {
  Salary: {
    icon: Wallet,
    className: "bg-zinc-900 text-white border-zinc-900",
  },
  Allowance: {
    icon: BadgePercent,
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  Car: {
    icon: Car,
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  Fuel: {
    icon: Fuel,
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

export default function HistoryTab({ employeeId }) {
  const { data: salary, isLoading: loadingSalary } =
    useGetEmployeeSalaryHistoryQuery({ employeeId, limit: 50 });
  const { data: cars } = useGetEmployeeCarHistoryQuery({
    employeeId,
    limit: 50,
  });
  const { data: fuel } = useGetEmployeeFuelHistoryQuery({
    employeeId,
    limit: 50,
  });
  const { data: allowanceData, isLoading: loadingAllowances } =
    useGetEmployeeAllowancesQuery({ employeeId, limit: 100 });

  const timeline = useMemo(() => {
    const salaryItems = (salary?.data?.items || [])
      .filter((h) => Number(h.previousSalary || 0) !== Number(h.newSalary || 0))
      .map((h) => ({
        id: `s-${h._id}`,
        type: "Salary",
        date: h.effectiveDate || h.createdAt,
        title: h.reason || "Salary revision",
        detail: (
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <span className="text-zinc-400">{formatMoney(h.previousSalary)}</span>
            <ArrowRight className="h-3 w-3 text-zinc-300" />
            <span className="font-bold text-zinc-900">
              {formatMoney(h.newSalary)}
            </span>
          </span>
        ),
      }));

    const carItems = (cars?.data?.items || []).map((h) => ({
      id: `c-${h._id}`,
      type: "Car",
      date: h.assignedDate || h.createdAt,
      title: h.carName,
      detail: (
        <span>
          {h.registrationNumber ? `${h.registrationNumber} · ` : ""}
          <span className="capitalize">{h.status}</span>
        </span>
      ),
    }));

    const fuelItems = (fuel?.data?.items || []).map((h) => ({
      id: `f-${h._id}`,
      type: "Fuel",
      date: h.effectiveDate || h.createdAt,
      title: "Fuel allowance",
      detail: formatMoney(h.fuelAllowance),
    }));

    const allowanceItems = [];
    for (const a of allowanceData?.data?.items || []) {
      const history = a.statusHistory?.length
        ? a.statusHistory
        : [
            {
              _id: "fallback",
              fromStatus: "",
              toStatus: a.status || "active",
              note: "Allowance added",
              changedAt: a.createdAt,
            },
          ];

      history.forEach((ev, idx) => {
        const to = ev.toStatus || "active";
        const action =
          to === "inactive"
            ? "Deactivated"
            : ev.fromStatus
              ? "Activated"
              : "Added";
        allowanceItems.push({
          id: `a-${a._id}-${ev._id || idx}-${ev.changedAt}`,
          type: "Allowance",
          date: ev.changedAt || a.updatedAt || a.createdAt,
          title: a.allowanceType,
          detail: (
            <span>
              {action}
              {a.benefitMode === "company_car"
                ? " · Company car"
                : ` · ${formatMoney(a.amount)}`}
              {ev.note ? ` · ${ev.note}` : ""}
            </span>
          ),
          tone: to === "inactive" ? "off" : "on",
        });
      });
    }

    return [...salaryItems, ...carItems, ...fuelItems, ...allowanceItems].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [salary, cars, fuel, allowanceData]);

  const loading = loadingSalary || loadingAllowances;

  return (
    <SectionCard
      icon={History}
      title="Change History"
      subtitle="Salary revisions, allowance activate/deactivate, and asset changes"
    >
      {loading ? (
        <EmptyState message="Loading history..." />
      ) : timeline.length === 0 ? (
        <EmptyState message="No history records yet." />
      ) : (
        <div className="space-y-2">
          {timeline.map((t) => {
            const meta = TYPE_META[t.type] || TYPE_META.Salary;
            const Icon = meta.icon;
            return (
              <div
                key={t.id}
                className="flex gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 hover:bg-zinc-50/80 transition"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.className}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {t.type}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 truncate">
                        {t.title}
                      </span>
                      {t.tone === "off" && (
                        <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">
                          Deactive
                        </span>
                      )}
                      {t.tone === "on" && t.type === "Allowance" && (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(t.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{t.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
