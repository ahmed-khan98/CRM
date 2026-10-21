import {
  AlertCircle,
  BedDouble,
  Clock,
  Coffee,
  UserCheck,
  UserX,
  Cigarette,
  Bath,
  Monitor,
  HandHeart,
  UtensilsCrossed,
} from "lucide-react";
import moment from "moment-timezone";
import Tooltip from "@/app/_Components/ui/Tooltip";

export { Tooltip };

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
      return "bg-green-100 text-emerald-700 border-emerald-200";
    case "full-day":
      return "bg-blue-200 text-sky-700 border-sky-200";
    case "late":
    case "half-day":
      return "bg-yellow-200 text-amber-700 border-yellow-300";
    case "absent":
      return "bg-red-200 text-rose-600 border-rose-200";
    case "active":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-zinc-50 text-zinc-500 border-zinc-200";
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

export const getShiftEffectiveDate = (
  reference = moment().tz("Asia/Karachi"),
) => {
  const now = moment(reference).tz("Asia/Karachi");
  return now.hour() < 11
    ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
    : now.format("YYYY-MM-DD");
};

export const isDiscrepancyRecord = (record) => {
  if (!record?.timeIn || record?.timeOut) return false;

  const now = moment().tz("Asia/Karachi");
  const shiftEffectiveDate = getShiftEffectiveDate(now);
  const recordDateStr = moment(record.shiftDate).format("YYYY-MM-DD");
  const timeInMoment = moment(record.timeIn).tz("Asia/Karachi");
  const hoursSinceIn = now.diff(timeInMoment, "hours", true);

  return (
    hoursSinceIn > 18 || moment(recordDateStr).isBefore(shiftEffectiveDate)
  );
};

