/** Fleet module UI tokens — CRM zinc theme (matches PageHeader / Client UI) */
export const fleet = {
  page: "min-h-full -mx-1 px-1 sm:px-2 pb-6",
  title: "text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight",
  subtitle: "mt-1 text-sm text-zinc-500",
  primaryBtn:
    "inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2.5 text-sm font-bold shadow-lg shadow-zinc-900/15 transition-all",
  secondaryBtn:
    "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50",
  card: "rounded-2xl border border-zinc-200/80 bg-white shadow-sm",
  filterBar:
    "flex flex-col lg:flex-row gap-2 lg:items-center rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-sm",
  input:
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
  select:
    "rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 focus:outline-none focus:border-zinc-400",
  tableHead:
    "text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-4 py-3.5 border-b border-zinc-100",
  tableRow: "border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors",
  tableCell: "px-4 py-4 text-sm text-zinc-800",
  modalOverlay:
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
  modalPanel:
    "relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-[#0f1419] border border-white/[0.08] shadow-2xl flex flex-col",
  modalTitle: "text-lg font-bold text-white",
  modalLabel: "block text-[12px] font-medium text-zinc-300 mb-1.5",
  modalInput:
    "w-full rounded-xl border border-white/[0.1] bg-[#161b22] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/10",
  modalSelect:
    "w-full rounded-xl border border-white/[0.1] bg-[#161b22] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-400",
  modalTextarea:
    "w-full rounded-xl border border-white/[0.1] bg-[#161b22] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/10 resize-none",
  modalCancelBtn:
    "px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition-colors",
  modalPrimaryBtn:
    "px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-60 transition-colors",
  modalFooter:
    "flex justify-end gap-2 px-6 py-4 border-t border-white/[0.06] shrink-0",
  modalBody: "flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar-dark",
  modalCloseBtn:
    "p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors",
  statusActive:
    "inline-flex items-center rounded-full bg-green-500/15 text-green-700 border border-green-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  statusInactive:
    "inline-flex items-center rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  statusAvailable:
    "inline-flex items-center rounded-full bg-green-500/15 text-green-700 border border-green-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  statusRented:
    "inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  statusMaintenance:
    "inline-flex items-center rounded-full bg-orange-500/15 text-orange-700 border border-orange-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  statusRetired:
    "inline-flex items-center rounded-full bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
};

/** react-select styles matching Add Vehicle modal */
export const modalSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#161b22",
    borderColor: state.isFocused ? "rgba(161,161,170,0.8)" : "rgba(255,255,255,0.1)",
    boxShadow: "none",
    borderRadius: 12,
    minHeight: 42,
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    background: "#161b22",
    zIndex: 50,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused || state.isSelected ? "#1c2330" : "#161b22",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#fff", fontSize: 13 }),
  multiValue: (base) => ({
    ...base,
    background: "#1c2330",
    borderRadius: 8,
  }),
  multiValueLabel: (base) => ({ ...base, color: "#e4e4e7", fontSize: 12 }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#a1a1aa",
    ":hover": { background: "#27272a", color: "#fff" },
  }),
  input: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "#71717a", fontSize: 13 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#71717a" }),
  clearIndicator: (base) => ({ ...base, color: "#71717a" }),
};

export function fleetStatusClass(status) {
  const map = {
    active: fleet.statusActive,
    inactive: fleet.statusInactive,
    available: fleet.statusAvailable,
    rented: fleet.statusRented,
    maintenance: fleet.statusMaintenance,
    retired: fleet.statusRetired,
  };
  return map[status] || fleet.statusInactive;
}
