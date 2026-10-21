"use client";

import { RefreshCw } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import { formatRecDateTime } from "./recruitmentUi";
import MatchPercentCell, { ConfidenceBadge } from "./MatchPercentCell";
import {
  MATCH_CRITERIA_LABELS,
  formatFlagExplanation,
  isMatchProcessing,
  jobNeedsRematch,
  matchReasonLabel,
  matchStatusLabel,
} from "./matchUi";

const SKILL_DISPLAY = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  "node.js": "Node.js",
  react: "React",
  redux: "Redux",
  "next.js": "Next.js",
  express: "Express.js",
  "express.js": "Express.js",
};

function displaySkillName(s) {
  const k = String(s || "").toLowerCase().trim();
  if (!k) return "";
  if (SKILL_DISPLAY[k]) return SKILL_DISPLAY[k];
  return String(s);
}

export default function MatchCard({
  application,
  job,
  onRematch,
  rematching = false,
}) {
  const app = application || {};
  const j = job || app.jobId || {};
  const breakdown = app.scoreBreakdown || {};
  const criteria = breakdown.criteria || {};
  const stale = jobNeedsRematch(app, j);
  const isFallback =
    String(app.matchNote || "").toLowerCase().includes("rule-based");

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Match · {j.title || "Application"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <MatchPercentCell
              matchPercent={app.matchPercent}
              matchStatus={app.matchStatus}
              confidence={app.confidence}
              matchStatusReason={app.matchStatusReason}
              className="text-lg"
            />
            {app.matchStatus === "done" && app.confidence ? (
              <ConfidenceBadge confidence={app.confidence} />
            ) : null}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Status: {matchStatusLabel(app.matchStatus)}
            {app.scoredAt
              ? ` · Scored ${formatRecDateTime(app.scoredAt)}`
              : ""}
          </p>
          {(app.matchStatus === "failed" ||
            app.matchStatus === "not_analyzed") &&
          app.matchStatusReason ? (
            <p className="mt-1 text-xs text-amber-700">
              {matchReasonLabel(app.matchStatusReason)}
            </p>
          ) : null}
        </div>
        {onRematch ? (
          <button
            type="button"
            className={fleet.secondaryBtn}
            disabled={rematching || isMatchProcessing(app.matchStatus)}
            onClick={() => onRematch(app._id)}
          >
            <RefreshCw
              className={`mr-1 inline h-3.5 w-3.5 ${rematching ? "animate-spin" : ""}`}
            />
            Re-match
          </button>
        ) : null}
      </div>

      {stale ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Job updated, re-match recommended
        </p>
      ) : null}

      {app.matchStatus === "done" && Object.keys(criteria).length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Score breakdown
          </p>
          <ul className="space-y-1.5">
            {Object.keys(MATCH_CRITERIA_LABELS).map((key) => {
              const row = criteria[key] || {};
              return (
                <li
                  key={key}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-zinc-600">
                    {MATCH_CRITERIA_LABELS[key]}
                    <span className="ml-1 text-zinc-400">
                      (w {row.scored ? row.weight : row.configuredWeight ?? 0}%)
                    </span>
                  </span>
                  <span className="font-medium text-zinc-900">
                    {row.scored
                      ? `${row.score ?? 0}%`
                      : "not scored"}
                  </span>
                </li>
              );
            })}
          </ul>
          {breakdown.mustHaveCapApplied ? (
            <p className="mt-2 text-xs text-amber-700">
              Score capped at {breakdown.mustHaveCap ?? 60}% (must-have missing
              share
              {breakdown.missingShare != null
                ? ` ${Math.round(Number(breakdown.missingShare) * 100)}%`
                : ""}
              )
            </p>
          ) : null}
        </div>
      ) : null}

      {(app.matchedSkills || []).length > 0 ||
      (app.relatedSkills || []).length > 0 ||
      (app.missingSkills || []).length > 0 ? (
        <div className="space-y-2">
          {(app.matchedSkills || []).length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-semibold text-zinc-500">
                Matched skills
              </p>
              <div className="flex flex-wrap gap-1">
                {app.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {(app.relatedSkills || []).length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-semibold text-zinc-500">
                Related skills
              </p>
              <div className="flex flex-wrap gap-1">
                {app.relatedSkills.map((r) => {
                  const skill = typeof r === "string" ? r : r?.skill;
                  const basedOn =
                    typeof r === "object" && r?.basedOn ? r.basedOn : "";
                  const credit =
                    typeof r === "object" && r?.credit != null
                      ? Number(r.credit)
                      : null;
                  const pct =
                    credit != null && Number.isFinite(credit)
                      ? Math.round(credit * 100)
                      : null;
                  const tip = basedOn
                    ? `Not found in the CV directly. Related skill found: ${displaySkillName(
                        basedOn
                      )}${pct != null ? ` (partial credit ${pct}%)` : ""}`
                    : "Not found in the CV directly. Related skill found (partial credit).";
                  return (
                    <span
                      key={`${skill}-${basedOn}`}
                      title={tip}
                      className="cursor-help rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700"
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}
          {(app.missingSkills || []).length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-semibold text-zinc-500">
                Missing must-have
              </p>
              <div className="flex flex-wrap gap-1">
                {app.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {(app.strengths || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold text-zinc-500">Strengths</p>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-zinc-700">
            {app.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {(app.concerns || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold text-zinc-500">Concerns</p>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-zinc-700">
            {app.concerns.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {app.summary ? (
        <div>
          <p className="mb-1 text-xs font-semibold text-zinc-500">Summary</p>
          <p className="text-xs text-zinc-700">{app.summary}</p>
        </div>
      ) : null}
      {(app.evidence || []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold text-zinc-500">Evidence</p>
          <ul className="space-y-1">
            {app.evidence.map((e, i) => (
              <li
                key={i}
                className="rounded-lg bg-zinc-50 px-2 py-1.5 text-xs italic text-zinc-600"
              >
                “{e}”
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {(app.flags || []).length > 0 ? (
        <div className="space-y-1">
          {(app.flags || []).map((f) => (
            <p
              key={f}
              className="rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800"
            >
              {formatFlagExplanation(f, breakdown)}
            </p>
          ))}
        </div>
      ) : null}

      <p className="border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
        {isFallback
          ? "Rule-based (AI unavailable). "
          : "AI-assisted, advisory only. Final decision is HR's."}
      </p>
    </div>
  );
}
