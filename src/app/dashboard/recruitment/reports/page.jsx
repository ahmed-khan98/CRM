"use client";

import { ChartBar } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import { useGetRecruitmentReportsQuery } from "@/app/_Services/recruitment/page";
import { stageLabel } from "@/app/_Components/recruitment/recruitmentUi";

export default function RecruitmentReportsPage() {
  const { data, isFetching } = useGetRecruitmentReportsQuery();
  const r = data?.data || {};
  const funnel = r.funnel || [];
  const bySource = r.bySource || [];
  const apiBase = String(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={ChartBar} length={funnel.length} name="Recruitment reports">
        <a
          href={`${apiBase}/recruitment/export/applications`}
          className={fleet.primaryBtn}
          onClick={(e) => {
            // need auth cookie — open in same origin via fetch download preferred;
            // fallback: user already logged in if same site cookies work for navigation
          }}
        >
          Export CSV
        </a>
      </AttendenceHeader>

      {isFetching && !data ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={`${fleet.card} p-4`}>
            <h3 className="mb-2 text-sm font-semibold">Funnel</h3>
            <p className="mb-3 text-xs text-zinc-500">
              Conversion (applied → hired): {r.conversionPercent ?? 0}%
            </p>
            <ul className="space-y-2">
              {funnel.map((row) => (
                <li
                  key={row._id}
                  className="flex justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                >
                  <span>{stageLabel(row._id)}</span>
                  <strong>{row.count}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${fleet.card} p-4`}>
            <h3 className="mb-2 text-sm font-semibold">By source</h3>
            <ul className="space-y-2">
              {!bySource.length ? (
                <li className="text-sm text-zinc-500">No data</li>
              ) : (
                bySource.map((row) => (
                  <li
                    key={row._id || "unknown"}
                    className="flex justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                  >
                    <span>{row._id || "unknown"}</span>
                    <span>
                      {row.applied} applied · {row.hired} hired
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className={`${fleet.card} p-4 lg:col-span-2`}>
            <h3 className="mb-2 text-sm font-semibold">Time to hire (days)</h3>
            <p className="text-sm text-zinc-600">
              {(r.timeToHire || []).length
                ? `Samples: ${(r.timeToHire || [])
                    .slice(0, 10)
                    .map((t) => t.days)
                    .join(", ")}`
                : "No hired applications yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
