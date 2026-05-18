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

  /* ── Build query params ── */
  console.log("Selected Employee:", selectedEmployee);
  const queryParams = useMemo(() => {
    const base = { page, limit: 5 };
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

    return params;
  }, [viewType, customRange, selectedEmployee, page]);

  /* ── Fetch ── */
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

        // ── Replace this URL with your actual API endpoint ──
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

    fetchBreaks();
    return () => controller.abort();
  }, [queryParams]);

  useEffect(() => {
    setPage(1);
  }, [viewType, customRange, selectedEmployee]);

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

  const onPageChange = useCallback((p) => setPage(p), []);

  const stats = useMemo(() => {
    return {
      total: meta?.total ?? items.length,
      smoking: items.filter((i) => i.type?.toUpperCase() === "SMOKING").length,
      "rest room": items.filter((i) => i.type?.toUpperCase() === "REST ROOM")
        .length,
      tea: items.filter((i) => i.type?.toUpperCase() === "TEA").length,
      meal: items.filter((i) => i.type?.toUpperCase() === "MEAL").length,
      prayer: items.filter((i) => i.type?.toUpperCase() === "PRAYER").length,
      official: items.filter((i) => i.type?.toUpperCase() === "OFFICIAL")
        .length,
      "system idle": items.filter(
        (i) => i.type?.toUpperCase() === "SYSTEM IDLE",
      ).length,
      active: items.filter((i) => i.status === "break-in").length,
    };
  }, [items, meta]);

  const statCards = useMemo(() => {
    return getStatCards({
      stats,
      data: items,
      palettes: PALETTES,
      config: {
        smoking: { label: "Smoking", icon: Cigarette },
        "rest room": { label: "Rest Room", icon: Bath },
        tea: { label: "Tea", icon: Coffee },
        meal: { label: "Meal", icon: UtensilsCrossed },
        prayer: { label: "Prayer", icon: HandHeart },
        official: { label: "Official", icon: Briefcase },
        "system idle": { label: "System Idle", icon: Monitor },
        active: { label: "On Break", icon: Clock },
      },
      extraCard: {
        label: "Total",
        icon: Coffee,
        palette: PALETTES.total,
        value: stats.total,
      },
    });
  }, [stats, items]);

  const tableData = useMemo(() => {
    if (!activeFilter) return items;

    const TYPE_FILTERS = [
      "SMOKING",
      "REST ROOM",
      "TEA",
      "MEAL",
      "PRAYER",
      "SYSTEM IDLE",
      "OFFICIAL",
    ];

    if (TYPE_FILTERS.includes(activeFilter.toUpperCase())) {
      return items.filter(
        (i) => i.type?.toUpperCase() === activeFilter.toUpperCase(),
      );
    }

    if (activeFilter === "active") {
      return items.filter((i) => i.status === "break-in");
    }

    return items.filter((i) => i.status === activeFilter);
  }, [items, activeFilter]);

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
    viewType !== "today" || customRange.start || selectedEmployee;

  return (
    <div className="min-h-screen text-zinc-800 p-2 md:p-4 flex flex-col gap-3">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          length={tableData?.length}
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
