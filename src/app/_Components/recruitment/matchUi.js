/** Shared match display helpers — keep Processing / Failed / Not analyzed consistent. */

export const MATCH_CRITERIA_LABELS = {
  mustHaveSkills: "Must-have skills",
  experience: "Experience",
  roleRelevance: "Role relevance",
  education: "Education",
  niceToHaveSkills: "Nice-to-have skills",
};

export function matchStatusLabel(status) {
  const map = {
    pending: "Processing",
    processing: "Processing",
    done: "Done",
    failed: "Failed",
    not_analyzed: "Not analyzed",
  };
  return map[status] || status || "—";
}

export function matchReasonLabel(reason) {
  const map = {
    scanned_cv: "Scanned CV — little or no extractable text",
    unreadable_pdf: "Unreadable PDF",
    unsupported_format: "Unsupported file format",
    download_failed: "Could not load CV file",
    extract_failed: "Could not extract text from CV",
    insufficient_job_criteria: "Job has no scorable criteria",
    insufficient_data: "Not enough data to score",
    missing_job_or_candidate: "Missing job or candidate",
    match_pipeline_error: "Matching pipeline error",
    AI_DISABLED: "AI unavailable — rule-based only",
  };
  if (!reason) return "";
  return map[reason] || String(reason).replace(/_/g, " ");
}

export function confidenceLabel(c) {
  if (!c) return "";
  const s = String(c).toLowerCase();
  if (s === "high") return "High";
  if (s === "medium") return "Medium";
  if (s === "low") return "Low";
  return c;
}

export function isMatchProcessing(status) {
  return status === "pending" || status === "processing";
}

export function formatFlagExplanation(flag, breakdown) {
  if (flag === "mismatch") {
    const cv = breakdown?.cvYears;
    const form = breakdown?.formYears;
    if (cv != null && form != null) {
      return `Mismatch: CV says ${cv} years, form says ${form} years`;
    }
    return "Mismatch: CV experience differs from the form by more than 1 year";
  }
  if (flag === "suspicious_cv") {
    return "Suspicious CV: contains instruction-like text. Review manually";
  }
  return String(flag).replace(/_/g, " ");
}

export function jobNeedsRematch(app, job) {
  const jobVersion = Number(job?.version ?? app?.jobId?.version ?? 0) || 1;
  const scoredVersion = Number(app?.jobVersion) || 0;
  if (!app?.scoredAt) return false;
  if (app.matchStatus !== "done") return false;
  return jobVersion > scoredVersion;
}
