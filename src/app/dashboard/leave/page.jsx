"use client";

import { useState } from "react";
import { CalendarCheck, Plus } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
} from "@/app/_Services/leave/page";
import LeaveBalanceCards from "@/app/_Components/leave/LeaveBalanceCards";
import LeaveHistoryTable from "@/app/_Components/leave/LeaveHistoryTable";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import ApplyLeaveForm from "@/app/_Components/leave/ApplyLeaveForm";
import LeaveDetailPanel from "@/app/_Components/leave/LeaveDetailPanel";

export default function MyLeavePage() {
  const { data: balanceData, isFetching: loadingBalances } =
    useGetMyLeaveBalancesQuery();
  const { data: requestData, isFetching: loadingRequests } =
    useGetMyLeaveRequestsQuery();
  const [applyOpen, setApplyOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const balances = balanceData?.data || [];
  const rows = requestData?.data || [];

  return (
    <div className="section-stack h-screen overflow-hidden">
      <AttendenceHeader icon={CalendarCheck} length={rows.length} name="My Leave">
        <button
          type="button"
          onClick={() => setApplyOpen(true)}
          className={fleet.primaryBtn}
        >
          <Plus className="h-4 w-4" />
          Apply for Leave
        </button>
      </AttendenceHeader>

      <LeaveBalanceCards balances={balances} loading={loadingBalances} />

      <div className="min-h-0 flex-1 flex flex-col">
        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
          My Leave History
        </p>
        <LeaveHistoryTable
          rows={rows}
          loading={loadingRequests}
          onView={setSelected}
        />
      </div>

      <LeaveSlideOver
        open={applyOpen}
        title="Apply for Leave"
        subtitle="Submit a new leave request"
        onClose={() => setApplyOpen(false)}
        fill
      >
        <ApplyLeaveForm onDone={() => setApplyOpen(false)} />
      </LeaveSlideOver>

      <LeaveDetailPanel request={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
