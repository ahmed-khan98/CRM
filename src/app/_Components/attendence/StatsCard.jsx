export const getAttendanceStats = (allData = []) => {
  const initialStats = {
    present: 0,
    absent: 0,
    late: 0,
    halfday: 0,
    discrepancy: 0,
    weekend: 0,
  };

  return allData.reduce((acc, row) => {
    const status = row.computedStatus;
    const statusKey = status === "half-day" ? "halfday" : status;

    if (Object.prototype.hasOwnProperty.call(acc, statusKey)) {
      acc[statusKey]++;
    }

    if (row.isWeekend) {
      acc.weekend++;
    }

    return acc;
  }, initialStats);
};

import React, { memo, useMemo } from "react";

/** Fixed height matching Team Attendance KPI strip. Width may vary. */
export const STAT_CARD_HEIGHT = "h-[64px]";

export const StatCard = memo(({
  icon: Icon,
  label,
  value,
  activeFilter,
  onClick,
  filterId,
  palette,
}) => {
  const isActive = Boolean(filterId) && activeFilter === filterId;
  const containerClasses = useMemo(
    () => `
    cursor-pointer ${STAT_CARD_HEIGHT} w-full min-w-0 relative overflow-hidden
    flex flex-col justify-between gap-1 p-2
    rounded-2xl border-2 transition-all duration-200 text-left select-none
    ${palette?.bg}
    ${
      isActive
        ? `${palette.activeBorder} ring-2 ${palette.ring} shadow-md z-10`
        : `${palette.border} hover:shadow-sm`
    }
  `,
    [isActive, palette]
  );

  return (
    <button type="button" onClick={onClick} className={containerClasses}>
      <Icon
        className={`pointer-events-none absolute -right-2 -bottom-2 h-9 w-9 opacity-[0.10] ${palette.ghost}`}
        aria-hidden
      />

      <div className="relative z-10 flex items-start justify-between gap-1">
        <div
          className={`flex size-6 min-h-6 min-w-6 max-h-6 max-w-6 shrink-0 grow-0 self-start items-center justify-center overflow-hidden rounded-full ${palette.iconBg}`}
          style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
        >
          <Icon className={`h-3 w-3 shrink-0 ${palette.iconText}`} aria-hidden />
        </div>
        {isActive && filterId ? (
          <span
            className={`rounded-lg px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide animate-pulse ${palette.badge}`}
          >
            Active
          </span>
        ) : null}
        <p
          className={`text-[20px] font-bold leading-none tabular-nums tracking-tight ${palette.valueText}`}
        >
          {value || 0}
        </p>
      </div>

      <div className="relative z-10 min-h-[1rem]">
        <p
          className={`line-clamp-2 text-[10px] font-medium uppercase leading-tight tracking-wide opacity-80 ${palette.labelText}`}
        >
          {label}
        </p>
      </div>
    </button>
  );
});

StatCard.displayName = "StatCard";
