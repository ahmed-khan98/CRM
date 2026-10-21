/** Payroll / StatusBadge chrome — rounded-full pills across CRM */
export const BADGE_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium";

const tones = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  error: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  neutral: "bg-zinc-800 text-zinc-300 border-zinc-600",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`${BADGE_BASE} ${tones[tone] || tones.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
