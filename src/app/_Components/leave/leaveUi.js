import { PALETTES_DARK } from "@/app/utilities/attendence";

export const LEAVE_PALETTES = {
  pending: PALETTES_DARK.late,
  approved: PALETTES_DARK.present,
  rejected: PALETTES_DARK.absent,
  onLeave: PALETTES_DARK["half-day"],
  month: {
    bg: "bg-violet-950/70",
    border: "border-violet-500/40",
    activeBorder: "border-violet-400/60",
    ring: "ring-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconText: "text-violet-400",
    labelText: "text-violet-400",
    valueText: "text-violet-300",
    ghost: "text-violet-500",
    badge: "bg-violet-500/15 text-violet-300",
  },
};

export const STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-600 border-rose-200",
};

export const STATUS_DOT = {
  pending: "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
};

export function formatLeaveName(name) {
  if (!name) return "—";
  return String(name)
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function formatLeaveDate(d) {
  if (!d) return "—";
  const date = new Date(`${d}T00:00:00`);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatLeaveDay(row) {
  const date = formatLeaveDate(row?.fromDate || row?.toDate);
  if (row?.halfDay) return `${date} · Half`;
  return date;
}

export function canManageTeamLeave(role) {
  return ["ADMIN", "SUBADMIN", "HR_ADMIN", "DEP_ADMIN"].includes(role);
}

export function canManageLeaveSettings(role) {
  return ["ADMIN", "SUBADMIN", "HR_ADMIN"].includes(role);
}
