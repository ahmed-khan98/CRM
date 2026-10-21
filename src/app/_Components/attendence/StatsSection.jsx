import React from "react";
import { StatCard, STAT_CARD_HEIGHT } from "./StatsCard";

/**
 * KPI strip (Attendance / Break / Leave).
 * layout="scroll" (default): single-row horizontal scroll on mobile (Attendance/Break).
 * layout="grid": 2-col mobile grid for Leave (~5 cards) with tinted StatCard backgrounds.
 */
const StatsSection = React.memo(
  ({ statCards, activeFilter, toggleFilter, layout = "scroll" }) => {
    if (layout === "grid") {
      return (
        <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.id ?? card.label ?? "total"}
              className={`${STAT_CARD_HEIGHT} min-w-0`}
            >
              <StatCard
                {...card}
                activeFilter={activeFilter}
                filterId={card.id}
                onClick={() => card.id && toggleFilter(card.id)}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className="-mx-1 min-w-0 overflow-x-auto overscroll-x-contain px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex w-max min-w-full flex-nowrap gap-2.5 snap-x snap-mandatory md:w-full">
          {statCards.map((card) => (
            <div
              key={card.id ?? card.label ?? "total"}
              className={`${STAT_CARD_HEIGHT} w-[128px] shrink-0 snap-start md:w-0 md:min-w-[110px] md:flex-1`}
            >
              <StatCard
                {...card}
                activeFilter={activeFilter}
                filterId={card.id}
                onClick={() => card.id && toggleFilter(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

StatsSection.displayName = "StatsSection";

export default StatsSection;
