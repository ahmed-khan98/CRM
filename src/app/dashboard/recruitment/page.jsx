"use client";

import Link from "next/link";
import { Briefcase, Users, CalendarDays, Send, UserCheck, Bell } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import { useGetRecruitmentDashboardQuery } from "@/app/_Services/recruitment/page";
import {
  stageLabel,
  formatRecDateTime,
} from "@/app/_Components/recruitment/recruitmentUi";

function StatCard({ label, value, href, icon: Icon }) {
  const inner = (
    <div className={`${fleet.card} p-4 flex items-start gap-3`}>
      <div className="rounded-lg bg-zinc-100 p-2 text-zinc-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-zinc-900">{value ?? "—"}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function RecruitmentDashboardPage() {
  const { data, isFetching } = useGetRecruitmentDashboardQuery();
  const d = data?.data || {};
  const counts = d.counts || {};
  const pipeline = d.pipeline || {};
  const top = d.topCandidates || [];
  const upcoming = d.upcomingInterviews || [];
  const stages = [
    "applied",
    "screened",
    "shortlisted",
    "interview",
    "offer",
    "hired",
  ];

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader
        icon={Briefcase}
        length={counts.activeJobs || 0}
        name="Recruitment"
      >
        <Link href="/dashboard/recruitment/jobs" className={fleet.primaryBtn}>
          Manage jobs
        </Link>
      </AttendenceHeader>

      {isFetching && !data ? (
        <p className="text-sm text-zinc-500">Loading dashboard…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Active jobs"
              value={counts.activeJobs}
              icon={Briefcase}
              href="/dashboard/recruitment/jobs?status=published"
            />
            <StatCard
              label="In pipeline"
              value={counts.totalCandidates}
              icon={Users}
              href="/dashboard/recruitment/jobs"
            />
            <StatCard
              label="Interviews"
              value={counts.interviewsScheduled}
              icon={CalendarDays}
              href="/dashboard/recruitment/interviews"
            />
            <StatCard
              label="Offers sent"
              value={counts.offersSent}
              icon={Send}
              href="/dashboard/recruitment/offers"
            />
            <StatCard
              label="Hired this month"
              value={counts.hiredThisMonth}
              icon={UserCheck}
            />
          </div>

          <div className={`${fleet.card} p-4`}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Hiring pipeline</h2>
              {counts.newApplications > 0 && (
                <Link
                  href="/dashboard/recruitment/jobs"
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"
                >
                  <Bell className="h-3.5 w-3.5" />
                  {counts.newApplications} new (24h)
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {stages.map((s) => (
                <Link
                  key={s}
                  href={`/dashboard/recruitment/jobs?stage=${s}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-center hover:border-zinc-300"
                >
                  <p className="text-lg font-semibold text-zinc-900">
                    {pipeline[s] || 0}
                  </p>
                  <p className="text-[11px] text-zinc-500">{stageLabel(s)}</p>
                </Link>
              ))}
            </div>
            {counts.avgTimeToHire != null && (
              <p className="mt-3 text-xs text-zinc-500">
                Avg time-to-hire this month: {counts.avgTimeToHire} days
              </p>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className={`${fleet.card} p-4`}>
              <h2 className="mb-3 text-sm font-semibold text-zinc-900">
                Top candidates (match %)
              </h2>
              {!top.length ? (
                <p className="text-sm text-zinc-500">No candidates yet.</p>
              ) : (
                <ul className="space-y-2">
                  {top.map((a) => (
                    <li
                      key={a._id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-100 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/recruitment/candidates/${a.candidateId?._id}`}
                          className="truncate text-sm font-medium text-zinc-900 hover:underline"
                        >
                          {a.candidateId?.fullName || "Candidate"}
                        </Link>
                        <p className="truncate text-xs text-zinc-500">
                          {a.jobId?.title}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {a.matchPercent != null && a.matchStatus === "done"
                          ? `${a.matchPercent}%`
                          : a.matchStatus === "pending" ||
                              a.matchStatus === "processing"
                            ? "Processing"
                            : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={`${fleet.card} p-4`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Upcoming interviews
                </h2>
                <Link
                  href="/dashboard/recruitment/interviews"
                  className="text-xs font-medium text-zinc-600 hover:underline"
                >
                  View schedule
                </Link>
              </div>
              {!upcoming.length ? (
                <p className="text-sm text-zinc-500">No upcoming interviews.</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map((iv) => (
                    <li
                      key={iv._id}
                      className="rounded-lg border border-zinc-100 px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-zinc-900">
                        {iv.applicationId?.candidateId?.fullName || "Candidate"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {iv.applicationId?.jobId?.title} ·{" "}
                        {formatRecDateTime(iv.startsAt)}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {(iv.interviewerIds || [])
                          .map((u) => u.fullName)
                          .filter(Boolean)
                          .join(", ") || "No interviewer"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
