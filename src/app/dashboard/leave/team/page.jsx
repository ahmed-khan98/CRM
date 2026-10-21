"use client";

import { useCallback, useMemo, useState } from "react";
import { Users, Download, Clock, CheckCircle2, XCircle, Umbrella, ListChecks, Plus } from "lucide-react";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import ActiveFilterShowing from "@/app/_Components/attendence/MyAttendance/ActiveFilterShowing";
import StatsSection from "@/app/_Components/attendence/StatsSection";
import FiltersBar from "@/app/_Components/attendence/TeamAttendance/FilterBar";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
import {
  useApproveLeaveMutation,
  useGetLeaveTypesQuery,
  useGetTeamLeaveQuery,
  useRejectLeaveMutation,
} from "@/app/_Services/leave/page";
import LeaveHistoryTable from "@/app/_Components/leave/LeaveHistoryTable";
import LeaveDetailPanel from "@/app/_Components/leave/LeaveDetailPanel";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import ApplyLeaveForm from "@/app/_Components/leave/ApplyLeaveForm";
import { LEAVE_PALETTES } from "@/app/_Components/leave/leaveUi";
import { exportLeaveToExcel } from "@/app/utilities/exportLeaveToExcel";
import { fleet } from "@/app/_Components/fleet/fleetTheme";

export default function TeamLeavePage() {
  const [viewType, setViewType] = useState("month");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [activeFilter, setActiveFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params = {
      employeeId: selectedEmployee || undefined,
      leaveTypeId: leaveTypeId || undefined,
    };
    const now = moment().tz("Asia/Karachi");
    if (viewType === "today") {
      params.startDate = now.format("YYYY-MM-DD");
      params.endDate = now.format("YYYY-MM-DD");
    } else if (viewType === "month") {
      params.month = now.format("MM");
      params.year = now.format("YYYY");
    } else if (viewType === "custom" && customRange.start) {
      params.startDate = customRange.start;
      params.endDate = customRange.end || customRange.start;
    }
    return params;
  }, [viewType, selectedEmployee, leaveTypeId, customRange]);

  const { data: employees } = useAllEmployeesQuery();
  const { data: typesData } = useGetLeaveTypesQuery();
  const { data, isFetching } = useGetTeamLeaveQuery(queryParams);
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const rows = data?.data?.items || [];
  const stats = data?.data?.stats || {};

  const employeeOptions = useMemo(() => {
    const options =
      employees?.data?.map((emp) => ({
        value: emp._id,
        label: emp.fullName,
        designation: emp.designation,
      })) || [];
    return [{ value: "", label: "All Employees (Department)" }, ...options];
  }, [employees]);

  const typeOptions = useMemo(
    () => [
      { value: "", label: "All leave types" },
      ...(typesData?.data || []).map((t) => ({ value: t._id, label: t.name })),
    ],
    [typesData]
  );

  const toggleFilter = useCallback((key) => {
    setActiveFilter((prev) => {
      const next = prev === key ? null : key;
      if (next === "onLeave") setViewType("today");
      else if (["month", "pending", "approved", "rejected"].includes(next)) {
        setViewType("month");
      }
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setViewType("month");
    setCustomRange({ start: "", end: "" });
    setSelectedEmployee("");
    setLeaveTypeId("");
    setActiveFilter(null);
  }, []);

  const statCards = useMemo(
    () => [
      { id: "pending", label: "Pending", icon: Clock, palette: LEAVE_PALETTES.pending, value: stats.pending || 0 },
      { id: "approved", label: "Approved", icon: CheckCircle2, palette: LEAVE_PALETTES.approved, value: stats.approved || 0 },
      { id: "rejected", label: "Rejected", icon: XCircle, palette: LEAVE_PALETTES.rejected, value: stats.rejected || 0 },
      { id: "onLeave", label: "On Leave Today", icon: Umbrella, palette: LEAVE_PALETTES.onLeave, value: stats.onLeaveToday || 0 },
      { id: "month", label: "Total Requests (Month)", icon: ListChecks, palette: LEAVE_PALETTES.month, value: stats.monthTotal || 0 },
    ],
    [stats]
  );

  const filteredRows = useMemo(() => {
    if (!activeFilter) return rows;
    if (activeFilter === "onLeave") {
      const today = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
      return rows.filter(
        (r) => r.status === "approved" && r.fromDate <= today && r.toDate >= today
      );
    }
    if (activeFilter === "month") return rows;
    return rows.filter((r) => r.status === activeFilter);
  }, [rows, activeFilter]);

  const decide = async (row, action) => {
    try {
      if (action === "approve") await approveLeave({ id: row._id }).unwrap();
      else await rejectLeave({ id: row._id }).unwrap();
      toast.success(action === "approve" ? "Leave approved" : "Leave rejected");
      setSelected(null);
    } catch (err) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  const handleExport = () => {
    try {
      exportLeaveToExcel(filteredRows);
      toast.success("Leave summary report exported");
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  };

  const showClearBtn =
    viewType !== "month" || customRange.start || selectedEmployee || leaveTypeId;

  return (
    <div className="section-stack h-screen overflow-hidden">
      <AttendenceHeader icon={Users} length={rows.length} name="Team Leave">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setApplyOpen(true)} className={fleet.primaryBtn}>
            <Plus className="h-4 w-4" />
            Apply Leave
          </button>
          <Tooltip label="Export to Excel" side="bottom">
            <button
              onClick={handleExport}
              aria-label="Export Leave Summary Report"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 transition-colors hover:bg-emerald-50"
            >
              <Download size={15} className="text-emerald-700" />
              <span className="hidden text-xs font-medium uppercase tracking-tight text-emerald-700 sm:inline">
                Export Leave Summary Report
              </span>
            </button>
          </Tooltip>
        </div>
      </AttendenceHeader>

      <StatsSection
        statCards={statCards}
        activeFilter={activeFilter}
        toggleFilter={toggleFilter}
      />

      {activeFilter && (
        <ActiveFilterShowing
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          length={filteredRows.length}
        />
      )}

        <FiltersBar
          employeeOptions={employeeOptions}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          viewType={viewType}
          setViewType={setViewType}
          customRange={customRange}
          setCustomRange={setCustomRange}
          showClearBtn={showClearBtn}
          onClear={handleClearFilters}
          leaveTypeOptions={typeOptions}
          leaveTypeId={leaveTypeId}
          setLeaveTypeId={setLeaveTypeId}
        />

      <div className="min-h-0 flex-1">
        <LeaveHistoryTable
          rows={filteredRows}
          loading={isFetching}
          showEmployee
          canAct
          onView={setSelected}
          onApprove={(row) => decide(row, "approve")}
          onReject={(row) => decide(row, "reject")}
        />
      </div>

      <LeaveDetailPanel
        request={selected}
        onClose={() => setSelected(null)}
        canAct
        onApprove={(row) => decide(row, "approve")}
        onReject={(row) => decide(row, "reject")}
      />

      <LeaveSlideOver
        open={applyOpen}
        title="Apply leave for employee"
        subtitle="Submit leave on behalf of a team member"
        onClose={() => setApplyOpen(false)}
        fill
      >
        <ApplyLeaveForm
          showEmployeeSelect
          employees={employees?.data || []}
          onDone={() => setApplyOpen(false)}
        />
      </LeaveSlideOver>
    </div>
  );
}
