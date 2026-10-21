"use client";

import {
  confidenceLabel,
  isMatchProcessing,
  matchReasonLabel,
  matchStatusLabel,
} from "./matchUi";

function ConfidenceBadge({ confidence }) {
  if (!confidence) return null;
  const c = String(confidence).toLowerCase();
  const cls =
    c === "high"
      ? "bg-emerald-50 text-emerald-700"
      : c === "medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-zinc-100 text-zinc-600";
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {confidenceLabel(confidence)}
    </span>
  );
}

/**
 * Compact match column cell for tables / boards.
 * Never shows 0% for a null score.
 */
export default function MatchPercentCell({
  matchPercent,
  matchStatus,
  confidence,
  matchStatusReason,
  className = "",
}) {
  if (isMatchProcessing(matchStatus)) {
    return (
      <span className={`font-semibold text-amber-600 ${className}`}>
        Processing
      </span>
    );
  }
  if (matchStatus === "failed") {
    return (
      <span
        className={`font-semibold text-red-600 ${className}`}
        title={matchReasonLabel(matchStatusReason) || "Failed"}
      >
        Failed
      </span>
    );
  }
  if (matchStatus === "not_analyzed") {
    return (
      <span
        className={`font-semibold text-zinc-500 ${className}`}
        title={matchReasonLabel(matchStatusReason) || "Not analyzed"}
      >
        Not analyzed
      </span>
    );
  }
  if (matchPercent == null || matchPercent === "") {
    return <span className={`text-zinc-400 ${className}`}>—</span>;
  }
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-semibold text-emerald-700">{matchPercent}%</span>
      <ConfidenceBadge confidence={confidence} />
    </span>
  );
}

export { ConfidenceBadge, matchStatusLabel };
