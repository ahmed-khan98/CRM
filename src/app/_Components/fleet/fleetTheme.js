/** Fleet module UI tokens — CRM zinc theme (matches PageHeader / Client UI) */
export const fleet = {
  page: "min-h-full pb-6",
  title: "text-lg font-semibold text-zinc-900 tracking-tight",
  subtitle: "mt-1 text-sm text-zinc-500",
  primaryBtn:
    "inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-ink hover:bg-zinc-800 text-white px-4 py-2 text-sm font-medium shadow-sm transition-all",
  secondaryBtn:
    "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
  card: "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm",
  filterBar:
    "flex flex-col lg:flex-row gap-3 lg:items-center rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm",
  input:
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
  select:
    "rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:border-zinc-400",
  tableHead:
    "table-head-cell text-left bg-zinc-50 border-b border-zinc-200",
  tableRow: "border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors",
  tableCell: "px-4 py-3 text-sm text-zinc-800",
  modalOverlay:
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
  modalPanel:
    "relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-[#050505] border border-white/[0.08] shadow-2xl flex flex-col",
  modalTitle: "text-lg font-semibold text-white",
  modalLabel: "block text-xs font-medium text-zinc-300 mb-2",
  modalInput:
    "w-full min-h-[42px] rounded-xl border border-[#27272a] bg-[#121212] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a3a3a3] focus:ring-0",
  modalSelect:
    "w-full min-h-[42px] rounded-xl border border-[#27272a] bg-[#121212] px-4 py-2 text-sm text-white focus:outline-none focus:border-[#a3a3a3] focus:ring-0",
  modalTextarea:
    "w-full rounded-xl border border-[#27272a] bg-[#121212] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a3a3a3] focus:ring-0 resize-none",
  modalCancelBtn:
    "px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors",
  // Hex colors — theme remaps bg-zinc-100/bg-white and makes this look disabled
  modalPrimaryBtn:
    "inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#f4f4f5] text-[#09090b] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer",
  modalFooter:
    "flex justify-end gap-2 px-6 py-4 border-t border-white/[0.06] shrink-0",
  modalBody: "flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar-dark",
  modalCloseBtn:
    "p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors",
  statusActive:
    "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 px-2 py-1 text-xs font-medium uppercase tracking-wide",
  statusInactive:
    "inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/50 px-2 py-1 text-xs font-medium uppercase tracking-wide",
  statusAvailable:
    "inline-flex items-center rounded-full bg-green-500/15 text-green-700 border border-green-500/25 px-2 py-1 text-xs font-medium uppercase tracking-wide",
  statusRented:
    "inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/25 px-2 py-1 text-xs font-medium uppercase tracking-wide",
  statusMaintenance:
    "inline-flex items-center rounded-full bg-orange-500/15 text-orange-700 border border-orange-500/25 px-2 py-1 text-xs font-medium uppercase tracking-wide",
  statusRetired:
    "inline-flex items-center rounded-full bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-1 text-xs font-medium uppercase tracking-wide",
};

/** react-select styles matching Add Vehicle modal */
export const modalSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#121212",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: state.isFocused ? "#a3a3a3" : "#27272a",
    boxShadow: "none",
    borderRadius: 12,
    minHeight: 42,
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    background: "#18181b",
    zIndex: 50,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #27272a",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused || state.isSelected ? "#27272a" : "#18181b",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#f4f4f5", fontSize: 13 }),
  multiValue: (base) => ({
    ...base,
    background: "#27272a",
    borderRadius: 8,
  }),
  multiValueLabel: (base) => ({ ...base, color: "#e4e4e7", fontSize: 12 }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#a1a1aa",
    ":hover": { background: "#3f3f46", color: "#fff" },
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
