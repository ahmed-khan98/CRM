"use client";

import { fleet } from "@/app/_Components/fleet/fleetTheme";
import SaasStatusBadge from "@/app/_Components/ui/saas/StatusBadge";

/** Match CrmSelect / react-select field chrome: #121212 + #27272a */
export const HRMS_FIELD_BG = "#121212";
export const HRMS_FIELD_BORDER = "#27272a";

/** Align HRMS with fleet / CRM professional tokens */
export const hrms = {
  page: fleet.page,
  shell: fleet.card,
  input: [
    "w-full min-h-[42px] rounded-xl border px-3.5 py-2.5 text-[13px]",
    "bg-[#121212] border-[#27272a] text-zinc-100",
    "placeholder:text-zinc-500",
    "focus:outline-none focus:border-[#a3a3a3] focus:ring-0",
    "file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-200",
    "disabled:opacity-60",
  ].join(" "),
  label: "type-label block mb-2",
  primaryBtn:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-50 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50",
  secondaryBtn:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-[#121212] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
  dangerBtn:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50",
};

export const panelClass = `${hrms.shell} p-5`;
export const inputClass = hrms.input;
export const labelClass = hrms.label;
export const btnPrimary = hrms.primaryBtn;
export const btnCancel = hrms.secondaryBtn;

export function SectionCard({ icon: Icon, title, subtitle, children, action }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800  p-5 shadow-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-zinc-100" />}
            {title && (
              <h3 className="text-sm font-medium text-zinc-100">{title}</h3>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ message, action }) {
  return (
    <div className="py-10 text-center space-y-3">
      <p className="text-sm text-zinc-500">{message}</p>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  className = "border-zinc-800  shadow-none",
}) {
  return (
    <div className={`rounded-2xl border p-2 px-4 ${className}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums tracking-tight text-zinc-100">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] leading-tight text-zinc-500">{hint}</p>}
    </div>
  );
}

export function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 break-words capitalize">
        {value || "—"}
      </p>
    </div>
  );
}

/** Maps boolean + label onto shared Active / DE ACTIVE badge. */
export function StatusBadge({ active, label }) {
  const isOn =
    active !== false &&
    label !== "de active" &&
    label !== "inactive" &&
    label !== "Deactive" &&
    label !== "DE ACTIVE";
  return (
    <SaasStatusBadge
      status={isOn ? "active" : "inactive"}
      label={label || (isOn ? "ACTIVE" : "DE ACTIVE")}
    />
  );
}

export function formatMoney(n) {
  if (n == null || n === "") return "—";
  return `Rs ${Number(n).toLocaleString()}`;
}

export function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatShiftTime(v) {
  if (!v) return "—";
  const match = String(v).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(v);
  let hour = Number(match[1]);
  const minute = match[2];
  if (hour === 24 && minute === "00") hour = 0;
  if (hour < 0 || hour > 23 || Number(minute) > 59) return String(v);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}
