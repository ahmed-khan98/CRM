"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import Tooltip from "@/app/_Components/ui/Tooltip";
import {
  JOB_TYPES,
  WORK_MODES,
  JOB_STATUSES,
  QUESTION_TYPES,
  recField,
  recLabel,
} from "./recruitmentUi";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";

const emptyQuestion = () => ({
  type: "text",
  label: "",
  options: [],
  required: false,
});

export default function JobForm({ initial, onSubmit, submitting }) {
  const { data: deptData } = useAllDepartmentsQuery();
  const departments = deptData?.data || deptData || [];
  const [form, setForm] = useState({
    title: "",
    departmentId: "",
    location: "",
    jobType: "full_time",
    workMode: "onsite",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    niceToHaveSkills: "",
    experienceMin: 0,
    experienceMax: 5,
    education: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "PKR",
    showSalary: false,
    openings: 1,
    deadline: "",
    status: "draft",
    questions: [],
  });

  useEffect(() => {
    if (!initial) return;
    setForm({
      title: initial.title || "",
      departmentId: initial.departmentId?._id || initial.departmentId || "",
      location: initial.location || "",
      jobType: initial.jobType || "full_time",
      workMode: initial.workMode || "onsite",
      description: initial.description || "",
      requirements: initial.requirements || "",
      responsibilities: initial.responsibilities || "",
      skills: (initial.skills || []).join(", "),
      niceToHaveSkills: (initial.niceToHaveSkills || []).join(", "),
      experienceMin: initial.experienceMin ?? 0,
      experienceMax: initial.experienceMax ?? 5,
      education: initial.education || "",
      salaryMin: initial.salaryMin ?? "",
      salaryMax: initial.salaryMax ?? "",
      salaryCurrency: initial.salaryCurrency || "PKR",
      showSalary: Boolean(initial.showSalary),
      openings: initial.openings ?? 1,
      deadline: initial.deadline
        ? new Date(initial.deadline).toISOString().slice(0, 10)
        : "",
      status: initial.status || "draft",
      questions: (initial.questions || []).map((q) => ({
        _id: q._id,
        type: q.type,
        label: q.label,
        options: q.options || [],
        required: q.required,
      })),
    });
  }, [initial]);

  const deptOptions = useMemo(
    () =>
      (Array.isArray(departments) ? departments : []).map((d) => ({
        value: d._id,
        label: d.name,
      })),
    [departments]
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      ...form,
      skills: form.skills,
      niceToHaveSkills: form.niceToHaveSkills,
      salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
      experienceMin: Number(form.experienceMin) || 0,
      experienceMax: Number(form.experienceMax) || 0,
      openings: Number(form.openings) || 1,
      departmentId: form.departmentId || null,
      questions: form.questions.filter((q) => q.label?.trim()),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`${fleet.card} space-y-4 p-4`}>
        <h3 className="text-sm font-semibold text-zinc-900">Basics</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={recLabel}>Job title *</label>
            <input
              className={recField}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Department</label>
            <CrmSelect
              options={deptOptions}
              value={form.departmentId}
              onChange={(v) => set("departmentId", v)}
              placeholder="Select department"
              isClearable
              isSearchable
            />
          </div>
          <div>
            <label className={recLabel}>Location</label>
            <input
              className={recField}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Job type</label>
            <CrmSelect
              options={JOB_TYPES}
              value={form.jobType}
              onChange={(v) => set("jobType", v || "full_time")}
              placeholder="Job type"
            />
          </div>
          <div>
            <label className={recLabel}>Work mode</label>
            <CrmSelect
              options={WORK_MODES}
              value={form.workMode}
              onChange={(v) => set("workMode", v || "onsite")}
              placeholder="Work mode"
            />
          </div>
          <div>
            <label className={recLabel}>Status</label>
            <CrmSelect
              options={JOB_STATUSES}
              value={form.status}
              onChange={(v) => set("status", v || "draft")}
              placeholder="Status"
            />
          </div>
          <div>
            <label className={recLabel}>Openings</label>
            <input
              type="number"
              min={1}
              className={recField}
              value={form.openings}
              onChange={(e) => set("openings", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Deadline</label>
            <LeaveDateField
              value={form.deadline}
              onChange={(deadline) => set("deadline", deadline)}
              placeholder="Select deadline"
            />
          </div>
        </div>
      </div>

      <div className={`${fleet.card} space-y-3 p-4`}>
        <h3 className="text-sm font-semibold text-zinc-900">Description</h3>
        {["description", "requirements", "responsibilities"].map((key) => (
          <div key={key}>
            <label className={recLabel}>{key}</label>
            <textarea
              rows={4}
              className={`${recField} resize-none`}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}
        <div>
          <label className={recLabel}>Must-have skills (comma separated)</label>
          <input
            className={recField}
            value={form.skills}
            onChange={(e) => set("skills", e.target.value)}
            placeholder="e.g. Node.js, React"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Keep only essential skills here. Missing a must-have caps the match
            score.
          </p>
        </div>
        <div>
          <label className={recLabel}>
            Nice-to-have skills (optional, comma separated)
          </label>
          <input
            className={recField}
            value={form.niceToHaveSkills}
            onChange={(e) => set("niceToHaveSkills", e.target.value)}
            placeholder="e.g. Docker, AWS"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={recLabel}>Exp min (years)</label>
            <input
              type="number"
              className={recField}
              value={form.experienceMin}
              onChange={(e) => set("experienceMin", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Exp max (years)</label>
            <input
              type="number"
              className={recField}
              value={form.experienceMax}
              onChange={(e) => set("experienceMax", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Education</label>
            <input
              className={recField}
              value={form.education}
              onChange={(e) => set("education", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${fleet.card} space-y-3 p-4`}>
        <h3 className="text-sm font-semibold text-zinc-900">Compensation</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={recLabel}>Min salary</label>
            <input
              type="number"
              className={recField}
              value={form.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Max salary</label>
            <input
              type="number"
              className={recField}
              value={form.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
            />
          </div>
          <div>
            <label className={recLabel}>Currency</label>
            <input
              className={recField}
              value={form.salaryCurrency}
              onChange={(e) => set("salaryCurrency", e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={form.showSalary}
            onChange={(e) => set("showSalary", e.target.checked)}
          />
          Show salary on careers page
        </label>
      </div>

      <div className={`${fleet.card} space-y-3 p-4`}>
        <h3 className="text-sm font-semibold text-zinc-900">
          Screening questions
        </h3>
        {form.questions.map((q, idx) => (
          <div
            key={idx}
            className="grid gap-2 rounded-lg border border-zinc-200 p-3 sm:grid-cols-4"
          >
            <input
              className={`${recField} sm:col-span-2`}
              placeholder="Question"
              value={q.label}
              onChange={(e) => {
                const next = [...form.questions];
                next[idx] = { ...q, label: e.target.value };
                set("questions", next);
              }}
            />
            <CrmSelect
              options={QUESTION_TYPES}
              value={q.type}
              onChange={(v) => {
                const next = [...form.questions];
                next[idx] = { ...q, type: v || "text" };
                set("questions", next);
              }}
              placeholder="Type"
            />
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) => {
                    const next = [...form.questions];
                    next[idx] = { ...q, required: e.target.checked };
                    set("questions", next);
                  }}
                />
                Required
              </label>
              <Tooltip label="Delete question" side="top">
                <button
                  type="button"
                  className={fleet.secondaryBtn}
                  onClick={() => {
                    set(
                      "questions",
                      form.questions.filter((_, i) => i !== idx)
                    );
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
            {q.type === "mcq" && (
              <input
                className={`${recField} sm:col-span-4`}
                placeholder="Options comma-separated"
                value={(q.options || []).join(", ")}
                onChange={(e) => {
                  const next = [...form.questions];
                  next[idx] = {
                    ...q,
                    options: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  };
                  set("questions", next);
                }}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className={fleet.secondaryBtn}
          onClick={() =>
            set("questions", [...form.questions, emptyQuestion()])
          }
        >
          Add question
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" disabled={submitting} className={fleet.primaryBtn}>
          {submitting ? "Saving…" : "Save job"}
        </button>
      </div>
    </form>
  );
}
