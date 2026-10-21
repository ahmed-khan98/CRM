export const PAY_STATUS = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-sky-50 text-sky-700 border-sky-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  finalized: "bg-sky-50 text-sky-700 border-sky-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function money(n) {
  return `Rs ${Number(n || 0).toLocaleString()}`;
}

export function monthLabel(month, year) {
  if (!month || !year) return "—";
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function payCycleRange(month, year, cycleEndDay = 25) {
  const endDay = Math.min(28, Math.max(1, Number(cycleEndDay) || 25));
  const end = new Date(year, month - 1, endDay);
  const start = new Date(year, month - 2, endDay + 1);
  return { start, end };
}

export function formatCycleDate(d) {
  const raw = String(d || "");
  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = ymd
    ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]))
    : new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cycleLabel(month, year, cycleEndDay = 25, run) {
  if (run?.periodStart && run?.periodEnd) {
    return `${formatCycleDate(run.periodStart)} – ${formatCycleDate(run.periodEnd)}`;
  }
  if (!month || !year) return "—";
  const { start, end } = payCycleRange(month, year, cycleEndDay);
  return `${formatCycleDate(start)} – ${formatCycleDate(end)}`;
}

export function canManagePayroll(role) {
  return ["ADMIN", "SUBADMIN", "HR_ADMIN"].includes(role);
}

export function canViewPayrollRun(role) {
  return ["ADMIN", "SUBADMIN", "HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"].includes(role);
}

export function monthOptions(count = 18, cycleEndDay = 25) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const name = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    return {
      value: `${year}-${month}`,
      label: `${name} · ${cycleLabel(month, year, cycleEndDay)}`,
      month,
      year,
    };
  });
}
