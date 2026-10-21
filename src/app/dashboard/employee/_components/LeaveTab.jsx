"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  useApproveLeaveMutation,
  useGetEmployeeLeaveBalancesQuery,
  useGetEmployeeLeaveRequestsQuery,
  useRejectLeaveMutation,
} from "@/app/_Services/leave/page";
import LeaveBalanceCards from "@/app/_Components/leave/LeaveBalanceCards";
import LeaveHistoryTable from "@/app/_Components/leave/LeaveHistoryTable";
import LeaveDetailPanel from "@/app/_Components/leave/LeaveDetailPanel";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import ApplyLeaveForm from "@/app/_Components/leave/ApplyLeaveForm";
import { canManageTeamLeave } from "@/app/_Components/leave/leaveUi";
import { fleet } from "@/app/_Components/fleet/fleetTheme";

export default function LeaveTab({ employeeId, employeeName = "" }) {
  const { data: balanceData, isFetching: loadingBalances } =
    useGetEmployeeLeaveBalancesQuery({ employeeId }, { skip: !employeeId });
  const { data: requestData, isFetching: loadingRequests } =
    useGetEmployeeLeaveRequestsQuery({ employeeId }, { skip: !employeeId });
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();
  const [selected, setSelected] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);

  let role = "";
  try {
    role = JSON.parse(Cookies.get("currentuser") || "{}")?.role || "";
  } catch {
    role = "";
  }
  const canAct = canManageTeamLeave(role);

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

  return (
    <div className="space-y-4">
      {canAct && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setApplyOpen(true)} className={fleet.primaryBtn}>
            <Plus className="h-4 w-4" />
            Apply Leave
          </button>
        </div>
      )}
      <LeaveBalanceCards
        balances={balanceData?.data || []}
        loading={loadingBalances}
      />
      <LeaveHistoryTable
        rows={requestData?.data || []}
        loading={loadingRequests}
        canAct={canAct}
        onView={setSelected}
        onApprove={(row) => decide(row, "approve")}
        onReject={(row) => decide(row, "reject")}
      />
      <LeaveDetailPanel
        request={selected}
        onClose={() => setSelected(null)}
        canAct={canAct}
        onApprove={(row) => decide(row, "approve")}
        onReject={(row) => decide(row, "reject")}
      />
      <LeaveSlideOver
        open={applyOpen}
        title="Apply leave"
        subtitle="Submit leave for this employee"
        onClose={() => setApplyOpen(false)}
        fill
      >
        <ApplyLeaveForm employeeId={employeeId} employeeName={employeeName} onDone={() => setApplyOpen(false)} />
      </LeaveSlideOver>
    </div>
  );
}
