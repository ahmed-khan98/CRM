const PALETTES = {
  present:     { bg: "bg-emerald-50",  border: "border-emerald-200",  activeBorder: "border-emerald-400",  ring: "ring-emerald-200",  iconBg: "bg-emerald-100",  iconText: "text-emerald-600",  labelText: "text-emerald-500",  valueText: "text-emerald-800",  ghost: "text-emerald-300",  badge: "bg-emerald-200 text-emerald-700"  },
  absent:      { bg: "bg-rose-50",     border: "border-rose-200",     activeBorder: "border-rose-400",     ring: "ring-rose-200",     iconBg: "bg-rose-100",     iconText: "text-rose-600",     labelText: "text-rose-400",     valueText: "text-rose-800",     ghost: "text-rose-300",     badge: "bg-rose-200 text-rose-700"        },
  late:        { bg: "bg-amber-50",    border: "border-amber-200",    activeBorder: "border-amber-400",    ring: "ring-amber-200",    iconBg: "bg-amber-100",    iconText: "text-amber-600",    labelText: "text-amber-500",    valueText: "text-amber-800",    ghost: "text-amber-300",    badge: "bg-amber-200 text-amber-700"      },
  halfday:     { bg: "bg-sky-50",      border: "border-sky-200",      activeBorder: "border-sky-400",      ring: "ring-sky-200",      iconBg: "bg-sky-100",      iconText: "text-sky-600",      labelText: "text-sky-400",      valueText: "text-sky-800",      ghost: "text-sky-300",      badge: "bg-sky-200 text-sky-700"          },
  discrepancy: { bg: "bg-orange-50",   border: "border-orange-200",   activeBorder: "border-orange-400",   ring: "ring-orange-200",   iconBg: "bg-orange-100",   iconText: "text-orange-600",   labelText: "text-orange-400",   valueText: "text-orange-800",   ghost: "text-orange-300",   badge: "bg-orange-200 text-orange-700"    },
  weekend:     { bg: "bg-indigo-50",   border: "border-indigo-200",   activeBorder: "border-indigo-400",   ring: "ring-indigo-200",   iconBg: "bg-indigo-100",   iconText: "text-indigo-600",   labelText: "text-indigo-400",   valueText: "text-indigo-800",   ghost: "text-indigo-300",   badge: "bg-indigo-200 text-indigo-700"    },
  total:       { bg: "bg-zinc-100",    border: "border-zinc-200",     activeBorder: "border-zinc-400",     ring: "ring-zinc-200",     iconBg: "bg-zinc-200",     iconText: "text-zinc-500",     labelText: "text-zinc-400",     valueText: "text-zinc-800",     ghost: "text-zinc-300",     badge: "bg-zinc-300 text-zinc-600"        },
};

export const getAttendanceStats = (allData = []) => {
  return allData.reduce(
    (acc, row) => {
      switch (row.computedStatus) {
        case "present":
          acc.present++;
          break;
        case "absent":
          acc.absent++;
          break;
        case "late":
          acc.late++;
          break;
        case "half-day":
          acc.halfday++;
          break;
        case "discrepancy":
          acc.discrepancy++;
          break;
        default:
          break;
      }

      if (row.isWeekend) acc.weekend++;

      return acc;
    },
    {
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      discrepancy: 0,
      weekend: 0,
    }
  );
};

  export function StatCard({ icon: Icon, label, value, activeFilter, onClick, filterId, palette }) {
    const isActive = activeFilter === filterId;
    return (
      <button
        onClick={onClick}
        className={`cursor-pointer flex-1 min-w-[80px] relative overflow-hidden flex flex-col gap-1 px-2 py-2 rounded-xl border-2 transition-all duration-200 text-left
          ${palette.bg} ${isActive
            ? `${palette.activeBorder} ring-2 ${palette.ring} scale-[1.02] shadow-md`
            : `${palette.border} hover:scale-[1.01] hover:shadow-sm`}`}
      >
        <Icon className={`absolute -right-2 -bottom-2 h-12 w-12 opacity-10 ${palette.ghost}`} />
  
        <div className="flex items-center justify-between relative z-10">
          <div className={`p-1 rounded-lg ${palette.iconBg}`}>
            <Icon className={`h-4 w-4 ${palette.iconText}`} />
          </div>
          {isActive && filterId && (
            <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${palette.badge}`}>
              ON
            </span>
          )}
            <p className={`text-xl font-black leading-none tabular-nums relative z-10 ${palette.valueText}`}>
          {value}
        </p>
        </div>
  
        <p className={`text-[9px] font-bold uppercase tracking-widest relative z-10 ${palette.labelText}`}>
          {label}
        </p>
      
      </button>
    );
  }
