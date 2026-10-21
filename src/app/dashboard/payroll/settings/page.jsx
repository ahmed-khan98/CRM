"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import Tooltip from "@/app/_Components/ui/Tooltip";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import { inputClass, labelClass } from "@/app/dashboard/employee/_components/hrmsUi";
import {
  useCreateDeductionTypeMutation,
  useDeleteDeductionTypeMutation,
  useGetPayrollSettingsQuery,
  useUpdateDeductionTypeMutation,
  useUpdatePayrollSettingsMutation,
} from "@/app/_Services/payroll/page";

const CODE_OPTIONS = [
  { value: "tax", label: "Tax" },
  { value: "pf", label: "Provident Fund" },
  { value: "loan", label: "Loan" },
  { value: "absent", label: "Absent Deduction" },
  { value: "other", label: "Other" },
];

export default function PayrollSettingsPage() {
  const { data, isFetching } = useGetPayrollSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdatePayrollSettingsMutation();
  const [createType] = useCreateDeductionTypeMutation();
  const [updateType] = useUpdateDeductionTypeMutation();
  const [deleteType] = useDeleteDeductionTypeMutation();

  const settings = data?.data?.settings;
  const types = (data?.data?.types || []).filter((t) => t.code !== "late");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(null);

  const [lateRule, setLateRule] = useState("");

  const startEdit = () => {
    setForm({
      companyName: settings?.companyName || "Zytron World",
      payDay: settings?.payDay || 1,
      defaultBankName: settings?.defaultBankName || "",
      lateLatesPerDay: settings?.lateLatesPerDay || 2,
      cycleEndDay: settings?.cycleEndDay || 25,
      taxSlabs: settings?.taxSlabs?.length
        ? settings.taxSlabs.map((s) => ({ ...s }))
        : [{ from: 0, to: 600000, rate: 0 }],
    });
  };

  const saveLateRule = async (e) => {
    e.preventDefault();
    const value = Math.max(1, Number(lateRule || settings?.lateLatesPerDay || 2));
    try {
      await updateSettings({ lateLatesPerDay: value }).unwrap();
      toast.success("Late rule saved. Generate payroll again to apply on this month.");
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(form).unwrap();
      toast.success("Settings saved");
      setForm(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  const saveType = async (e) => {
    e.preventDefault();
    try {
      if (editor._id) await updateType({ id: editor._id, body: editor }).unwrap();
      else await createType(editor).unwrap();
      toast.success("Deduction type saved");
      setEditor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div className="section-stack min-h-full pb-8">
      <AttendenceHeader icon={CalendarDays} length={types.length} name="Payroll Settings">
        <button type="button" className={fleet.primaryBtn} onClick={startEdit}>
          Edit schedule / tax
        </button>
      </AttendenceHeader>

      <section className={`${fleet.card} p-4`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="min-w-0 md:max-w-md">
            <h2 className="text-sm font-medium text-zinc-900">Late deduction rule</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Only this setting controls late cut. Example: 2 means every 2 late marks deduct 1 day
              salary. Change it, then generate payroll again.
            </p>
          </div>
          <form
            onSubmit={saveLateRule}
            className="flex w-full flex-wrap items-end gap-2 sm:gap-3 md:w-auto md:shrink-0"
          >
            <div className="min-w-[140px] grow sm:grow-0 sm:min-w-[160px]">
              <label className={labelClass}>Lates that equal 1 day</label>
              <input
                type="number"
                min="1"
                className={inputClass}
                value={lateRule === "" ? settings?.lateLatesPerDay || 2 : lateRule}
                onChange={(e) => setLateRule(e.target.value)}
              />
            </div>
            <p className="pb-2 text-sm font-semibold text-zinc-900 whitespace-nowrap">
              {lateRule === "" ? settings?.lateLatesPerDay || 2 : lateRule} late
              {Number(lateRule || settings?.lateLatesPerDay || 2) === 1 ? "" : "s"} = 1 day salary
            </p>
            <button type="submit" disabled={saving} className={`${fleet.primaryBtn} shrink-0`}>
              Save late rule
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-medium">Deduction Types</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Enable a type to apply it on Generate Payroll. Disable it to skip. Percentage types use basic salary.
            </p>
          </div>
          <button
            type="button"
            className={`${fleet.primaryBtn} shrink-0`}
            onClick={() =>
              setEditor({ name: "", code: "other", calcType: "fixed", defaultAmount: 0 })
            }
          >
            <Plus className="h-4 w-4" /> Add type
          </button>
        </div>
        <div
          className="overflow-x-auto overscroll-x-contain rounded-2xl border border-zinc-200"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="table-head-row">
                {["Name", "Code", "Type", "Default", "On payroll", "Action"].map((h) => (
                  <th key={h} className="table-head-cell whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-400">Loading…</td></tr>
              ) : (
                types.map((t) => (
                  <tr key={t._id} className="border-b border-zinc-200">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold">{t.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm uppercase">{t.code}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{t.calcType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{t.defaultAmount}{t.calcType === "percentage" ? "%" : ""}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Tooltip label={t.isActive === false ? "Enable on payroll" : "Disable on payroll"}>
                        <button
                          type="button"
                          className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase ${
                            t.isActive !== false
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-zinc-50 text-zinc-400"
                          }`}
                          onClick={async () => {
                            try {
                              await updateType({
                                id: t._id,
                                body: { isActive: t.isActive === false },
                              }).unwrap();
                              toast.success(t.isActive === false ? "Enabled on payroll" : "Disabled on payroll");
                            } catch (err) {
                              toast.error(err?.data?.message || "Update failed");
                            }
                          }}
                        >
                          {t.isActive === false ? "Off" : "On"}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        <Tooltip label="Edit">
                          <button type="button" className="rounded-xl border border-zinc-200 p-1.5" onClick={() => setEditor({ ...t })}>
                            <Pencil className="h-3.5 w-3.5 text-zinc-200" />
                          </button>
                        </Tooltip>
                        <Tooltip label="Delete">
                          <button
                            type="button"
                            className="rounded-xl border border-rose-200 p-1.5 text-rose-600"
                            onClick={async () => {
                              try {
                                await deleteType(t._id).unwrap();
                                toast.success("Deleted");
                              } catch (err) {
                                toast.error(err?.data?.message || "Delete failed");
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${fleet.card} p-4`}>
        <h2 className="mb-2 text-sm font-medium">Current schedule</h2>
        <p className="text-sm text-zinc-500">
          Company: <strong>{settings?.companyName || "Zytron World"}</strong> · Payroll day:{" "}
          <strong>{settings?.payDay || 1}</strong> of each month · Default bank:{" "}
          <strong>{settings?.defaultBankName || "—"}</strong>
          {" "}· Cycle:{" "}
          <strong>
            {((settings?.cycleEndDay || 25) % 28) + 1}th prev month → {settings?.cycleEndDay || 25}th selected month
          </strong>
          {" "}· Late rule:{" "}
          <strong>{settings?.lateLatesPerDay || 2} late{(settings?.lateLatesPerDay || 2) === 1 ? "" : "s"} = 1 day</strong>
        </p>
      </section>

      <LeaveSlideOver open={Boolean(editor)} title="Deduction type" onClose={() => setEditor(null)}>
        {editor && (
          <form onSubmit={saveType} className="space-y-3">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={editor.name} onChange={(e) => setEditor((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Code</label>
              <CrmSelect options={CODE_OPTIONS} value={editor.code} onChange={(code) => setEditor((s) => ({ ...s, code }))} />
            </div>
            <div>
              <label className={labelClass}>Calculation</label>
              <CrmSelect
                options={[
                  { value: "fixed", label: "Fixed amount" },
                  { value: "percentage", label: "Percentage" },
                ]}
                value={editor.calcType}
                onChange={(calcType) => setEditor((s) => ({ ...s, calcType }))}
              />
            </div>
            <div>
              <label className={labelClass}>Default amount / rate</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={editor.defaultAmount}
                onChange={(e) => setEditor((s) => ({ ...s, defaultAmount: Number(e.target.value) }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <input
                type="checkbox"
                checked={editor.isActive !== false}
                onChange={(e) => setEditor((s) => ({ ...s, isActive: e.target.checked }))}
              />
              Apply on payroll
            </label>
            <button type="submit" className={`${fleet.primaryBtn} w-full justify-center`}>Save</button>
          </form>
        )}
      </LeaveSlideOver>

      <LeaveSlideOver open={Boolean(form)} title="Schedule & tax slabs" onClose={() => setForm(null)} width="max-w-xl">
        {form && (
          <form onSubmit={saveSettings} className="space-y-3">
            <div>
              <label className={labelClass}>Company name</label>
              <input className={inputClass} value={form.companyName} onChange={(e) => setForm((s) => ({ ...s, companyName: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Payroll day of month</label>
              <input
                type="number"
                min="1"
                max="28"
                className={inputClass}
                value={form.payDay}
                onChange={(e) => setForm((s) => ({ ...s, payDay: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className={labelClass}>Default bank name</label>
              <input className={inputClass} value={form.defaultBankName} onChange={(e) => setForm((s) => ({ ...s, defaultBankName: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Cycle end day (e.g. 25 = 26th previous month to 25th)</label>
              <input
                type="number"
                min="1"
                max="28"
                className={inputClass}
                value={form.cycleEndDay}
                onChange={(e) => setForm((s) => ({ ...s, cycleEndDay: Number(e.target.value) || 25 }))}
              />
            </div>
            <div>
              <label className={labelClass}>Lates that equal 1 day salary</label>
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.lateLatesPerDay}
                onChange={(e) => setForm((s) => ({ ...s, lateLatesPerDay: Number(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={labelClass}>Tax slabs (annual)</label>
                <button
                  type="button"
                  className="text-xs font-medium text-zinc-500"
                  onClick={() =>
                    setForm((s) => ({
                      ...s,
                      taxSlabs: [...s.taxSlabs, { from: 0, to: 0, rate: 0 }],
                    }))
                  }
                >
                  + Add slab
                </button>
              </div>
              <div className="space-y-2">
                {form.taxSlabs.map((slab, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="From"
                      value={slab.from}
                      onChange={(e) => {
                        const taxSlabs = [...form.taxSlabs];
                        taxSlabs[i] = { ...slab, from: Number(e.target.value) };
                        setForm((s) => ({ ...s, taxSlabs }));
                      }}
                    />
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="To"
                      value={slab.to}
                      onChange={(e) => {
                        const taxSlabs = [...form.taxSlabs];
                        taxSlabs[i] = { ...slab, to: Number(e.target.value) };
                        setForm((s) => ({ ...s, taxSlabs }));
                      }}
                    />
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="%"
                      value={slab.rate}
                      onChange={(e) => {
                        const taxSlabs = [...form.taxSlabs];
                        taxSlabs[i] = { ...slab, rate: Number(e.target.value) };
                        setForm((s) => ({ ...s, taxSlabs }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving} className={`${fleet.primaryBtn} w-full justify-center`}>
              Save settings
            </button>
          </form>
        )}
      </LeaveSlideOver>
    </div>
  );
}
