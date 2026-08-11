"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetEmployeeAllowancesQuery,
  useCreateEmployeeAllowanceMutation,
  useDeleteEmployeeAllowanceMutation,
  useGetAvailableVehiclesQuery,
} from "@/app/_Services/employee/hrms";
import { ALLOWANCE_TYPE_OPTIONS } from "@/app/schema/employee";
import {
  SectionCard,
  EmptyState,
  inputClass,
  labelClass,
  btnPrimary,
  btnCancel,
  formatDate,
  formatMoney,
} from "./hrmsUi";

const emptyForm = () => ({
  allowanceType: "Car Allowance",
  benefitMode: "cash",
  amount: "",
  vehicleId: "",
  effectiveDate: "",
  notes: "",
});

export default function AllowancesTab({ employeeId }) {
  const { data, isLoading, refetch } = useGetEmployeeAllowancesQuery({
    employeeId,
    limit: 50,
  });
  const [createAllowance, { isLoading: saving }] =
    useCreateEmployeeAllowanceMutation();
  const [deleteAllowance] = useDeleteEmployeeAllowanceMutation();

  const isCarType = (type) => type === "Car Allowance";

  const [form, setForm] = useState(emptyForm());

  const { data: availableData, isLoading: loadingCars } =
    useGetAvailableVehiclesQuery(undefined, {
      skip: !isCarType(form.allowanceType) || form.benefitMode !== "company_car",
    });

  const availableCars = availableData?.data?.items || [];
  const items = data?.data?.items || [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.effectiveDate) {
      return toast.error("Effective date is required");
    }

    const car = isCarType(form.allowanceType);
    const mode = car ? form.benefitMode : "cash";

    if (mode === "cash" && (form.amount === "" || form.amount == null)) {
      return toast.error("Amount is required for cash allowance");
    }
    if (mode === "company_car" && !form.vehicleId) {
      return toast.error("Select an available company car");
    }

    try {
      await createAllowance({
        employeeId,
        allowanceType: form.allowanceType,
        benefitMode: mode,
        amount: mode === "company_car" ? Number(form.amount || 0) : Number(form.amount),
        vehicleId: mode === "company_car" ? form.vehicleId : undefined,
        effectiveDate: form.effectiveDate,
        notes: form.notes,
      }).unwrap();
      toast.success(
        mode === "company_car"
          ? "Company car assigned with Car Allowance"
          : "Allowance added"
      );
      setForm(emptyForm());
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add allowance");
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Add Allowance">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Type</label>
            <select
              className={inputClass}
              value={form.allowanceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  allowanceType: e.target.value,
                  benefitMode: e.target.value === "Car Allowance" ? form.benefitMode : "cash",
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
          </div>

          {isCarType(form.allowanceType) && (
            <div className="md:col-span-2">
              <label className={labelClass}>Car benefit choice</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, benefitMode: "cash", vehicleId: "" })
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold border transition ${
                    form.benefitMode === "cash"
                      ? "bg-zinc-100 text-zinc-950 border-white/90"
                      : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08]"
                  }`}
                >
                  Take cash amount
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, benefitMode: "company_car" })}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold border transition ${
                    form.benefitMode === "company_car"
                      ? "bg-zinc-100 text-zinc-950 border-white/90"
                      : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08]"
                  }`}
                >
                  Take company car
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                Employee can either receive a monthly cash car allowance, or get
                an unassigned company vehicle from the fleet.
              </p>
            </div>
          )}

          {(!isCarType(form.allowanceType) || form.benefitMode === "cash") && (
            <div>
              <label className={labelClass}>Amount</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required={!isCarType(form.allowanceType) || form.benefitMode === "cash"}
              />
            </div>
          )}

          {isCarType(form.allowanceType) && form.benefitMode === "company_car" && (
            <div className="md:col-span-2">
              <label className={labelClass}>Available company cars</label>
              <select
                className={inputClass}
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                required
              >
                <option value="">
                  {loadingCars ? "Loading cars..." : "Select available car"}
                </option>
                {availableCars.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.vehicleName}
                    {v.make || v.model
                      ? ` (${[v.make, v.model].filter(Boolean).join(" ")})`
                      : ""}{" "}
                    — {v.registrationNumber}
                  </option>
                ))}
              </select>
              {!loadingCars && availableCars.length === 0 && (
                <p className="text-[11px] text-amber-400 mt-1.5">
                  No unassigned cars available. Add or free a vehicle in Fleet
                  Management first.
                </p>
              )}
            </div>
          )}

          <div>
            <label className={labelClass}>Effective Date</label>
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
            <label className={labelClass}>Notes</label>
            <input
              className={inputClass}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving..." : "Add Allowance"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Allowances">
        {isLoading ? (
          <EmptyState message="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState message="No allowances yet." />
        ) : (
          <ul className="space-y-2">
            {items.map((a) => (
              <li
                key={a._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {a.allowanceType}{" "}
                    {a.benefitMode === "company_car" ? (
                      <span className="text-sky-300">
                        → Company car
                        {a.vehicleId?.vehicleName
                          ? `: ${a.vehicleId.vehicleName} (${a.vehicleId.registrationNumber || "—"})`
                          : ""}
                      </span>
                    ) : (
                      <span className="text-zinc-400">
                        → {formatMoney(a.amount)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Effective {formatDate(a.effectiveDate)} · {a.status}
                    {a.benefitMode === "company_car" ? " · company_car" : " · cash"}
                  </p>
                </div>
                <button
                  type="button"
                  className={btnCancel}
                  onClick={async () => {
                    try {
                      await deleteAllowance(a._id).unwrap();
                      toast.success(
                        a.benefitMode === "company_car"
                          ? "Allowance removed & car released"
                          : "Removed"
                      );
                      refetch();
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed");
                    }
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
