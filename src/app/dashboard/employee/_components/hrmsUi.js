"use client";

import { fleet } from "@/app/_Components/fleet/fleetTheme";

/** Align HRMS with fleet / CRM professional tokens */
export const hrms = {
  page: fleet.page,
  shell: fleet.card,
  input: fleet.input,
  label:
    "block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5",
  primaryBtn: fleet.primaryBtn,
  secondaryBtn: fleet.secondaryBtn,
  dangerBtn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition",
};

export const panelClass = `${hrms.shell} p-5`;
export const inputClass = hrms.input;
export const labelClass = hrms.label;
export const btnPrimary = hrms.primaryBtn;
export const btnCancel = hrms.secondaryBtn;

export function SectionCard({ icon: Icon, title, subtitle, children, action }) {
  return (
    <div className={`${hrms.shell} p-5`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-zinc-700 shrink-0" />}
            {title && (
              <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
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

export function StatCard({ label, value, hint }) {
  return (
    <div className={`${hrms.shell} p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold text-zinc-900 tabular-nums tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 break-words capitalize">
        {value || "—"}
      </p>
    </div>
  );
}

export function StatusBadge({ active, label }) {
  const isOn =
    active !== false &&
    label !== "de active" &&
    label !== "inactive" &&
    label !== "Deactive";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
        isOn
          ? "bg-green-500/15 text-green-700 border-green-500/25"
          : "bg-zinc-100 text-zinc-600 border-zinc-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOn ? "bg-emerald-500" : "bg-zinc-400"
        }`}
      />
      {label || (isOn ? "Active" : "Inactive")}
    </span>
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
