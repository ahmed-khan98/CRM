"use client";

import { Plus } from "lucide-react";
import { fleet } from "./fleetTheme";

export default function FleetPageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
      <div>
        <h1 className={fleet.title}>{title}</h1>
        {subtitle && <p className={fleet.subtitle}>{subtitle}</p>}
      </div>
      {actionLabel && (
        <button type="button" onClick={onAction} className={fleet.primaryBtn}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
