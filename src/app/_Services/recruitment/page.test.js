import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "page.js"), "utf8");

describe("recruitment API service endpoints", () => {
  const required = [
    "getHirePrefill",
    "resendJoiningLink",
    "getJoiningByOffer",
    "approveJoining",
    "requestJoiningChanges",
    "getPublicOfferRespond",
    "publicRespondOffer",
    "getPublicJoining",
    "savePublicJoiningDraft",
    "submitPublicJoining",
    "uploadPublicJoiningFile",
    "useLazyGetHirePrefillQuery",
    "useResendJoiningLinkMutation",
    "useApproveJoiningMutation",
    "useRequestJoiningChangesMutation",
  ];

  for (const name of required) {
    it(`defines ${name}`, () => {
      expect(src).toContain(name);
    });
  }

  it("hire-prefill hits recruitment offers path", () => {
    expect(src).toMatch(
      /recruitment\/offers\/\$\{offerId\}\/hire-prefill/
    );
  });

  it("public joining uses public/careers base", () => {
    expect(src).toContain("/public/careers");
    expect(src).toMatch(/joining\/\$\{token\}/);
  });
});
