import { BADGE_BASE } from "./Badge";

/** Project-wide Active / DE ACTIVE chrome (announcement + employee + HRMS). */
export const ACTIVE_STATUS_TONES = {
  active: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50",
    dot: "bg-emerald-400",
    label: "ACTIVE",
  },
  inactive: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/50",
    dot: "bg-rose-400",
    label: "DE ACTIVE",
  },
};

const TONES = {
  active: ACTIVE_STATUS_TONES.active,
  inactive: ACTIVE_STATUS_TONES.inactive,
  pending: {
    className: "bg-amber-500/10 text-amber-400 border-amber-500/40",
    dot: "bg-amber-400",
  },
  approved: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  rejected: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
  completed: {
    className: "bg-zinc-800 text-zinc-300 border-zinc-600",
    dot: "bg-zinc-400",
  },
  cancelled: {
    className: "bg-zinc-800 text-zinc-400 border-zinc-700",
    dot: "bg-zinc-500",
  },
  draft: {
    className: "bg-amber-500/10 text-amber-400 border-amber-500/40",
    dot: "bg-amber-400",
  },
  blocked: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
  processing: {
    className: "bg-zinc-800 text-zinc-300 border-zinc-600",
    dot: "bg-zinc-400",
  },
  review: {
    className: "bg-transparent text-amber-400 border-amber-500/50",
    dot: "bg-amber-400",
  },
  finalized: {
    className: "bg-zinc-800 text-zinc-300 border-zinc-600",
    dot: "bg-zinc-400",
  },
  paid: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  success: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  warning: {
    className: "bg-amber-500/10 text-amber-400 border-amber-500/40",
    dot: "bg-amber-400",
  },
  danger: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
  info: {
    className: "bg-zinc-800 text-zinc-300 border-zinc-600",
    dot: "bg-zinc-400",
  },
  neutral: {
    className: "bg-zinc-800 text-zinc-400 border-zinc-700",
    dot: "bg-zinc-500",
  },
};

function normalizeStatus(status) {
  const raw = String(status || "neutral").trim().toLowerCase();
  if (
    raw === "de active" ||
    raw === "deactive" ||
    raw === "de-active" ||
    raw === "inactive" ||
    raw === "disabled" ||
    raw === "off"
  ) {
    return "inactive";
  }
  if (raw === "enabled" || raw === "on" || raw === "live") return "active";
  return raw.replace(/\s+/g, "_").replace(/_/g, " ").split(" ")[0] || "neutral";
}

function resolveLabel(key, status, label) {
  if (key === "active" || key === "inactive") {
    if (label == null || label === "") {
      return ACTIVE_STATUS_TONES[key].label;
    }
    const n = String(label).trim().toLowerCase();
    if (n === "active" || n === "enabled" || n === "on") {
      return ACTIVE_STATUS_TONES.active.label;
    }
    if (
      n === "deactive" ||
      n === "de active" ||
      n === "de-active" ||
      n === "inactive" ||
      n === "disabled" ||
      n === "off"
    ) {
      return ACTIVE_STATUS_TONES.inactive.label;
    }
    return String(label).toUpperCase();
  }
  return label || String(status || key).replace(/_/g, " ");
}

export default function StatusBadge({
  status,
  tone,
  label,
  withDot = true,
  className = "",
}) {
  const key = normalizeStatus(tone || status);
  const visual = TONES[key] || TONES.neutral;
  const text = resolveLabel(key, status, label);
  const isActivePair = key === "active" || key === "inactive";

  return (
    <span
      className={`${BADGE_BASE} w-fit shrink-0 px-2.5 ${
        isActivePair ? "uppercase tracking-wide" : "capitalize"
      } ${visual.className} ${className}`}
    >
      {withDot ? (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${visual.dot}`}
          aria-hidden
        />
      ) : null}
      <span className="leading-none">{text}</span>
    </span>
  );
}
