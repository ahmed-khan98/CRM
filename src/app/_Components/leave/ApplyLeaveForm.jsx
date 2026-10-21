"use client";

import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import { useApplyLeaveMutation, useGetLeaveTypesQuery } from "@/app/_Services/leave/page";
import { formatLeaveName } from "./leaveUi";
import LeaveDateField from "./LeaveDateField";

function readCurrentUser() {
  try {
    return JSON.parse(Cookies.get("currentuser") || "{}");
  } catch {
    return {};
  }
}

export default function ApplyLeaveForm({
  onDone,
  employeeId,
  employeeName = "",
  employees = [],
  showEmployeeSelect = false,
}) {
  const { data: typesData } = useGetLeaveTypesQuery();
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();
  const types = typesData?.data || [];
  const me = readCurrentUser();
  const [form, setForm] = useState({
    employeeId: employeeId || "",
    leaveTypeId: "",
    date: "",
    halfDay: false,
    reason: "",
    file: null,
  });

  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t._id, label: t.name })),
    [types]
  );
  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        value: emp._id,
        label: emp.fullName,
      })),
    [employees]
  );
  const selectedType = types.find((t) => t._id === form.leaveTypeId);
  const selectedEmployee = employees.find((emp) => emp._id === form.employeeId);
  const targetEmployeeId = employeeId || form.employeeId || me?._id;
  const displayEmployeeName = formatLeaveName(
    selectedEmployee?.fullName || employeeName || me?.fullName || ""
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (showEmployeeSelect && !targetEmployeeId) {
      return toast.error("Select an employee");
    }
    if (!form.leaveTypeId || !form.date) {
      return toast.error("Leave type and date are required");
    }
    if (selectedType?.requiresDocument && !form.file) {
      return toast.error("Please attach a supporting document");
    }
    try {
      const fd = new FormData();
      if (targetEmployeeId) fd.append("employeeId", targetEmployeeId);
      fd.append("leaveTypeId", form.leaveTypeId);
      fd.append("fromDate", form.date);
      fd.append("toDate", form.date);
      fd.append("halfDay", form.halfDay ? "true" : "false");
      fd.append("reason", form.reason);
      if (form.file) fd.append("file", form.file);
      await applyLeave(fd).unwrap();
      toast.success(targetEmployeeId ? "Leave applied for employee" : "Leave request submitted");
      onDone?.();
    } catch (err) {
      toast.error(err?.data?.message || "Could not submit leave");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Employee
        </label>
        {showEmployeeSelect ? (
          <CrmSelect
            options={employeeOptions}
            value={form.employeeId}
            onChange={(v) => setForm((s) => ({ ...s, employeeId: v }))}
            placeholder="Select employee"
            isSearchable
          />
        ) : (
          <div className="flex h-[42px] items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm font-semibold capitalize text-zinc-900">
            {displayEmployeeName || "—"}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Leave Type
          </label>
          <CrmSelect
            options={typeOptions}
            value={form.leaveTypeId}
            onChange={(v) => setForm((s) => ({ ...s, leaveTypeId: v }))}
            placeholder="Select leave type"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Date
          </label>
          <LeaveDateField
            value={form.date}
            onChange={(date) => setForm((s) => ({ ...s, date }))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <input
          type="checkbox"
          checked={form.halfDay}
          onChange={(e) => setForm((s) => ({ ...s, halfDay: e.target.checked }))}
          className="h-4 w-4 rounded border-zinc-200"
        />
        Half day
      </label>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Reason
        </label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
          rows={3}
          className={`${fleet.input} resize-none`}
          placeholder="Why do you need this leave?"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Attach Document {selectedType?.requiresDocument ? "(required)" : "(optional)"}
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 text-center hover:bg-zinc-50">
          <Upload className="mb-2 h-5 w-5 text-zinc-400" />
          <p className="text-sm font-semibold text-zinc-900">
            {form.file ? form.file.name : "Drag or click to upload"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">PDF, image or document</p>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setForm((s) => ({ ...s, file: e.target.files?.[0] || null }))}
          />
        </label>
      </div>
      </div>

      <div className="shrink-0 border-t border-zinc-200 bg-white pt-3">
        <button type="submit" disabled={isLoading} className={`${fleet.primaryBtn} w-full justify-center`}>
          {isLoading ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
