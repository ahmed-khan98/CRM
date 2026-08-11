"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetEmployeePreviousEmploymentQuery,
  useCreateEmployeePreviousEmploymentMutation,
  useDeleteEmployeePreviousEmploymentMutation,
} from "@/app/_Services/employee/hrms";
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

const empty = () => ({
  companyName: "",
  designation: "",
  startDate: "",
  endDate: "",
  lastSalary: "",
  reasonForLeaving: "",
});

export default function PreviousEmploymentTab({ employeeId }) {
  const { data, isLoading, refetch } = useGetEmployeePreviousEmploymentQuery({
    employeeId,
    limit: 50,
  });
  const [createPrev, { isLoading: saving }] =
    useCreateEmployeePreviousEmploymentMutation();
  const [deletePrev] = useDeleteEmployeePreviousEmploymentMutation();
  const [form, setForm] = useState(empty());

  const items = data?.data?.items || [];

  return (
    <div className="space-y-4">
      <SectionCard title="Add Previous Employment">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await createPrev({
                employeeId,
                ...form,
                lastSalary: form.lastSalary
                  ? Number(form.lastSalary)
                  : undefined,
              }).unwrap();
              toast.success("Record added");
              setForm(empty());
              refetch();
            } catch (err) {
              toast.error(err?.data?.message || "Failed");
            }
          }}
        >
          {[
            ["companyName", "Company Name", "text"],
            ["designation", "Designation", "text"],
            ["startDate", "Start Date", "date"],
            ["endDate", "End Date", "date"],
            ["lastSalary", "Last Salary", "number"],
            ["reasonForLeaving", "Reason for Leaving", "text"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type={type}
                className={inputClass}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={["companyName", "designation", "startDate"].includes(key)}
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving..." : "Add Record"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Previous Companies">
        {isLoading ? (
          <EmptyState message="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState message="No previous employment records." />
        ) : (
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p._id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-zinc-200 px-4 py-3"
              >
                <div className="text-sm text-zinc-900">
                  <p className="font-medium text-zinc-900">
                    {p.companyName} · {p.designation}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(p.startDate)} → {formatDate(p.endDate)} ·{" "}
                    {formatMoney(p.lastSalary)}
                  </p>
                  {p.reasonForLeaving && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {p.reasonForLeaving}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={btnCancel}
                  onClick={async () => {
                    try {
                      await deletePrev(p._id).unwrap();
                      toast.success("Deleted");
                      refetch();
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed");
                    }
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
