/** Match CrmSelect / HRMS field chrome used across the CRM */
export const recField =
  "w-full min-h-[42px] rounded-xl border px-3.5 py-2.5 text-[13px] bg-[#121212] border-[#27272a] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#a3a3a3] focus:ring-0 disabled:opacity-60";

export const recLabel =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500";

export const QUESTION_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "yes_no", label: "Yes / No" },
  { value: "mcq", label: "Multiple choice" },
];

export const INTERVIEW_TYPES = [
  { value: "phone", label: "Phone" },
  { value: "video", label: "Video" },
  { value: "onsite", label: "Onsite" },
];

export const RATING_OPTIONS = [
  { value: "0", label: "—" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export const JOB_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

export const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const WORK_MODES = [
  { value: "onsite", label: "Onsite" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export const DEFAULT_STAGES = [
  "applied",
  "screened",
  "shortlisted",
  "interview",
  "offer",
  "offer_accepted",
  "hired",
  "rejected",
];

export function stageLabel(key) {
  const map = {
    applied: "Applied",
    screened: "Screened",
    shortlisted: "Shortlisted",
    interview: "Interview",
    offer: "Offer",
    offer_accepted: "Offer Accepted",
    hired: "Hired",
    rejected: "Rejected",
  };
  return map[key] || key;
}

export function joiningStatusLabel(status) {
  const map = {
    not_sent: "Not sent",
    sent: "Sent",
    draft: "Draft saved",
    submitted: "Submitted (Pending Review)",
    changes_requested: "Changes Requested",
    approved: "Approved",
    expired: "Expired",
    used: "Used",
  };
  return map[status] || status || "—";
}

export const JOINING_DOC_TYPES = [
  { value: "CNIC_PASSPORT", label: "CNIC / Passport" },
  { value: "CV", label: "CV" },
  { value: "EXPERIENCE_CERTIFICATE", label: "Experience certificate" },
  { value: "EDUCATIONAL_DOCUMENTS", label: "Educational documents" },
  { value: "SALARY_SLIPS", label: "Salary slips" },
  { value: "SKILL_CERTIFICATES", label: "Skill certificates" },
  { value: "OTHER", label: "Other" },
];

export function jobStatusTone(status) {
  const map = {
    draft: "pending",
    published: "approved",
    paused: "pending",
    closed: "rejected",
  };
  return map[status] || "pending";
}

export function formatJobType(v) {
  return JOB_TYPES.find((t) => t.value === v)?.label || v || "—";
}

export function formatWorkMode(v) {
  return WORK_MODES.find((t) => t.value === v)?.label || v || "—";
}

/** Capitalize first letter of each word: "karachi" → "Karachi" */
export function formatLocation(v) {
  const s = String(v || "").trim();
  if (!s) return "Flexible";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export const HR_ROLES = ["ADMIN", "SUBADMIN", "HR_ADMIN"];

export function canManageRecruitment(role) {
  return HR_ROLES.includes(String(role || "").toUpperCase());
}

/** Job portal date: Oct 23, 2026 */
export function formatRecDate(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Job portal datetime: Oct 23, 2026, 12:13 AM */
export function formatRecDateTime(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
}