const STATUS_CONFIG = {
  present: {
    label: "Present",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    dot: "bg-emerald-400",
  },
  live: {
    label: "Active",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    dot: "bg-emerald-400",
  },
  late: {
    label: "Late",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/50",
    dot: "bg-amber-400",
  },
  absent: {
    label: "Absent",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/50",
    dot: "bg-rose-400",
  },
  active: {
    label: "ACTIVE",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    dot: "bg-emerald-400",
  },
  "de active": {
    label: "DE ACTIVE",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/50",
    dot: "bg-rose-400",
  },
  "half-day": {
    label: "Half Day",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/50",
    dot: "bg-sky-400",
  },
  discrepancy: {
    label: "Discrepancy",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/50",
    dot: "bg-amber-400",
  },
  weekend: {
    label: "Off",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/50",
    dot: "bg-violet-400",
  },
  upcoming: {
    label: "—",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/40",
    dot: "bg-zinc-500",
  },
  holiday: {
    label: "Holiday",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    dot: "bg-emerald-400",
  },
  "break-in": {
    label: "On Break",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  "break-out": {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  SMOKING: {
    label: "Smoking",
    icon: Cigarette,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  "REST ROOM": {
    label: "Rest Room",
    icon: Bath,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  "SYSTEM IDLE": {
    label: "System Idle",
    icon: Monitor,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  TEA: {
    label: "Tea",
    icon: Coffee,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
  },
  LUNCH: {
    label: "Lunch",
    icon: Coffee,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-green-400",
  },
  OFFICIAL: {
    label: "Official",
    icon: Coffee,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-blue-400",
  },
  PRAYER: {
    label: "Prayer",
    icon: HandHeart,
    bg: "bg-violet-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-400",
  },
  MEAL: {
    label: "Meal",
    icon: UtensilsCrossed,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-green-400",
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
      currentHour < 11
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
      (hoursSinceIn > 18 || isPastShift);

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
  present: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBorder: "border-emerald-400",
    ring: "ring-emerald-200",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
    labelText: "text-emerald-700",
    valueText: "text-emerald-700",
    ghost: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700",
  },
  absent: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    activeBorder: "border-rose-400",
    ring: "ring-rose-200",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    labelText: "text-rose-600",
    valueText: "text-rose-600",
    ghost: "text-rose-600",
    badge: "bg-rose-50 text-rose-600",
  },
  late: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-amber-400",
    ring: "ring-amber-200",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    labelText: "text-amber-700",
    valueText: "text-amber-700",
    ghost: "text-amber-700",
    badge: "bg-amber-50 text-amber-700",
  },
  "half-day": {
    bg: "bg-sky-50",
    border: "border-sky-200",
    activeBorder: "border-sky-400",
    ring: "ring-sky-200",
    iconBg: "bg-sky-50",
    iconText: "text-sky-700",
    labelText: "text-sky-700",
    valueText: "text-sky-700",
    ghost: "text-sky-700",
    badge: "bg-sky-50 text-sky-700",
  },
  discrepancy: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-orange-400",
    ring: "ring-orange-200",
    iconBg: "bg-orange-100",
    iconText: "text-amber-700",
    labelText: "text-amber-700",
    valueText: "text-amber-700",
    ghost: "text-orange-300",
    badge: "bg-orange-200 text-amber-700",
  },
  weekend: {
    bg: "bg-violet-50",
    border: "border-indigo-200",
    activeBorder: "border-zinc-800",
    ring: "ring-zinc-200",
    iconBg: "bg-violet-50",
    iconText: "text-zinc-900",
    labelText: "text-zinc-900",
    valueText: "text-zinc-900",
    ghost: "text-zinc-900",
    badge: "bg-violet-50 text-zinc-900",
  },
  total: {
    bg: "bg-zinc-50",
    border: "border-zinc-200",
    activeBorder: "border-zinc-200",
    ring: "ring-zinc-200",
    iconBg: "bg-zinc-200",
    iconText: "text-zinc-500",
    labelText: "text-zinc-400",
    valueText: "text-zinc-900",
    ghost: "text-zinc-300",
    badge: "bg-zinc-200 text-zinc-500",
  },
  smoking: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-amber-400",
    ring: "ring-amber-200",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    labelText: "text-amber-700",
    valueText: "text-amber-700",
    ghost: "text-amber-700",
    badge: "bg-amber-50 text-amber-700",
  },
  "rest room": {
    bg: "bg-sky-50",
    border: "border-sky-200",
    activeBorder: "border-sky-400",
    ring: "ring-sky-200",
    iconBg: "bg-sky-50",
    iconText: "text-sky-700",
    labelText: "text-sky-700",
    valueText: "text-sky-700",
    ghost: "text-sky-700",
    badge: "bg-sky-50 text-sky-700",
  },
  tea: {
    bg: "bg-amber-50",
    border: "border-yellow-200",
    activeBorder: "border-yellow-400",
    ring: "ring-yellow-200",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
    labelText: "text-yellow-500",
    valueText: "text-amber-700",
    ghost: "text-yellow-300",
    badge: "bg-yellow-200 text-amber-700",
  },
  meal: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBorder: "border-green-400",
    ring: "ring-green-200",
    iconBg: "bg-green-100",
    iconText: "text-emerald-700",
    labelText: "text-green-500",
    valueText: "text-green-800",
    ghost: "text-green-300",
    badge: "bg-green-200 text-emerald-700",
  },
  "system idle": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-orange-400",
    ring: "ring-orange-200",
    iconBg: "bg-orange-100",
    iconText: "text-amber-700",
    labelText: "text-orange-500",
    valueText: "text-amber-700",
    ghost: "text-orange-300",
    badge: "bg-orange-200 text-amber-700",
  },
  prayer: {
    bg: "bg-violet-50",
    border: "border-purple-200",
    activeBorder: "border-purple-400",
    ring: "ring-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    labelText: "text-purple-500",
    valueText: "text-purple-800",
    ghost: "text-purple-300",
    badge: "bg-purple-200 text-purple-700",
  },
  official: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    activeBorder: "border-blue-400",
    ring: "ring-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-sky-700",
    labelText: "text-blue-500",
    valueText: "text-blue-800",
    ghost: "text-blue-300",
    badge: "bg-blue-200 text-sky-700",
  },
  live: {
    bg: "bg-zinc-50",
    border: "border-zinc-200",
    activeBorder: "border-zinc-200",
    ring: "ring-primary-light",
    iconBg: "bg-zinc-200",
    iconText: "text-zinc-900",
    labelText: "text-zinc-900",
    valueText: "text-zinc-900",
    ghost: "text-zinc-300",
    badge: "bg-zinc-200 text-zinc-900",
  },
};

