const STATUS_CLASS = {
  draft: "text-zinc-300 bg-zinc-800 border border-zinc-600",
  cancelled: "text-zinc-300 bg-zinc-800 border border-zinc-600",
  pending: "text-amber-300 bg-amber-500/15 border border-amber-500/30",
  paid: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  completed: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  active: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  partial: "text-sky-300 bg-sky-500/15 border border-sky-500/30",
  scheduled: "text-sky-300 bg-sky-500/15 border border-sky-500/30",
  missed: "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  failed: "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  deactive: "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  refunded: "text-zinc-200 bg-zinc-800 border border-zinc-600",
  default: "text-zinc-300 bg-zinc-800 border border-zinc-600",
};

const ACTION_STATUS_CLASS = {
  "no action": "text-zinc-300 bg-zinc-800 border border-zinc-600",
  "no answer": "text-amber-300 bg-amber-500/15 border border-amber-500/30",
  invalid: "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  "in loop": "text-zinc-200 bg-zinc-800 border border-zinc-600",
  general: "text-amber-300 bg-amber-500/15 border border-amber-500/30",
  interested: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  "not interested": "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  schedule: "text-sky-300 bg-sky-500/15 border border-sky-500/30",
  active: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  "de active": "text-rose-300 bg-rose-500/15 border border-rose-500/30",
  SUBADMIN: "text-zinc-300 bg-zinc-800 border border-zinc-600",
  DEP_ADMIN: "text-amber-300 bg-amber-500/15 border border-amber-500/30",
  HR_ADMIN: "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30",
  FINANCE_ADMIN: "text-sky-300 bg-sky-500/15 border border-sky-500/30",
  USER: "text-sky-300 bg-sky-500/15 border border-sky-500/30",
  default: "text-zinc-300 bg-zinc-800 border border-zinc-600",
};

export const getActionStatusColor = (s) =>
  ACTION_STATUS_CLASS[s] || ACTION_STATUS_CLASS.default;

export const getStatusColor = (s) => STATUS_CLASS[s] || STATUS_CLASS.default;