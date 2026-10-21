"use client";

import Button from "./Button";

export default function DataTableToolbar({
  selectedCount = 0,
  actions = [],
  children,
  className = "",
}) {
  if (!selectedCount && !children) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm ${className}`}
    >
      {selectedCount > 0 && (
        <span className="text-xs font-semibold text-slate-700">
          {selectedCount} selected
        </span>
      )}
      {selectedCount > 0 && actions.length > 0 && (
        <span className="text-slate-300">—</span>
      )}
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.key || action.label}
            variant={action.variant || "secondary"}
            className="h-8 px-2.5 text-xs"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {action.label}
          </Button>
        );
      })}
      {children}
    </div>
  );
}
