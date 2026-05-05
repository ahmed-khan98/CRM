import React from "react";
import { StatCard } from "./StatsCard";

const StatsSection = React.memo(({ statCards, activeFilter, toggleFilter }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {statCards.map((card) => (
        <StatCard
          key={card.id ?? "total"}
          {...card}
          activeFilter={activeFilter}
          filterId={card.id}
          onClick={() => card.id && toggleFilter(card.id)}
        />
      ))}
    </div>
  );
});

export default StatsSection;