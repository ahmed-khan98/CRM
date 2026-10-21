"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import {
  useCreateHolidayMutation,
  useCreateLeaveTypeMutation,
  useDeleteHolidayMutation,
  useDeleteLeaveTypeMutation,
  useGetHolidaysQuery,
  useGetLeaveTypesQuery,
  useUpdateHolidayMutation,
  useUpdateLeaveTypeMutation,
} from "@/app/_Services/leave/page";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";
import { formatLeaveDate } from "@/app/_Components/leave/leaveUi";
import { labelClass, inputClass } from "@/app/dashboard/employee/_components/hrmsUi";

export default function LeaveSettingsPage() {
  const { data: typesData, isFetching: loadingTypes } = useGetLeaveTypesQuery({
    includeInactive: true,
  });
  const { data: holidayData, isFetching: loadingHolidays } = useGetHolidaysQuery();
  const { data: deptData } = useAllDepartmentsQuery();
  const [createType] = useCreateLeaveTypeMutation();
  const [updateType] = useUpdateLeaveTypeMutation();
  const [deleteType] = useDeleteLeaveTypeMutation();
  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();

  const [typeEditor, setTypeEditor] = useState(null);
  const [holidayEditor, setHolidayEditor] = useState(null);

  const types = typesData?.data || [];
  const holidays = holidayData?.data || [];
  const departments = useMemo(
    () => [
      { value: "", label: "All departments" },
      ...(deptData?.data || []).map((d) => ({ value: d._id, label: d.name })),
    ],
    [deptData]
  );

  const saveType = async (e) => {
    e.preventDefault();
    if (!typeEditor?.name?.trim()) return toast.error("Name is required");
    try {
      if (typeEditor._id) {
        await updateType({ id: typeEditor._id, body: typeEditor }).unwrap();
        toast.success("Leave type updated");
      } else {
        await createType(typeEditor).unwrap();
        toast.success("Leave type created");
      }
      setTypeEditor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  const saveHoliday = async (e) => {
    e.preventDefault();
    if (!holidayEditor?.name?.trim() || !holidayEditor?.date) {
      return toast.error("Name and date are required");
    }
    try {
      const body = {
        name: holidayEditor.name,
        date: holidayEditor.date,
        departmentId: holidayEditor.departmentId || null,
      };
      if (holidayEditor._id) {
        await updateHoliday({ id: holidayEditor._id, body }).unwrap();
        toast.success("Holiday updated");
      } else {
        await createHoliday(body).unwrap();
        toast.success("Holiday created");
      }
      setHolidayEditor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div className="section-stack min-h-full pb-8">
      <AttendenceHeader
        icon={CalendarDays}
        length={types.length}
        name="Leave Settings"
      />

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-zinc-900">Leave Types</h2>
          <button
            type="button"
            className={fleet.primaryBtn}
            onClick={() =>
              setTypeEditor({
                name: "",
                annualDays: 0,
                carryForward: false,
                requiresDocument: false,
                isPaid: true,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add type
          </button>
        </div>
        <SettingsTable
          loading={loadingTypes}
          minWidth="min-w-[720px]"
          headers={["Name", "Annual days", "Carry forward", "Requires document", "Paid", "Action"]}
          rows={types.map((t) => [
            t.name,
            t.annualDays,
            t.carryForward ? "Yes" : "No",
            t.requiresDocument ? "Yes" : "No",
            t.isPaid ? "Yes" : "No",
            <RowActions
              key={t._id}
              onEdit={() => setTypeEditor({ ...t })}
              onDelete={async () => {
                try {
                  await deleteType(t._id).unwrap();
                  toast.success("Leave type removed");
                } catch (err) {
                  toast.error(err?.data?.message || "Delete failed");
                }
              }}
            />,
          ])}
        />
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-zinc-900">Public Holidays</h2>
          <button
            type="button"
            className={fleet.primaryBtn}
            onClick={() => setHolidayEditor({ name: "", date: "", departmentId: "" })}
          >
            <Plus className="h-4 w-4" /> Add holiday
          </button>
        </div>
        <SettingsTable
          loading={loadingHolidays}
          minWidth="min-w-[520px]"
          headers={["Name", "Date", "Department", "Action"]}
          rows={holidays.map((h) => [
            h.name,
            formatLeaveDate(h.date),
            h.departmentId?.name || "All company",
            <RowActions
              key={h._id}
              onEdit={() =>
                setHolidayEditor({
                  ...h,
                  departmentId: h.departmentId?._id || "",
                })
              }
              onDelete={async () => {
                try {
                  await deleteHoliday(h._id).unwrap();
                  toast.success("Holiday removed");
                } catch (err) {
                  toast.error(err?.data?.message || "Delete failed");
                }
              }}
            />,
          ])}
        />
      </section>

      <LeaveSlideOver
        open={Boolean(typeEditor)}
        title={typeEditor?._id ? "Edit leave type" : "Add leave type"}
        onClose={() => setTypeEditor(null)}
      >
        {typeEditor && (
          <form onSubmit={saveType} className="space-y-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={typeEditor.name}
                onChange={(e) => setTypeEditor((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Annual allocation (days)</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={typeEditor.annualDays}
                onChange={(e) =>
                  setTypeEditor((s) => ({ ...s, annualDays: Number(e.target.value) }))
                }
              />
            </div>
            <Toggle
              label="Carry forward allowed"
              checked={Boolean(typeEditor.carryForward)}
              onChange={(carryForward) => setTypeEditor((s) => ({ ...s, carryForward }))}
            />
            <Toggle
              label="Requires document"
              checked={Boolean(typeEditor.requiresDocument)}
              onChange={(requiresDocument) =>
                setTypeEditor((s) => ({ ...s, requiresDocument }))
              }
            />
            <Toggle
              label="Paid leave"
              checked={typeEditor.isPaid !== false}
              onChange={(isPaid) => setTypeEditor((s) => ({ ...s, isPaid }))}
            />
            <button type="submit" className={`${fleet.primaryBtn} w-full justify-center`}>
              Save leave type
            </button>
          </form>
        )}
      </LeaveSlideOver>

      <LeaveSlideOver
        open={Boolean(holidayEditor)}
        title={holidayEditor?._id ? "Edit holiday" : "Add holiday"}
        onClose={() => setHolidayEditor(null)}
      >
        {holidayEditor && (
          <form onSubmit={saveHoliday} className="space-y-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={holidayEditor.name}
                onChange={(e) => setHolidayEditor((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <LeaveDateField
                value={holidayEditor.date}
                onChange={(date) => setHolidayEditor((s) => ({ ...s, date }))}
              />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <CrmSelect
                options={departments}
                value={holidayEditor.departmentId || ""}
                onChange={(departmentId) =>
                  setHolidayEditor((s) => ({ ...s, departmentId }))
                }
              />
            </div>
            <button type="submit" className={`${fleet.primaryBtn} w-full justify-center`}>
              Save holiday
            </button>
          </form>
        )}
      </LeaveSlideOver>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-900">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1.5">
      <Tooltip label="Edit">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip label="Delete">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
    </div>
  );
}

function SettingsTable({ headers, rows, loading, minWidth = "min-w-[720px]" }) {
  return (
    <div
      className="overflow-x-auto overscroll-x-contain rounded-2xl border border-zinc-200"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <table className={`w-full text-left ${minWidth}`}>
        <thead>
          <tr className="table-head-row">
            {headers.map((h) => (
              <th
                key={h}
                className="table-head-cell whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-sm text-zinc-400">
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-sm text-zinc-400">
                No records yet
              </td>
            </tr>
          ) : (
            rows.map((cols, i) => (
              <tr key={i} className="border-b border-zinc-200 last:border-0">
                {cols.map((col, j) => (
                  <td key={j} className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">
                    {col}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
