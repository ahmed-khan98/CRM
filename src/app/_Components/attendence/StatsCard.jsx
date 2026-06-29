
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
    
    // Status mapping (case-sensitive issues handle karne ke liye)
    // Agar status "half-day" hai toh hum use "halfday" key mein save karenge
    const statusKey = status === "half-day" ? "halfday" : status;

    if (acc.hasOwnProperty(statusKey)) {
      acc[statusKey]++;
    }

    if (row.isWeekend) {
      acc.weekend++;
    }

    return acc;
  }, initialStats);
};

import React, { memo, useMemo } from 'react';

export const StatCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  activeFilter, 
  onClick, 
  filterId, 
  palette 
}) => {
  const isActive = activeFilter === filterId;
  const containerClasses = useMemo(() => `
    cursor-pointer flex-1 min-w-[100px] relative overflow-hidden flex flex-col gap-1 p-2 
    rounded-2xl border-2 transition-all duration-300 text-left select-none
    ${palette?.bg} 
    ${isActive 
      ? `${palette.activeBorder} ring-4 ${palette.ring} scale-[1.03] shadow-lg z-10` 
      : `${palette.border} hover:scale-[1.02] hover:shadow-md `
    }
  `, [isActive, palette]); 

  return (
    <button onClick={onClick} className={containerClasses}>
      {/* Background Ghost Icon */}
      <Icon className={`absolute -right-2 -bottom-2 h-10 w-10 opacity-[0.10] ${palette.ghost} transition-transform duration-500 ${isActive ? 'scale-110 rotate-12' : ''}`} />

      <div className="flex items-center justify-between relative z-10 mb-1">
        <div className={`p-1 rounded-xl ${palette.iconBg} transition-colors`}>
          <Icon className={`h-3 w-3 ${palette.iconText}`} />
        </div>
        
        {isActive && filterId && (
          <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-lg animate-pulse ${palette.badge}`}>
            Active
          </span>
        )}
          <p className={`text-xl font-black leading-none tabular-nums tracking-tight ${palette.valueText}`}>
          {value || 0}
        </p>
      </div>

      <div className="relative z-10">
      
        <p className={`text-[9px] font-bold uppercase tracking-widest  opacity-80 ${palette.labelText}`}>
          {label}
        </p>
      </div>
    </button>
  );
});

// Debugging ke liye zaroori hai jab memo use ho raha ho
StatCard.displayName = "StatCard";