/**
 * Shared visual system for public careers / joining / offer-respond pages.
 * Stronger contrast than zinc-50 + white (was washing out fields).
 */
export const pub = {
  page: "min-h-screen bg-[#e8edf3] text-slate-900",
  pageCenter: "flex min-h-screen items-center justify-center bg-[#e8edf3] px-4",
  shell: "mx-auto max-w-3xl px-4 py-8 sm:py-10",
  shellWide: "mx-auto max-w-5xl px-4 py-8",
  shellNarrow: "mx-auto max-w-xl px-4 py-8 sm:py-10",
  card: "rounded-2xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:p-6",
  cardPad: "rounded-2xl border border-slate-300/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
  headerBar:
    "border-b border-slate-300 bg-[#0f172a] text-white",
  field:
    "w-full rounded-xl border border-slate-300 bg-[#f1f5f9] px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner outline-none transition focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-700/20 disabled:opacity-60",
  label:
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600",
  muted: "text-sm text-slate-600",
  mutedXs: "text-xs text-slate-500",
  link: "text-sm font-medium text-teal-800 hover:text-teal-950 hover:underline",
  primaryBtn:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 disabled:opacity-60",
  secondaryBtn:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60",
  sectionTitle: "text-sm font-semibold text-slate-900",
  badge:
    "inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700",
  jobCard:
    "block rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm transition hover:border-teal-700/40 hover:shadow-md",
};
