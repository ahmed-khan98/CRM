import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

const tones = {
  success: {
    wrap: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  error: {
    wrap: "border-rose-200 bg-rose-50 text-rose-600",
    icon: AlertCircle,
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50 text-amber-700",
    icon: TriangleAlert,
  },
  info: {
    wrap: "border-sky-200 bg-sky-50 text-sky-700",
    icon: Info,
  },
};

export default function Alert({
  tone = "info",
  title,
  children,
  className = "",
}) {
  const config = tones[tone] || tones.info;
  const Icon = config.icon;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-2xl border px-4 py-3 ${config.wrap} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        {children ? (
          <p className={`text-sm ${title ? "mt-1 opacity-90" : ""}`}>{children}</p>
        ) : null}
      </div>
    </div>
  );
}
