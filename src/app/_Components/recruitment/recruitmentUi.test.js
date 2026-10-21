import { describe, it, expect } from "vitest";
import {
  stageLabel,
  joiningStatusLabel,
  formatRecDate,
  formatRecDateTime,
  formatJobType,
  formatWorkMode,
  jobStatusTone,
  canManageRecruitment,
  DEFAULT_STAGES,
  JOINING_DOC_TYPES,
} from "./recruitmentUi";

describe("recruitmentUi helpers", () => {
  it("includes offer_accepted in DEFAULT_STAGES between offer and hired", () => {
    const offerIdx = DEFAULT_STAGES.indexOf("offer");
    const acceptedIdx = DEFAULT_STAGES.indexOf("offer_accepted");
    const hiredIdx = DEFAULT_STAGES.indexOf("hired");
    expect(acceptedIdx).toBeGreaterThan(offerIdx);
    expect(hiredIdx).toBeGreaterThan(acceptedIdx);
  });

  it("stageLabel maps known stages including Offer Accepted", () => {
    expect(stageLabel("offer_accepted")).toBe("Offer Accepted");
    expect(stageLabel("hired")).toBe("Hired");
    expect(stageLabel("unknown_stage")).toBe("unknown_stage");
  });

  it("joiningStatusLabel covers hire handoff statuses", () => {
    expect(joiningStatusLabel("not_sent")).toBe("Not sent");
    expect(joiningStatusLabel("submitted")).toBe(
      "Submitted (Pending Review)"
    );
    expect(joiningStatusLabel("changes_requested")).toBe("Changes Requested");
    expect(joiningStatusLabel("approved")).toBe("Approved");
    expect(joiningStatusLabel("used")).toBe("Used");
    expect(joiningStatusLabel(null)).toBe("—");
  });

  it("formatRecDate returns portal-style date", () => {
    expect(formatRecDate("2026-10-23")).toMatch(/Oct 23,? 2026/);
    expect(formatRecDate(null)).toBe("—");
    expect(formatRecDate("not-a-date")).toBe("—");
  });

  it("formatRecDateTime includes time", () => {
    const out = formatRecDateTime("2026-10-23T12:13:00");
    expect(out).toMatch(/Oct 23,? 2026/);
    expect(out).toMatch(/\d{1,2}:\d{2}/);
  });

  it("formats job type and work mode", () => {
    expect(formatJobType("full_time")).toBe("Full-time");
    expect(formatWorkMode("hybrid")).toBe("Hybrid");
    expect(formatJobType("")).toBe("—");
  });

  it("jobStatusTone maps to badge tones", () => {
    expect(jobStatusTone("published")).toBe("approved");
    expect(jobStatusTone("closed")).toBe("rejected");
    expect(jobStatusTone("draft")).toBe("pending");
  });

  it("canManageRecruitment allows HR roles only", () => {
    expect(canManageRecruitment("HR_ADMIN")).toBe(true);
    expect(canManageRecruitment("ADMIN")).toBe(true);
    expect(canManageRecruitment("USER")).toBe(false);
  });

  it("JOINING_DOC_TYPES includes CNIC and CV", () => {
    const values = JOINING_DOC_TYPES.map((t) => t.value);
    expect(values).toContain("CNIC_PASSPORT");
    expect(values).toContain("CV");
  });
});
