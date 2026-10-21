import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../.."
);

describe("hire handoff frontend routes exist", () => {
  it("has /offer/respond/[token] page", () => {
    const p = path.join(root, "src/app/offer/respond/[token]/page.jsx");
    expect(fs.existsSync(p)).toBe(true);
    const src = fs.readFileSync(p, "utf8");
    expect(src).toContain("usePublicRespondOfferMutation");
    expect(src).toMatch(/Accept offer/i);
  });

  it("has /joining/[token] page with draft + submit", () => {
    const p = path.join(root, "src/app/joining/[token]/page.jsx");
    expect(fs.existsSync(p)).toBe(true);
    const src = fs.readFileSync(p, "utf8");
    expect(src).toContain("useSavePublicJoiningDraftMutation");
    expect(src).toContain("useSubmitPublicJoiningMutation");
    expect(src).toMatch(/Save draft/i);
  });

  it("has JoiningReviewModal with approve + request changes", () => {
    const p = path.join(
      root,
      "src/app/_Components/recruitment/JoiningReviewModal.jsx"
    );
    expect(fs.existsSync(p)).toBe(true);
    const src = fs.readFileSync(p, "utf8");
    expect(src).toContain("useApproveJoiningMutation");
    expect(src).toContain("useRequestJoiningChangesMutation");
  });
});
