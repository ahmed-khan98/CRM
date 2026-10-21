"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetPublicCareersJobsQuery } from "@/app/_Services/recruitment/page";
import {
  formatJobType,
  formatWorkMode,
  formatLocation,
  formatRecDate,
  JOB_TYPES,
  WORK_MODES,
} from "@/app/_Components/recruitment/recruitmentUi";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";

export default function CareersPage() {
  const [q, setQ] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const params = useMemo(
    () => ({
      q: q || undefined,
      jobType: jobType || undefined,
      workMode: workMode || undefined,
      limit: 50,
    }),
    [q, jobType, workMode]
  );
  const { data, isFetching } = useGetPublicCareersJobsQuery(params);
  const items = data?.data?.items || [];
  const branding = data?.data?.branding || {};

  return (
    <div className={pub.page}>
      {branding.bannerUrl ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-800 sm:h-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={branding.bannerUrl}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
        </div>
      ) : null}

      <header className={pub.headerBar}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6">
          <div className="flex min-w-0 items-start gap-3">
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={branding.logoUrl}
                alt={branding.companyName || "Company"}
                className="h-12 w-12 shrink-0 rounded-xl border border-white/20 bg-white object-contain p-1"
              />
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
                {branding.companyName || "Careers"}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {branding.headline || "Open roles"}
              </h1>
              {branding.subheadline ? (
                <p className="mt-1 text-sm text-slate-300">
                  {branding.subheadline}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href="/careers/status"
            className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Check status
          </Link>
        </div>
      </header>

      <main className={pub.shellWide}>
        <div className={`${pub.card} mb-6 !p-4`}>
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <input
              className={`${pub.field} !w-auto min-w-0 flex-1`}
              placeholder="Search roles, skills, location…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className={`${pub.field} !w-[150px] shrink-0`}
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">All types</option>
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className={`${pub.field} !w-[150px] shrink-0`}
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="">All modes</option>
              {WORK_MODES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFetching && !items.length ? (
          <p className="text-sm font-medium text-slate-600">Loading openings…</p>
        ) : !items.length ? (
          <div className={`${pub.card} px-6 py-16 text-center`}>
            <p className="text-lg font-semibold text-slate-900">
              No open positions right now
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Check back soon or follow us for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((job) => (
              <Link
                key={job._id}
                href={`/careers/${job.slug}`}
                className={pub.jobCard}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatLocation(job.location)} ·{" "}
                      {formatJobType(job.jobType)} ·{" "}
                      {formatWorkMode(job.workMode)}
                    </p>
                    {job.deadline ? (
                      <p className="mt-1.5 text-xs font-semibold text-teal-800">
                        Apply by {formatRecDate(job.deadline)}
                      </p>
                    ) : null}
                  </div>
                  <span className={pub.badge}>
                    {job.publishedAt ? formatRecDate(job.publishedAt) : "Open"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
