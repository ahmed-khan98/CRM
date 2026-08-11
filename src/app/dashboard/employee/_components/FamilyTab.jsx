"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetEmployeeFamilyQuery,
  useUpsertEmployeeFamilyMutation,
} from "@/app/_Services/employee/hrms";
import {
  SectionCard,
  EmptyState,
  inputClass,
  labelClass,
  btnPrimary,
  btnCancel,
} from "./hrmsUi";

export default function FamilyTab({ employeeId }) {
  const { data, isLoading, refetch } = useGetEmployeeFamilyQuery(employeeId);
  const [upsert, { isLoading: saving }] = useUpsertEmployeeFamilyMutation();

  const [form, setForm] = useState({
    fatherName: "",
    motherName: "",
    spouse: { name: "", dob: "", cnic: "", phone: "", occupation: "" },
    children: [],
  });

  useEffect(() => {
    const f = data?.data;
    if (!f) return;
    setForm({
      fatherName: f.fatherName || "",
      motherName: f.motherName || "",
      spouse: {
        name: f.spouse?.name || "",
        dob: f.spouse?.dob ? String(f.spouse.dob).split("T")[0] : "",
        cnic: f.spouse?.cnic || "",
        phone: f.spouse?.phone || "",
        occupation: f.spouse?.occupation || "",
      },
      children: (f.children || []).map((c) => ({
        name: c.name || "",
        dob: c.dob ? String(c.dob).split("T")[0] : "",
        gender: c.gender || "",
      })),
    });
  }, [data]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await upsert({ employeeId, body: form }).unwrap();
      toast.success("Family information saved");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  if (isLoading) return <EmptyState message="Loading..." />;

  return (
    <form onSubmit={save} className="space-y-4">
      <SectionCard title="Parents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Father Name</label>
            <input
              className={inputClass}
              value={form.fatherName}
              onChange={(e) =>
                setForm({ ...form, fatherName: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Mother Name</label>
            <input
              className={inputClass}
              value={form.motherName}
              onChange={(e) =>
                setForm({ ...form, motherName: e.target.value })
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Spouse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["name", "Name", "text"],
            ["dob", "Date of Birth", "date"],
            ["cnic", "CNIC", "text"],
            ["phone", "Phone", "text"],
            ["occupation", "Occupation", "text"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type={type}
                className={inputClass}
                value={form.spouse[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    spouse: { ...form.spouse, [key]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Children"
        action={
          <button
            type="button"
            className={btnCancel}
            onClick={() =>
              setForm({
                ...form,
                children: [
                  ...form.children,
                  { name: "", dob: "", gender: "" },
                ],
              })
            }
          >
            Add Child
          </button>
        }
      >
        {form.children.length === 0 ? (
          <EmptyState message="No children added." />
        ) : (
          <div className="space-y-3">
            {form.children.map((child, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl border border-zinc-200 p-3"
              >
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={child.name}
                  onChange={(e) => {
                    const next = [...form.children];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setForm({ ...form, children: next });
                  }}
                />
                <input
                  type="date"
                  className={inputClass}
                  value={child.dob}
                  onChange={(e) => {
                    const next = [...form.children];
                    next[idx] = { ...next[idx], dob: e.target.value };
                    setForm({ ...form, children: next });
                  }}
                />
                <select
                  className={inputClass}
                  value={child.gender}
                  onChange={(e) => {
                    const next = [...form.children];
                    next[idx] = { ...next[idx], gender: e.target.value };
                    setForm({ ...form, children: next });
                  }}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="button"
                  className={btnCancel}
                  onClick={() =>
                    setForm({
                      ...form,
                      children: form.children.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Saving..." : "Save Family Info"}
        </button>
      </div>
    </form>
  );
}
