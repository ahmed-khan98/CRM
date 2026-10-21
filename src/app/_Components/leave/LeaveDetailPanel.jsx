"use client";

import { FileText } from "lucide-react";
import LeaveSlideOver from "./LeaveSlideOver";
import LeaveStatusBadge from "./LeaveStatusBadge";
import { formatLeaveDate, formatLeaveName } from "./leaveUi";

export default function LeaveDetailPanel({
  request,
  onClose,
  canAct,
  onApprove,
  onReject,
}) {
  if (!request) return null;
  const emp = request.employeeId;
  return (
    <LeaveSlideOver
      open={Boolean(request)}
      title="Leave request"
      subtitle={formatLeaveName(emp?.fullName || "Details")}
      onClose={onClose}
      footer={
        canAct && request.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onReject?.(request)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onApprove?.(request)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-900">{request.leaveTypeId?.name}</p>
          <LeaveStatusBadge status={request.status} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Info label="Employee" value={formatLeaveName(emp?.fullName)} />
          <Info label="Date" value={formatLeaveDate(request.fromDate)} />
          <Info label="Days" value={request.halfDay ? "0.5 (half day)" : request.days || 1} />
          <Info label="Department" value={emp?.departmentId?.name || "—"} />
          <Info label="Designation" value={emp?.designation || "—"} />
        </div>
        <Info label="Reason" value={request.reason || "—"} />
        {request.documentUrl ? (
          <a
            href={request.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" />
            {request.documentName || "View attached document"}
          </a>
        ) : (
          <p className="text-xs text-zinc-400">No document attached</p>
        )}
        {request.decisionNote ? (
          <Info label="Decision note" value={request.decisionNote} />
        ) : null}
        <div>
          <p className="type-label mb-2">
            Approval history
          </p>
          <div className="space-y-2">
            {(request.history || []).length === 0 ? (
              <p className="text-xs text-zinc-400">No history yet</p>
            ) : (
              request.history.map((h, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <p className="text-xs font-medium capitalize text-zinc-900">{h.action}</p>
                  <p className="text-xs text-zinc-500">
                    {formatLeaveName(h.by?.fullName)} ·{" "}
                    {h.at ? new Date(h.at).toLocaleString() : ""}
                  </p>
                  {h.note ? <p className="mt-1 text-xs text-zinc-500">{h.note}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </LeaveSlideOver>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
