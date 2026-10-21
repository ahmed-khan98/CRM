import { describe, it, expect } from "vitest";
import {
  formatFlagExplanation,
  isMatchProcessing,
  jobNeedsRematch,
  matchReasonLabel,
  matchStatusLabel,
} from "./matchUi.js";

describe("matchUi states", () => {
  it("labels processing / failed / not analyzed", () => {
    expect(matchStatusLabel("pending")).toBe("Processing");
    expect(matchStatusLabel("processing")).toBe("Processing");
    expect(matchStatusLabel("failed")).toBe("Failed");
    expect(matchStatusLabel("not_analyzed")).toBe("Not analyzed");
    expect(isMatchProcessing("pending")).toBe(true);
    expect(isMatchProcessing("done")).toBe(false);
  });

  it("reason tooltips", () => {
    expect(matchReasonLabel("scanned_cv")).toMatch(/Scanned/i);
    expect(matchReasonLabel("unreadable_pdf")).toMatch(/Unreadable/i);
  });

  it("flag explanations and cap-related copy helpers", () => {
    expect(
      formatFlagExplanation("mismatch", { cvYears: 5, formYears: 2 })
    ).toMatch(/CV says 5 years.*form says 2/);
    expect(formatFlagExplanation("suspicious_cv", {})).toMatch(
      /instruction-like/i
    );
  });

  it("stale job rematch hint", () => {
    expect(
      jobNeedsRematch(
        { scoredAt: new Date(), matchStatus: "done", jobVersion: 1 },
        { version: 2 }
      )
    ).toBe(true);
    expect(
      jobNeedsRematch(
        { scoredAt: new Date(), matchStatus: "done", jobVersion: 2 },
        { version: 2 }
      )
    ).toBe(false);
  });
});
