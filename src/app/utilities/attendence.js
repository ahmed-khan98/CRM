import { AlertCircle, BedDouble, Clock, Coffee, UserCheck, UserX } from "lucide-react";
import moment from "moment-timezone";

export function Tooltip({ text, children }) {
  return (
    <div className="relative group/tip inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-[10px] font-semibold bg-zinc-800 text-white rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
        {text}
      </div>
    </div>
  );
}

export const calculateDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return "-";
  const start = moment(inTime);
  const end = moment(outTime);
  const diff = moment.duration(end.diff(start));
  const hours = Math.floor(diff.asHours());
  const minutes = diff.minutes();
  return hours > 0 || minutes > 0 ? `${hours}hr ${minutes}min` : "-";
};

export const onlyWorkingHours = (inTime, outTime, totalBreakMinutes) => {
  if (!inTime || !outTime) return "0hr 0min";

  const totalMinutes = moment(outTime).diff(moment(inTime), "minutes");
  const breakMinutes = totalBreakMinutes || 0;
  const workingMinutes = totalMinutes - breakMinutes;

  if (workingMinutes <= 0) return "0hr 0min";

  const hours = Math.floor(workingMinutes / 60);
  const mins = workingMinutes % 60;
  return `${hours}hr ${mins}min`;
};

export const getStatusClasses = (status) => {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-700 border-green-200";
    case "full-day":
      return "bg-blue-200 text-blue-700 border-blue-200";
    case "late":
    case "half-day":
      return "bg-yellow-200 text-yellow-800 border-yellow-300";
    case "absent":
      return "bg-red-200 text-red-700 border-red-200";
    case "active":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

export const formatTimeOnly = (timeStr) => {
  if (!timeStr) return "-";
  return moment(timeStr).format("hh:mm A");
};

export const formatBreakMinutes = (minutes) => {
  if (minutes == null || minutes < 0) return "-";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0) return `${mins}min`;
  if (mins === 0) return `${hrs}hr`;

  return `${hrs}hr ${mins}min`;
};

