"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useGetPublicCareersJobQuery,
  useApplyPublicCareersJobMutation,
} from "@/app/_Services/recruitment/page";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";

export default function ApplyJobPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data } = useGetPublicCareersJobQuery(slug);
  const [apply, { isLoading }] = useApplyPublicCareersJobMutation();
  const job = data?.data?.job;
  const accepting = data?.data?.accepting;
  const questions = job?.questions || [];

  useEffect(() => {
    document.title = "Apply | zyro";
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentLocation: "",
    consent: false,
    website: "",
  });
  const [answers, setAnswers] = useState({});
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [resumeInputKey, setResumeInputKey] = useState(0);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const MSG_RESUME_TYPE =
    "Only PDF files are allowed. Please upload your CV as a PDF.";
  const MSG_RESUME_SIZE = "File is too large. Maximum size is 5 MB.";
  const MSG_RESUME_EMPTY = "This file is empty. Please choose another file.";

  const validateResumeFile = (file) => {
    if (!file) return "Resume is required (PDF only, max 5 MB)";
    if (!file.size) return MSG_RESUME_EMPTY;
    if (file.size > 5 * 1024 * 1024) return MSG_RESUME_SIZE;
    const extOk = /\.pdf$/i.test(file.name || "");
    const typeOk = file.type === "application/pdf";
    if (!extOk || !typeOk) return MSG_RESUME_TYPE;
    return "";
  };

  const onResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setResume(null);
      setResumeError("");
      return;
    }
    const err = validateResumeFile(file);
    if (err) {
      setResume(null);
      setResumeError(err);
      setResumeInputKey((k) => k + 1);
      return;
    }
    setResume(file);
    setResumeError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!accepting) {
      toast.error("This job is closed");
      return;
    }
    if (!form.consent) {
      toast.error("Please accept the consent checkbox");
      return;
    }
    const fileErr = validateResumeFile(resume);
    if (fileErr) {
      setResumeError(fileErr);
      setResume(null);
      setResumeInputKey((k) => k + 1);
      toast.error(fileErr);
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "consent") fd.append("consent", v ? "true" : "false");
      else fd.append(k, v ?? "");
    });
    fd.append("resume", resume);
    const ans = questions.map((q) => ({
      questionId: q._id,
      value: answers[q._id] ?? "",
    }));
    fd.append("answers", JSON.stringify(ans));

    try {
      await apply({ slug, formData: fd }).unwrap();
      toast.success("Application submitted");
      router.push(
        `/careers/status?email=${encodeURIComponent(form.email)}`
      );
    } catch (err) {
      const msg = err?.data?.message || "Application failed";
      setResumeError(msg);
      toast.error(msg);
    }
  };

  if (!job) {
    return (
      <div className={`${pub.page} p-8 text-sm text-slate-600`}>Loading…</div>
    );
  }

  return (
    <div className={pub.page}>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <Link href={`/careers/${slug}`} className={pub.link}>
          ← {job.title}
        </Link>

        <div className={`${pub.card} mt-4`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
            Application
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Apply for {job.title}
          </h1>
          {!accepting && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              This role is no longer accepting applications.
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* 2 fields per row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["fullName", "Full name *", "text"],
                ["email", "Email *", "email"],
                ["phone", "Phone *", "tel"],
                ["currentLocation", "Current location", "text"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className={pub.label}>{label}</label>
                  <input
                    type={type}
                    required={
                      key === "fullName" || key === "email" || key === "phone"
                    }
                    className={pub.field}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className={pub.label}>Resume (PDF only) *</label>
              <input
                key={resumeInputKey}
                type="file"
                accept=".pdf,application/pdf"
                className={`mt-1 block w-full rounded-xl border border-dashed bg-slate-50 px-3 py-3 text-sm text-slate-700 ${
                  resumeError
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300"
                }`}
                onChange={onResumeChange}
              />
              <p className="mt-1 text-xs text-slate-500">PDF only, max 5 MB</p>
              {resumeError ? (
                <p className="mt-1 text-[11px] font-medium text-red-600">
                  {resumeError}
                </p>
              ) : null}
            </div>

            {questions.length ? (
              <div className="grid grid-cols-1 gap-4">
                {questions.map((q) => (
                  <div key={q._id}>
                    <label className={pub.label}>
                      {q.label}
                      {q.required ? " *" : ""}
                    </label>
                    {q.type === "yes_no" ? (
                      <select
                        required={q.required}
                        className={pub.field}
                        value={answers[q._id] || ""}
                        onChange={(e) =>
                          setAnswers((a) => ({
                            ...a,
                            [q._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    ) : q.type === "mcq" ? (
                      <select
                        required={q.required}
                        className={pub.field}
                        value={answers[q._id] || ""}
                        onChange={(e) =>
                          setAnswers((a) => ({
                            ...a,
                            [q._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {(q.options || []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : q.type === "textarea" ? (
                      <textarea
                        required={q.required}
                        rows={4}
                        className={pub.field}
                        value={answers[q._id] || ""}
                        onChange={(e) =>
                          setAnswers((a) => ({
                            ...a,
                            [q._id]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        type={q.type === "number" ? "number" : "text"}
                        required={q.required}
                        className={pub.field}
                        value={answers[q._id] || ""}
                        onChange={(e) =>
                          setAnswers((a) => ({
                            ...a,
                            [q._id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-1"
              />
              I consent to the processing of my data for recruitment purposes.
            </label>

            <button
              type="submit"
              disabled={
                isLoading || !accepting || !resume || Boolean(resumeError)
              }
              className={`${pub.primaryBtn} w-full`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
