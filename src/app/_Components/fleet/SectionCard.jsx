"use client";

import { memo } from "react";
import { fleet } from "./fleetTheme";

function SectionCard({ icon: Icon, title, children, action }) {
  return (
    <div className={`${fleet.card} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-zinc-700" />}
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default memo(SectionCard);