const STATUS_CONFIG = {
  present: {
    label: "Present",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  late: {
    label: "Late",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  absent: {
    label: "Absent",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  'de active': {
    label: "Deactive",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  "half-day": {
    label: "Half Day",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  discrepancy: {
    label: "Discrepancy",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  weekend: {
    label: "Off",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    dot: "bg-indigo-400",
  },
  upcoming: {
    label: "—",
    bg: "bg-zinc-100",
    text: "text-zinc-400",
    border: "border-zinc-200",
    dot: "bg-zinc-300",
  },
  holiday: {
    label: "Holiday",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
};

export const getStatusConfig = (s) =>
  STATUS_CONFIG[s] ?? STATUS_CONFIG.upcoming;

export const getAllTableData = (isFetching, data, viewType, customRange) => {
  if (isFetching || !data?.data) return [];
  const now = moment();
  let start, end;

  if (viewType === "custom_range" && customRange.start) {
    start = moment(customRange.start).startOf("day");
    const selectedEnd = customRange.end
      ? moment(customRange.end).endOf("day")
      : moment(customRange.start).endOf("day");
    end = selectedEnd.isAfter(now) ? now.clone().endOf("day") : selectedEnd;
  } else {
    start = moment().startOf("month");
    end = now.clone().endOf("day");
  }

  const recordMap = {};
  data.data.forEach((r) => {
    recordMap[moment(r.shiftDate).format("YYYY-MM-DD")] = r;
  });

  const dates = [];
  let current = moment(start);
  while (current.isSameOrBefore(end, "day")) {
    const dateStr = current.format("YYYY-MM-DD");
    const dayName = current.format("dddd");
    const isWeekend = dayName === "Saturday" || dayName === "Sunday";

    const record = recordMap[dateStr] || null;
    const now2 = moment().tz("Asia/Karachi");
    const currentHour = now2.hour();
    const effectiveTodayStr =
      currentHour < 5
        ? now2.clone().subtract(1, "days").format("YYYY-MM-DD")
        : now2.format("YYYY-MM-DD");
    const isPastShift = moment(dateStr).isBefore(effectiveTodayStr, "day");
    const timeInMoment = record?.timeIn
      ? moment(record.timeIn).tz("Asia/Karachi")
      : null;
    const hoursSinceIn = timeInMoment
      ? now2.diff(timeInMoment, "hours", true)
      : 0;
    const isDiscrepancy =
      !!record?.timeIn &&
      !record?.timeOut &&
      (hoursSinceIn > 20 || isPastShift);

    // computedStatus: API record.status handles "half-day" directly
    let computedStatus = "upcoming";
    if (isWeekend) computedStatus = "weekend";
    else if (isDiscrepancy) computedStatus = "discrepancy";
    else if (record)
      computedStatus = record.status; // "present" | "absent" | "late" | "half-day"
    else if (current.isSameOrBefore(now, "day")) computedStatus = "absent";

    dates.push({
      date: dateStr,
      dayName,
      isWeekend,
      isPastOrToday: current.isSameOrBefore(now, "day"),
      isToday: current.isSame(now, "day"),
      record,
      computedStatus,
    });
    current.add(1, "day");
  }
  return dates.sort((a, b) => moment(b.date).diff(moment(a.date)));
};

export const PALETTES = {
  present:     { bg: "bg-emerald-50",  border: "border-emerald-200",  activeBorder: "border-emerald-400",  ring: "ring-emerald-200",  iconBg: "bg-emerald-100",  iconText: "text-emerald-600",  labelText: "text-emerald-500",  valueText: "text-emerald-800",  ghost: "text-emerald-300",  badge: "bg-emerald-200 text-emerald-700"  },
  absent:      { bg: "bg-rose-50",     border: "border-rose-200",     activeBorder: "border-rose-400",     ring: "ring-rose-200",     iconBg: "bg-rose-100",     iconText: "text-rose-600",     labelText: "text-rose-400",     valueText: "text-rose-800",     ghost: "text-rose-300",     badge: "bg-rose-200 text-rose-700"        },
  late:        { bg: "bg-amber-50",    border: "border-amber-200",    activeBorder: "border-amber-400",    ring: "ring-amber-200",    iconBg: "bg-amber-100",    iconText: "text-amber-600",    labelText: "text-amber-500",    valueText: "text-amber-800",    ghost: "text-amber-300",    badge: "bg-amber-200 text-amber-700"      },
  'half-day':     { bg: "bg-sky-50",      border: "border-sky-200",      activeBorder: "border-sky-400",      ring: "ring-sky-200",      iconBg: "bg-sky-100",      iconText: "text-sky-600",      labelText: "text-sky-400",      valueText: "text-sky-800",      ghost: "text-sky-300",      badge: "bg-sky-200 text-sky-700"          },
  discrepancy: { bg: "bg-orange-50",   border: "border-orange-200",   activeBorder: "border-orange-400",   ring: "ring-orange-200",   iconBg: "bg-orange-100",   iconText: "text-orange-600",   labelText: "text-orange-400",   valueText: "text-orange-800",   ghost: "text-orange-300",   badge: "bg-orange-200 text-orange-700"    },
  weekend:     { bg: "bg-indigo-50",   border: "border-indigo-200",   activeBorder: "border-indigo-400",   ring: "ring-indigo-200",   iconBg: "bg-indigo-100",   iconText: "text-indigo-600",   labelText: "text-indigo-400",   valueText: "text-indigo-800",   ghost: "text-indigo-300",   badge: "bg-indigo-200 text-indigo-700"    },
  total:       { bg: "bg-zinc-100",    border: "border-zinc-200",     activeBorder: "border-zinc-400",     ring: "ring-zinc-200",     iconBg: "bg-zinc-200",     iconText: "text-zinc-500",     labelText: "text-zinc-400",     valueText: "text-zinc-800",     ghost: "text-zinc-300",     badge: "bg-zinc-300 text-zinc-600"        },
};

export const calculateAttendanceStats = (data, options = {}) => {
  const {
    getStatus = (item) => item?.computedStatus,   // default (My Attendance)
    isWeekend = (item) => item?.isWeekend,        // default weekend check
    isAbsent = (item) => false                    // optional override
  } = options;

  return data.reduce(
    (acc, item) => {
      const weekend = isWeekend(item);

      if (weekend) {
        acc.weekend++;
        return acc;
      }

      const status = getStatus(item);

      if (isAbsent(item) || status === "absent") acc.absent++;
      else if (status === "late") acc.late++;
      else if (status === "discrepancy") acc.discrepancy++;
      else if (status === "half-day") acc.halfday++;
      else if (status === "present") acc.present++;

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

const DEFAULT_CARD_CONFIG = {
  present:     { label: "Present",     icon: UserCheck },
  absent:      { label: "Absent",      icon: UserX },
  late:        { label: "Late",        icon: Clock },
  "half-day":  { label: "Half Day",    icon: Coffee },
  discrepancy: { label: "Discrepancy", icon: AlertCircle },
  weekend:     { label: "Weekends",    icon: BedDouble },
};

export const getStatCards = ({
  stats,
  data,
  palettes,
  config = DEFAULT_CARD_CONFIG,
  extraCard, // custom last card
}) => {
  const cards = Object.entries(config).map(([key, cfg]) => ({
    id: key,
    label: cfg.label,
    icon: cfg.icon,
    value: stats[key === "half-day" ? "halfday" : key],
    palette: PALETTES[key],
  }));

  // optional extra card (Working Days / Total etc.)
  if (extraCard) {
    cards.push({
      id: null,
      ...extraCard,
      value:
        typeof extraCard.getValue === "function"
          ? extraCard.getValue(data)
          : extraCard.value,
    });
  }

  return cards;
};
