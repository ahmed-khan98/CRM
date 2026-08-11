"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetEmployeeSalaryHistoryQuery,
  useCreateEmployeeSalaryHistoryMutation,
} from "@/app/_Services/employee/hrms";
import {
  SectionCard,
  EmptyState,
  inputClass,
  labelClass,
  btnPrimary,
  formatDate,
  formatMoney,
} from "./hrmsUi";

export default function SalaryTab({ employeeId, currentSalary }) {
  const { data, isLoading, refetch } = useGetEmployeeSalaryHistoryQuery({
    employeeId,
    limit: 50,
  });
  const [createSalary, { isLoading: saving }] =
    useCreateEmployeeSalaryHistoryMutation();
  const [form, setForm] = useState({
    newSalary: "",
    effectiveDate: "",
    reason: "",
  });

  const items = data?.data?.items || [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.newSalary || !form.effectiveDate) {
      return toast.error("New salary and effective date required");
    }
    try {
      await createSalary({
        employeeId,
        newSalary: Number(form.newSalary),
        effectiveDate: form.effectiveDate,
        reason: form.reason,
      }).unwrap();
      toast.success("Salary revision recorded");
      setForm({ newSalary: "", effectiveDate: "", reason: "" });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Current Salary">
        <p className="text-2xl font-semibold text-zinc-100">
          {formatMoney(currentSalary)}
        </p>
      </SectionCard>

      <SectionCard title="Add Salary Revision">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>New Salary</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.newSalary}
              onChange={(e) => setForm({ ...form, newSalary: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Effective Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.effectiveDate}
              onChange={(e) =>
                setForm({ ...form, effectiveDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <input
              className={inputClass}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Annual increment"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving..." : "Record Revision"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Salary History">
        {isLoading ? (
          <EmptyState message="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState message="No salary history yet." />
        ) : (
          <ul className="space-y-2">
            {items.map((h) => (
              <li
                key={h._id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <p className="text-sm text-zinc-100">
                  {formatDate(h.effectiveDate)} ·{" "}
                  <span className="text-zinc-500">
                    {formatMoney(h.previousSalary)}
                  </span>{" "}
                  → <span className="font-semibold">{formatMoney(h.newSalary)}</span>
                </p>
                {h.reason && (
                  <p className="text-xs text-zinc-500 mt-1">{h.reason}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
