"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import {
  useGetEmployeeSalaryHistoryQuery,
  useCreateEmployeeSalaryHistoryMutation,
  useGetEmployeeAllowancesQuery,
  useCreateEmployeeAllowanceMutation,
  useUpdateEmployeeAllowanceMutation,
  useDeleteEmployeeAllowanceMutation,
  useGetAvailableVehiclesQuery,
} from "@/app/_Services/employee/hrms";
import { ALLOWANCE_TYPE_OPTIONS } from "@/app/schema/employee";
import {
  SectionCard,
  EmptyState,
  StatCard,
  inputClass,
  labelClass,
  btnPrimary,
  btnCancel,
  hrms,
  StatusBadge,
  formatDate,
  formatMoney,
} from "./hrmsUi";

/**
 * Real HRMS pattern (greytHR / Zoho / Workday):
 * One Salary Structure screen = Basic Pay + Allowance components + Effective Date.
 */
const emptyRow = () => ({
  key: `${Date.now()}-${Math.random()}`,
  allowanceType: "Medical Allowance",
  benefitMode: "cash",
  amount: "",
  vehicleId: "",
  notes: "",
});

export default function CompensationTab({ employeeId, employee, onSaved }) {
  const hasStructure =
    employee?.currentSalary != null && Number(employee.currentSalary) > 0;

  const { data: salaryData, isLoading: loadingSalary, refetch: refetchSalary } =
    useGetEmployeeSalaryHistoryQuery({ employeeId, limit: 50 });
  const {
    data: allowanceData,
    isLoading: loadingAllowances,
    refetch: refetchAllowances,
  } = useGetEmployeeAllowancesQuery({ employeeId, limit: 50 });

  const [createSalary] = useCreateEmployeeSalaryHistoryMutation();
  const [createAllowance] = useCreateEmployeeAllowanceMutation();
  const [updateAllowance, { isLoading: toggling }] =
    useUpdateEmployeeAllowanceMutation();
  const [deleteAllowance] = useDeleteEmployeeAllowanceMutation();

  const [editing, setEditing] = useState(!hasStructure);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [form, setForm] = useState({
    basicSalary: "",
    effectiveDate: new Date().toISOString().slice(0, 10),
    reason: hasStructure ? "Salary revision" : "Joining salary structure",
    rows: [emptyRow()],
  });

  const salaryHistory = salaryData?.data?.items || [];
  const allAllowances = allowanceData?.data?.items || [];
  const allowances = allAllowances.filter((a) => a.status !== "inactive");

  const toggleAllowanceStatus = async (a) => {
    const next = a.status === "active" ? "inactive" : "active";
    setTogglingId(a._id);
    try {
      await updateAllowance({
        id: a._id,
        body: { status: next },
      }).unwrap();
      toast.success(
        next === "active" ? "Allowance activated" : "Allowance deactivated"
      );
      if (
        next === "active" &&
        a.benefitMode === "company_car" &&
        !a.vehicleId
      ) {
        toast(
          "Company car was released earlier — revise structure to assign a car again.",
          { icon: "ℹ️" }
        );
      }
      await refreshAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const needsCars = form.rows.some(
    (r) =>
      r.allowanceType === "Car Allowance" && r.benefitMode === "company_car"
  );
  const { data: availableData, isLoading: loadingCars } =
    useGetAvailableVehiclesQuery(undefined, { skip: !needsCars || !editing });
  const availableCars = availableData?.data?.items || [];

  const totalAllowances = useMemo(
    () =>
      allowances.reduce(
        (sum, a) =>
          a.benefitMode === "company_car" ? sum : sum + Number(a.amount || 0),
        0
      ),
    [allowances]
  );
  const basic = Number(employee?.currentSalary || 0);
  const gross = basic + totalAllowances;

  const draftAllowances = form.rows.reduce((sum, r) => {
    if (r.benefitMode === "company_car") return sum;
    return sum + Number(r.amount || 0);
  }, 0);
  const draftGross = Number(form.basicSalary || 0) + draftAllowances;

  const refreshAll = async () => {
    await Promise.all([refetchSalary(), refetchAllowances()]);
    onSaved?.();
  };

  const startEdit = (mode) => {
    setForm({
      basicSalary: mode === "revise" && basic ? String(basic) : "",
      effectiveDate: new Date().toISOString().slice(0, 10),
      reason: mode === "revise" ? "Salary revision" : "Joining salary structure",
      rows: [emptyRow()],
    });
    setEditing(true);
  };

  const updateRow = (key, patch) => {
    setForm((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    }));
  };

  const onSaveStructure = async (e) => {
    e.preventDefault();
    if (form.basicSalary === "" || Number(form.basicSalary) < 0) {
      return toast.error("Basic salary is required");
    }
    if (!form.effectiveDate) {
      return toast.error("Effective from date is required");
    }

    for (const row of form.rows) {
      const filled =
        row.amount !== "" ||
        row.vehicleId ||
        (row.allowanceType === "Car Allowance" && row.benefitMode === "company_car");
      // Skip completely empty optional rows
      const isEmptyCash =
        row.benefitMode !== "company_car" &&
        (row.amount === "" || row.amount == null);
      const isEmptyCar =
        row.allowanceType === "Car Allowance" &&
        row.benefitMode === "company_car" &&
        !row.vehicleId;

      if (isEmptyCash && row.allowanceType !== "Car Allowance") {
        // empty amount row — skip if all blank notes
        if (!row.notes) continue;
        return toast.error(`Enter amount for ${row.allowanceType}`);
      }
      if (
        row.allowanceType === "Car Allowance" &&
        row.benefitMode === "company_car" &&
        !row.vehicleId
      ) {
        // if they selected company car type but no vehicle — only error if intentional
        if (filled || form.rows.length === 1) {
          // skip empty car row if user didn't fill
          if (!row.vehicleId && !row.amount) continue;
          return toast.error("Select an available company car");
        }
      }
      if (
        row.allowanceType === "Car Allowance" &&
        row.benefitMode === "cash" &&
        isEmptyCash
      ) {
        continue; // skip empty
      }
    }

    const rowsToSave = form.rows.filter((row) => {
      if (row.allowanceType === "Car Allowance" && row.benefitMode === "company_car") {
        return Boolean(row.vehicleId);
      }
      return row.amount !== "" && row.amount != null && Number(row.amount) >= 0;
    });

    setSaving(true);
    try {
      const currentBasic = Number(employee?.currentSalary || 0);
      const nextBasic = Number(form.basicSalary);
      const salaryChanged = nextBasic !== currentBasic;

      if (!salaryChanged && rowsToSave.length === 0 && hasStructure) {
        toast.error("No salary change or new allowances to save");
        setSaving(false);
        return;
      }

      if (salaryChanged) {
        await createSalary({
          employeeId,
          newSalary: nextBasic,
          effectiveDate: form.effectiveDate,
          reason: form.reason || "Salary structure",
        }).unwrap();
      }

      for (const row of rowsToSave) {
        const isCar = row.allowanceType === "Car Allowance";
        const mode = isCar ? row.benefitMode : "cash";
        await createAllowance({
          employeeId,
          allowanceType: row.allowanceType,
          benefitMode: mode,
          amount:
            mode === "company_car"
              ? Number(row.amount || 0)
              : Number(row.amount),
          vehicleId: mode === "company_car" ? row.vehicleId : undefined,
          effectiveDate: form.effectiveDate,
          notes: row.notes || form.reason || "",
        }).unwrap();
      }

      toast.success(
        hasStructure ? "Salary structure revised" : "Salary structure saved"
      );
      setEditing(false);
      await refreshAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save salary structure");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Basic Salary" value={formatMoney(basic)} />
        <StatCard
          label="Allowances"
          value={formatMoney(totalAllowances)}
          hint={`${allowances.length} active component(s)`}
        />
        <StatCard
          label="Gross Salary"
          value={formatMoney(gross)}
          hint="Basic + cash allowances"
        />
      </div>

      {!hasStructure && !editing && (
        <div className={`${hrms.shell} p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-amber-200 bg-amber-50/80`}>
          <div className="flex gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Salary structure not configured
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Set Basic Pay and Allowances on one screen with a single
                effective date.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => startEdit("start")}
            className={btnPrimary}
          >
            Add Salary Structure
          </button>
        </div>
      )}

      {editing && (
        <SectionCard
          title={hasStructure ? "Revise Salary Structure" : "Salary Structure"}
          subtitle="Basic pay + allowance components (standard HRMS payroll setup)"
          action={
            hasStructure ? (
              <button
                type="button"
                className={btnCancel}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            ) : null
          }
        >
          <form onSubmit={onSaveStructure} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Effective From *</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.effectiveDate}
                  onChange={(e) =>
                    setForm({ ...form, effectiveDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Remarks</label>
                <input
                  className={inputClass}
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  placeholder="Joining / Annual revision"
                />
              </div>
            </div>

            {/* Structure table — greytHR style */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-50/90">
                  <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                    <th className="px-4 py-3 font-semibold">Salary Component</th>
                    <th className="px-4 py-3 font-semibold">Type / Option</th>
                    <th className="px-4 py-3 font-semibold w-40">
                      Monthly Amount
                    </th>
                    <th className="px-2 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {/* Basic — always first row */}
                  <tr>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">Basic Pay</p>
                      <p className="text-[11px] text-zinc-500">
                        Starting / base salary
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">Fixed</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        placeholder="100000"
                        value={form.basicSalary}
                        onChange={(e) =>
                          setForm({ ...form, basicSalary: e.target.value })
                        }
                        required
                      />
                    </td>
                    <td />
                  </tr>

                  {form.rows.map((row) => {
                    const isCar = row.allowanceType === "Car Allowance";
                    return (
                      <tr key={row.key}>
                        <td className="px-4 py-3 align-top">
                          <select
                            className={inputClass}
                            value={row.allowanceType}
                            onChange={(e) =>
                              updateRow(row.key, {
                                allowanceType: e.target.value,
                                benefitMode:
                                  e.target.value === "Car Allowance"
                                    ? row.benefitMode
                                    : "cash",
                                vehicleId: "",
                              })
                            }
                          >
                            {ALLOWANCE_TYPE_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 align-top">
                          {isCar ? (
                            <div className="space-y-2">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateRow(row.key, {
                                      benefitMode: "cash",
                                      vehicleId: "",
                                    })
                                  }
                                  className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-bold border ${
                                    row.benefitMode === "cash"
                                      ? "bg-zinc-900 text-white border-zinc-900"
                                      : "bg-white text-zinc-600 border-zinc-200"
                                  }`}
                                >
                                  Cash
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateRow(row.key, {
                                      benefitMode: "company_car",
                                    })
                                  }
                                  className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-bold border ${
                                    row.benefitMode === "company_car"
                                      ? "bg-zinc-900 text-white border-zinc-900"
                                      : "bg-white text-zinc-600 border-zinc-200"
                                  }`}
                                >
                                  Company Car
                                </button>
                              </div>
                              {row.benefitMode === "company_car" && (
                                <select
                                  className={inputClass}
                                  value={row.vehicleId}
                                  onChange={(e) =>
                                    updateRow(row.key, {
                                      vehicleId: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">
                                    {loadingCars
                                      ? "Loading cars..."
                                      : "Select available car"}
                                  </option>
                                  {availableCars.map((v) => (
                                    <option key={v._id} value={v._id}>
                                      {v.vehicleName} — {v.registrationNumber}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-500">
                              Cash allowance
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top">
                          {!(isCar && row.benefitMode === "company_car") ? (
                            <input
                              type="number"
                              min="0"
                              className={inputClass}
                              placeholder="0"
                              value={row.amount}
                              onChange={(e) =>
                                updateRow(row.key, { amount: e.target.value })
                              }
                            />
                          ) : (
                            <span className="text-xs text-zinc-500">
                              Vehicle assigned
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-3 align-top">
                          <button
                            type="button"
                            className={hrms.dangerBtn}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                rows: prev.rows.filter((r) => r.key !== row.key),
                              }))
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-zinc-50 border-t border-zinc-200">
                  <tr>
                    <td colSpan={2} className="px-4 py-3">
                      <button
                        type="button"
                        className={btnCancel}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            rows: [...prev.rows, emptyRow()],
                          }))
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Add Allowance Component
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900 tabular-nums">
                      {formatMoney(draftGross)}
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-4 pb-3 text-[11px] text-zinc-500">
                      Gross preview = Basic + cash allowances (company car is
                      non-cash benefit)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              {hasStructure && (
                <button
                  type="button"
                  className={btnCancel}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? "Saving..." : "Save Salary Structure"}
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {hasStructure && !editing && (
        <div className="flex justify-end">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => startEdit("revise")}
          >
            Revise Salary Structure
          </button>
        </div>
      )}

      <SectionCard
        title="Current Structure Components"
        subtitle="Activate / deactivate allowances without deleting history"
      >
        {loadingAllowances && loadingSalary ? (
          <EmptyState message="Loading..." />
        ) : !hasStructure && allAllowances.length === 0 ? (
          <EmptyState message="No salary structure yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-100">
                  <th className="py-2 pr-3 font-semibold">Component</th>
                  <th className="py-2 pr-3 font-semibold">Amount / Benefit</th>
                  <th className="py-2 pr-3 font-semibold">Effective</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {hasStructure && (
                  <tr>
                    <td className="py-3 pr-3 font-medium text-zinc-900">
                      Basic Pay
                    </td>
                    <td className="py-3 pr-3 font-semibold text-zinc-900">
                      {formatMoney(basic)}
                    </td>
                    <td className="py-3 pr-3 text-zinc-500">—</td>
                    <td className="py-3 pr-3">
                      <StatusBadge active label="Active" />
                    </td>
                    <td className="py-3 text-zinc-400 text-xs">Core</td>
                  </tr>
                )}
                {allAllowances.map((a) => {
                  const isActive = a.status !== "inactive";
                  return (
                    <tr
                      key={a._id}
                      className={!isActive ? "opacity-60 bg-zinc-50/80" : ""}
                    >
                      <td className="py-3 pr-3 font-medium text-zinc-900">
                        {a.allowanceType}
                      </td>
                      <td className="py-3 pr-3 text-zinc-700">
                        {a.benefitMode === "company_car"
                          ? `Company car${
                              a.vehicleId?.vehicleName
                                ? `: ${a.vehicleId.vehicleName}`
                                : ""
                            }`
                          : formatMoney(a.amount)}
                      </td>
                      <td className="py-3 pr-3 text-zinc-500">
                        {formatDate(a.effectiveDate)}
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge
                          active={isActive}
                          label={isActive ? "Active" : "Deactive"}
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={toggling && togglingId === a._id}
                            className={
                              isActive ? hrms.dangerBtn : btnPrimary
                            }
                            onClick={() => toggleAllowanceStatus(a)}
                          >
                            {togglingId === a._id
                              ? "..."
                              : isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                          <button
                            type="button"
                            className={btnCancel}
                            onClick={async () => {
                              try {
                                await deleteAllowance(a._id).unwrap();
                                toast.success("Allowance deleted");
                                await refreshAll();
                              } catch (err) {
                                toast.error(err?.data?.message || "Failed");
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Salary Revision History"
        subtitle="Previous basic salary values are kept — never overwritten"
      >
        {loadingSalary ? (
          <EmptyState message="Loading..." />
        ) : salaryHistory.length === 0 ? (
          <EmptyState message="No revisions yet." />
        ) : (
          <ul className="space-y-2">
            {salaryHistory.map((h) => (
              <li
                key={h._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {formatDate(h.effectiveDate)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {h.reason || "—"}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-zinc-700">
                  <span className="text-zinc-400">
                    {formatMoney(h.previousSalary)}
                  </span>
                  {" → "}
                  <span className="font-bold text-zinc-900">
                    {formatMoney(h.newSalary)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
