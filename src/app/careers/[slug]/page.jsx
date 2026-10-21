"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetPublicCareersJobQuery } from "@/app/_Services/recruitment/page";
import {
  formatJobType,
  formatWorkMode,
  formatLocation,
  formatRecDate,
} from "@/app/_Components/recruitment/recruitmentUi";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";

export default function CareerJobDetailPage() {
  const { slug } = useParams();
  const { data, isFetching, error } = useGetPublicCareersJobQuery(slug);
  const job = data?.data?.job;
  const accepting = data?.data?.accepting;

  useEffect(() => {
    if (job?.title) {
      document.title = `${job.title} | zyro`;
    }
    return () => {
      document.title = "Careers | zyro";
    };
  }, [job?.title]);

  if (isFetching && !job) {
    return (
      <div className={`${pub.page} p-8 text-sm text-slate-600`}>Loading…</div>
    );
  }
  if (error || !job) {
    return (
      <div className={`${pub.page} p-8`}>
        <p className="font-medium text-slate-800">Job not found.</p>
        <Link href="/careers" className={`mt-2 inline-block ${pub.link}`}>
          Back to careers
        </Link>
      </div>
    );
  }

  return (
    <div className={pub.page}>
      <div className={pub.shell}>
        <Link href="/careers" className={pub.link}>
          ← All openings
        </Link>

        <article className={`${pub.card} mt-4`}>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {job.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {formatLocation(job.location)} · {formatJobType(job.jobType)} ·{" "}
            {formatWorkMode(job.workMode)}
          </p>
          {job.showSalary &&
            (job.salaryMin != null || job.salaryMax != null) && (
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {job.salaryCurrency} {job.salaryMin?.toLocaleString?.() || "—"} –{" "}
                {job.salaryMax?.toLocaleString?.() || "—"}
              </p>
            )}

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1 text-sm text-slate-600">
              {(job.experienceMin != null || job.experienceMax != null) && (
                <p>
                  Experience:{" "}
                  <span className="font-semibold text-slate-900">
                    {job.experienceMin ?? 0}
                    {job.experienceMax != null ? `–${job.experienceMax}` : "+"}{" "}
                    years
                  </span>
                </p>
              )}
              {job.deadline ? (
                <p>
                  Application deadline:{" "}
                  <span className="font-semibold text-slate-900">
                    {formatRecDate(job.deadline)}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              {accepting ? (
                <Link
                  href={`/careers/${slug}/apply`}
                  className={pub.primaryBtn}
                >
                  Apply
                </Link>
              ) : (
                <span className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600">
                  Closed
                </span>
              )}
            </div>
          </div>

          {(job.skills || []).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className={pub.badge}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {[
            ["Description", job.description],
            ["Requirements", job.requirements],
            ["Responsibilities", job.responsibilities],
            ["Required education", job.education],
          ].map(([title, body]) =>
            body ? (
              <section
                key={title}
                className="mt-8 border-t border-slate-200 pt-6"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {title}
                </h2>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {body}
                </div>
              </section>
            ) : null
          )}
        </article>
      </div>
    </div>
  );
}
