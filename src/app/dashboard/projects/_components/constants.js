export const PRIORITY_CONFIG = {
  critical: { label: "Critical", badge: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500", cardBadge: "bg-red-500/10 text-red-500 border-red-500/20" },
  high:     { label: "High",     badge: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-500", cardBadge: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  medium:   { label: "Medium",   badge: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400", cardBadge: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  low:      { label: "Low",      badge: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", cardBadge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
};

export const STATUS_CONFIG = {
  todo:        { label: "To Do",       style: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  "in-progress": { label: "In Progress", style: "bg-blue-50 text-blue-600 border-blue-200" },
  "in-review": { label: "In Review",   style: "bg-amber-50 text-amber-600 border-amber-200" },
  done:        { label: "Done",        style: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

export const KANBAN_COLUMNS = [
  { id: "todo",        label: "To Do",       accent: "border-t-zinc-400",    countBg: "bg-zinc-100 text-zinc-500",    dot: "bg-zinc-400" },
  { id: "in-progress", label: "In Progress", accent: "border-t-blue-500",    countBg: "bg-blue-50 text-blue-600",     dot: "bg-blue-500" },
  { id: "in-review",   label: "In Review",   accent: "border-t-amber-500",   countBg: "bg-amber-50 text-amber-600",   dot: "bg-amber-400" },
  { id: "done",        label: "Done",        accent: "border-t-emerald-500", countBg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
];

export const PROJECT_STATUS_CONFIG = {
  active:    { label: "Active",    style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed", style: "bg-blue-50 text-blue-700 border-blue-200" },
  "on-hold": { label: "On Hold",   style: "bg-amber-50 text-amber-700 border-amber-200" },
  archived:  { label: "Archived",  style: "bg-zinc-100 text-zinc-500 border-zinc-200" },
};

export const PROJECT_STATUS_OPTIONS = [
  { value: "active",    label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold",   label: "On Hold" },
  { value: "archived",  label: "Archived" },
];

export const PROJECT_STATUS_COUNTS = [
  { key: "todo",        label: "To Do",       color: "text-zinc-500",    bg: "bg-zinc-100" },
  { key: "in-progress", label: "In Progress", color: "text-blue-600",    bg: "bg-blue-50" },
  { key: "in-review",   label: "In Review",   color: "text-amber-600",   bg: "bg-amber-50" },
  { key: "done",        label: "Done",        color: "text-emerald-600", bg: "bg-emerald-50" },
];

export const TASK_PRIORITIES = [
  { value: "critical", label: "Critical" },
  { value: "high",     label: "High" },
  { value: "medium",   label: "Medium" },
  { value: "low",      label: "Low" },
];

export const TASK_STATUS_OPTIONS = [
  { value: "todo",        label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review",   label: "In Review" },
  { value: "done",        label: "Done" },
];

export const EMPTY_KANBAN_COLUMNS = {
  todo: [],
  "in-progress": [],
  "in-review": [],
  done: [],
};

export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.25rem",
    borderRadius: "0.75rem",
    backgroundColor: "#fafafa",
    borderColor: state.isFocused ? "#18181b" : "#e4e4e7",
    boxShadow: "none",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    ":hover": { borderColor: "#18181b" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: state.isSelected ? "#18181b" : state.isFocused ? "#f4f4f5" : "white",
    color: state.isSelected ? "white" : "#18181b",
  }),
  menu: (base) => ({ ...base, borderRadius: "0.75rem", overflow: "hidden", zIndex: 99 }),
  multiValue: (base) => ({ ...base, borderRadius: "0.5rem", backgroundColor: "#f4f4f5" }),
  singleValue: (base) => ({ ...base, fontWeight: 600 }),
};