export const calculateAttendanceStats = (data, options = {}) => {
  const {
    getStatus = (item) => item?.computedStatus, // default (My Attendance)
    isWeekend = (item) => item?.isWeekend, // default weekend check
    isAbsent = (item) => false, // optional override
    isDiscrepancy = (item) => isDiscrepancyRecord(item?.record),
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
      if (isDiscrepancy(item)) acc.discrepancy++;
      if (status === "late") acc.late++;
      if (status === "half-day") acc.halfday++;

      const now = moment().tz("Asia/Karachi");
      const shiftEffectiveDate =
        now.hour() < 6
          ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
          : now.format("YYYY-MM-DD");
      const recordDateStr = moment(item?.record?.shiftDate).format(
        "YYYY-MM-DD",
      );
      const isToday = recordDateStr === shiftEffectiveDate;

      if (status === "present" && (item?.record?.timeOut || isToday))
        acc.present++;

      return acc;
    },
    {
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      discrepancy: 0,
      weekend: 0,
    },
  );
};

const DEFAULT_CARD_CONFIG = {
  present: { label: "Present", icon: UserCheck },
  absent: { label: "Absent", icon: UserX },
  late: { label: "Late", icon: Clock },
  "half-day": { label: "Half Day", icon: Coffee },
  discrepancy: { label: "Discrepancy", icon: AlertCircle },
  weekend: { label: "Weekends", icon: BedDouble },
};

