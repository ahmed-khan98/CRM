"use client";
import moment from "moment-timezone";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Cigarette,
  Bath,
  Clock,
  Coffee,
  UtensilsCrossed,
  HandHeart,
  Briefcase,
  Monitor,
  Zap,
} from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import StatsSection from "@/app/_Components/attendence/StatsSection";
import ActiveFilterShowing from "@/app/_Components/attendence/MyAttendance/ActiveFilterShowing";
import {
  getStatCards,
  PALETTES,
} from "@/app/utilities/attendence";
import BreakTable from "@/app/_Components/break/BreakTable";
import FiltersBar from "@/app/_Components/attendence/TeamAttendance/FilterBar";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
const TZ = "Asia/Karachi";

export default function BreakPage() {
  const [viewType, setViewType] = useState("today");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(null);
  const abortRef = useRef(null);
  const { data: employees, isFetching: isEmployeesFetching } =
    useAllEmployeesQuery();

  const queryParams = useMemo(() => {
    const base = { page, limit: 10 };
    const now = moment().tz("Asia/Karachi");
    let params = { ...base };

    if (viewType === "today") {
      const shiftDate =
        now.hour() < 8
          ? now.subtract(1, "days").format("YYYY-MM-DD")
          : now.format("YYYY-MM-DD");
      params = {
        ...base,
        startDate: shiftDate,
        endDate: shiftDate,
      };
    } else if (viewType === "month") {
      params = {
        ...base,
        startDate: moment().tz(TZ).startOf("month").format("YYYY-MM-DD"),
        endDate: moment().tz(TZ).endOf("month").format("YYYY-MM-DD"),
      };
    } else if (viewType === "custom") {
      if (!customRange.start) return null;
      params = {
        ...base,
        startDate: customRange.start,
        endDate: customRange.end || customRange.start,
      };
    }

    if (selectedEmployee) {
      params.userId = selectedEmployee;
    }
    
    // 👈 Backend pr agar active status filter ho (jaise live break) ya type filter ho
    if (activeFilter) {
      if (activeFilter === "live") {
        params.status = "break-in";
      } else {
        params.type = activeFilter.toUpperCase();
      }
    }

    return params;
  }, [viewType, customRange, selectedEmployee, page, activeFilter]);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchBreaks = async () => {
      setIsFetching(true);
      try {
        const token = document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("token="))
          ?.split("=")?.[1];
        const search = new URLSearchParams(
          Object.fromEntries(
            Object.entries(queryParams).map(([k, v]) => [k, String(v)]),
          ),
        ).toString();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/breaks?${search}`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Break fetch error:", err);
          setData(null);
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (queryParams) {
      fetchBreaks();
    }
    return () => controller.abort();
  }, [queryParams]);

  // Filter change hone pr hamesha page 1 pr reset krein
  useEffect(() => {
    setPage(1);
  }, [viewType, customRange, selectedEmployee, activeFilter]);

  const employeeOptions = useMemo(() => {
    const options =
      employees?.data?.map((emp) => ({
        value: emp._id,
        label: emp.fullName,
        designation: emp.designation,
      })) || [];
    return [{ value: "", label: "All Employees (Department)" }, ...options];
  }, [employees]);

  const items = data?.items ?? [];
  const meta = data?.meta ?? null;
  const apiStats = data?.stats ?? null; // 👈 API se direct stats object extract kiya

  const onPageChange = useCallback((p) => setPage(p), []);

  // 🛠️ FIX: Frontend calculations ko khatam kr k backend state map ki hy
  const stats = useMemo(() => {
    return {
      total: apiStats?.TOTAL_ALL ?? 0,
      live: apiStats?.LIVE ?? 0,
      meal: apiStats?.MEAL ?? 0,
      smoking: apiStats?.SMOKING ?? 0,
      prayer: apiStats?.PRAYER ?? 0,
      tea: apiStats?.TEA ?? 0,
      official: apiStats?.OFFICIAL ?? 0,
      "rest room": apiStats?.["REST ROOM"] ?? 0,
      "system idle": apiStats?.["SYSTEM IDLE"] ?? 0,
    };
  }, [apiStats]);

  const statCards = useMemo(() => {
    return getStatCards({
      stats,
      data: items,
      palettes: PALETTES,
      config: {
        live: { label: "Live Break", icon: Zap },
        smoking: { label: "Smoking", icon: Cigarette },
        "rest room": { label: "Rest Room", icon: Bath },
        tea: { label: "Tea", icon: Coffee },
        meal: { label: "Meal", icon: UtensilsCrossed },
        prayer: { label: "Prayer", icon: HandHeart },
        official: { label: "Official", icon: Briefcase },
        "system idle": { label: "System Idle", icon: Monitor },
      },
      extraCard: {
        label: "Total",
        icon: Coffee,
        palette: PALETTES.total,
        value: stats.total,
      },
    });
  }, [stats, items]);

  // Backend se filtered items hi aa rhe hain, direct pass krein table ko
  const tableData = items;

  const toggleFilter = useCallback((key) => {
    setActiveFilter((prev) => (prev === key ? null : key));
  }, []);

  const clearFilters = useCallback(() => {
    setViewType("today");
    setCustomRange({ start: "", end: "" });
    setActiveFilter(null);
    setSelectedEmployee("");
  }, []);

  const showClearBtn =
    viewType !== "today" || customRange.start || selectedEmployee || activeFilter;

  return (
    <div className="min-h-screen text-zinc-800 p-1 flex flex-col gap-3">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <AttendenceHeader
          icon={Coffee}
          length={meta?.total}
          name="Team Breaks"
        />

        <FiltersBar
          employeeOptions={employeeOptions}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          viewType={viewType}
          setViewType={setViewType}
          customRange={customRange}
          setCustomRange={setCustomRange}
          showClearBtn={showClearBtn}
          onClear={clearFilters}
        />
      </div>

      {/* ── Stat Cards ── */}
      <StatsSection
        statCards={statCards}
        activeFilter={activeFilter}
        toggleFilter={toggleFilter}
      />

      {/* ── Active filter banner ── */}
      {activeFilter && (
        <ActiveFilterShowing
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          length={meta?.total} // 👈 Total items from meta object according to pagination
        />
      )}

      <BreakTable
        isFetching={isFetching}
        tableData={tableData}
        activeFilter={activeFilter}
        meta={meta}
        onPageChange={onPageChange}
      />
    </div>
  );
}