export const PRIORITY_CONFIG = {
  critical: { label: "Critical", badge: "bg-rose-500/15 text-rose-300 border-rose-500/30", dot: "bg-rose-400", cardBadge: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  high:     { label: "High",     badge: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400", cardBadge: "bg-orange-500/15 text-amber-300 border-orange-500/30" },
  medium:   { label: "Medium",   badge: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400", cardBadge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  low:      { label: "Low",      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400", cardBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
};

export const STATUS_CONFIG = {
  todo:        { label: "To Do",       style: "bg-zinc-800 text-zinc-300 border-zinc-700" },
  "in-progress": { label: "In Progress", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  "in-review": { label: "In Review",   style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  done:        { label: "Done",        style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
};

export const KANBAN_COLUMNS = [
  { id: "todo",        label: "To Do",       accent: "border-t-zinc-500",    countBg: "bg-zinc-800 text-zinc-300",       dot: "bg-zinc-400" },
  { id: "in-progress", label: "In Progress", accent: "border-t-blue-500",    countBg: "bg-sky-500/15 text-sky-300",      dot: "bg-sky-400" },
  { id: "in-review",   label: "In Review",   accent: "border-t-amber-500",   countBg: "bg-amber-500/15 text-amber-300",  dot: "bg-amber-400" },
  { id: "done",        label: "Done",        accent: "border-t-emerald-500", countBg: "bg-emerald-500/15 text-emerald-300", dot: "bg-emerald-400" },
];

export const PROJECT_STATUS_CONFIG = {
  active:    { label: "ACTIVE",    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" },
  completed: { label: "Completed", style: "bg-sky-50 text-sky-700 border-sky-200" },
  "on-hold": { label: "On Hold",   style: "bg-amber-50 text-amber-700 border-amber-200" },
  archived:  { label: "Archived",  style: "bg-zinc-50 text-zinc-500 border-zinc-200" },
};

export const PROJECT_STATUS_OPTIONS = [
  { value: "active",    label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold",   label: "On Hold" },
  { value: "archived",  label: "Archived" },
];

export const PROJECT_STATUS_COUNTS = [
  { key: "todo",        label: "To Do",       color: "text-zinc-500",    bg: "bg-zinc-50" },
  { key: "in-progress", label: "In Progress", color: "text-sky-700",    bg: "bg-sky-50" },
  { key: "in-review",   label: "In Review",   color: "text-amber-700",   bg: "bg-amber-50" },
  { key: "done",        label: "Done",        color: "text-emerald-700", bg: "bg-emerald-50" },
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
    backgroundColor: "#121212",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: state.isFocused ? "#a3a3a3" : "#27272a",
    boxShadow: "none",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    color: "#e4e4e7",
    ":hover": { borderColor: "#52525b" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#27272a"
      : state.isFocused
        ? "#1c1c1f"
        : "#18181b",
    color: "#fafafa",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    zIndex: 99,
    backgroundColor: "#18181b",
    border: "1px solid #3f3f46",
  }),
  menuList: (base) => ({ ...base, backgroundColor: "#18181b" }),
  multiValue: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    backgroundColor: "#27272a",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#e4e4e7" }),
  singleValue: (base) => ({ ...base, fontWeight: 600, color: "#e4e4e7" }),
  input: (base) => ({ ...base, color: "#fafafa" }),
  placeholder: (base) => ({ ...base, color: "#71717a" }),
  dropdownIndicator: (base) => ({ ...base, color: "#71717a" }),
  clearIndicator: (base) => ({ ...base, color: "#71717a" }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: "#3f3f46" }),
};