export const PALETTES_DARK = {
  present: {
    bg: "bg-emerald-950/70",
    border: "border-emerald-500/40",
    activeBorder: "border-emerald-400/60",
    ring: "ring-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
    labelText: "text-emerald-400",
    valueText: "text-emerald-300",
    ghost: "text-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  absent: {
    bg: "bg-rose-950/70",
    border: "border-rose-500/40",
    activeBorder: "border-rose-400/60",
    ring: "ring-rose-500/20",
    iconBg: "bg-rose-500/20",
    iconText: "text-rose-400",
    labelText: "text-rose-400",
    valueText: "text-rose-300",
    ghost: "text-rose-500",
    badge: "bg-rose-500/15 text-rose-300",
  },
  late: {
    bg: "bg-amber-950/70",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400/60",
    ring: "ring-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
    labelText: "text-amber-400",
    valueText: "text-amber-300",
    ghost: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "half-day": {
    bg: "bg-sky-950/70",
    border: "border-sky-500/40",
    activeBorder: "border-sky-400/60",
    ring: "ring-sky-500/20",
    iconBg: "bg-sky-500/20",
    iconText: "text-sky-400",
    labelText: "text-sky-400",
    valueText: "text-sky-300",
    ghost: "text-sky-500",
    badge: "bg-sky-500/15 text-sky-300",
  },
  discrepancy: {
    bg: "bg-orange-950/70",
    border: "border-orange-500/40",
    activeBorder: "border-orange-400/60",
    ring: "ring-orange-500/20",
    iconBg: "bg-orange-500/20",
    iconText: "text-orange-400",
    labelText: "text-orange-400",
    valueText: "text-orange-300",
    ghost: "text-orange-500",
    badge: "bg-orange-500/15 text-orange-300",
  },
  weekend: {
    bg: "bg-violet-950/70",
    border: "border-violet-500/40",
    activeBorder: "border-violet-400/60",
    ring: "ring-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconText: "text-violet-400",
    labelText: "text-violet-400",
    valueText: "text-violet-300",
    ghost: "text-violet-500",
    badge: "bg-violet-500/15 text-violet-300",
  },
  total: {
    bg: "bg-[#121212]",
    border: "border-zinc-600/50",
    activeBorder: "border-zinc-500",
    ring: "ring-zinc-500/20",
    iconBg: "bg-zinc-800",
    iconText: "text-zinc-300",
    labelText: "text-zinc-500",
    valueText: "text-zinc-100",
    ghost: "text-zinc-600",
    badge: "bg-zinc-700 text-zinc-300",
  },
  live: {
    bg: "bg-zinc-900/90",
    border: "border-zinc-600/50",
    activeBorder: "border-zinc-500",
    ring: "ring-zinc-500/20",
    iconBg: "bg-zinc-700/60",
    iconText: "text-zinc-300",
    labelText: "text-zinc-400",
    valueText: "text-zinc-100",
    ghost: "text-zinc-500",
    badge: "bg-zinc-700 text-zinc-300",
  },
  smoking: {
    bg: "bg-amber-950/70",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400/60",
    ring: "ring-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
    labelText: "text-amber-400",
    valueText: "text-amber-300",
    ghost: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "rest room": {
    bg: "bg-sky-950/70",
    border: "border-sky-500/40",
    activeBorder: "border-sky-400/60",
    ring: "ring-sky-500/20",
    iconBg: "bg-sky-500/20",
    iconText: "text-sky-400",
    labelText: "text-sky-400",
    valueText: "text-sky-300",
    ghost: "text-sky-500",
    badge: "bg-sky-500/15 text-sky-300",
  },
  tea: {
    bg: "bg-amber-950/70",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400/60",
    ring: "ring-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
    labelText: "text-amber-400",
    valueText: "text-amber-300",
    ghost: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  meal: {
    bg: "bg-emerald-950/70",
    border: "border-emerald-500/40",
    activeBorder: "border-emerald-400/60",
    ring: "ring-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
    labelText: "text-emerald-400",
    valueText: "text-emerald-300",
    ghost: "text-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  prayer: {
    bg: "bg-violet-950/70",
    border: "border-violet-500/40",
    activeBorder: "border-violet-400/60",
    ring: "ring-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconText: "text-violet-400",
    labelText: "text-violet-400",
    valueText: "text-violet-300",
    ghost: "text-violet-500",
    badge: "bg-violet-500/15 text-violet-300",
  },
  official: {
    bg: "bg-sky-950/70",
    border: "border-sky-500/40",
    activeBorder: "border-sky-400/60",
    ring: "ring-sky-500/20",
    iconBg: "bg-sky-500/20",
    iconText: "text-sky-400",
    labelText: "text-sky-400",
    valueText: "text-sky-300",
    ghost: "text-sky-500",
    badge: "bg-sky-500/15 text-sky-300",
  },
  "system idle": {
    bg: "bg-orange-950/70",
    border: "border-orange-500/40",
    activeBorder: "border-orange-400/60",
    ring: "ring-orange-500/20",
    iconBg: "bg-orange-500/20",
    iconText: "text-orange-400",
    labelText: "text-orange-400",
    valueText: "text-orange-300",
    ghost: "text-orange-500",
    badge: "bg-orange-500/15 text-orange-300",
  },
};

export const getStatCards = ({
  stats,
  data,
  palettes = PALETTES,
  config = DEFAULT_CARD_CONFIG,
  extraCard, // custom last card
}) => {
  const tone = palettes || PALETTES;
  const cards = Object.entries(config).map(([key, cfg]) => ({
    id: key,
    label: cfg.label,
    icon: cfg.icon,
    value: stats[key === "half-day" ? "halfday" : key],
    palette: tone[key] || PALETTES_DARK[key] || PALETTES[key],
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
