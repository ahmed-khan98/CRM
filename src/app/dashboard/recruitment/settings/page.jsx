"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetRecruitmentSettingsQuery,
  useUpdateRecruitmentSettingsMutation,
  useGetRecruitmentEmailTemplatesQuery,
  useUpdateRecruitmentEmailTemplateMutation,
  useGetOfferTemplatesQuery,
  useSaveOfferTemplateMutation,
} from "@/app/_Services/recruitment/page";
import { recField, recLabel } from "@/app/_Components/recruitment/recruitmentUi";

const DEFAULT_TIERS = {
  b1: "10",
  b2: "25",
  b3: "50",
  c1: "85",
  c2: "75",
  c3: "60",
};

/** Mirror backend validateMustHaveCapTiers — returns error string or "". */
function validateTiersClient(t) {
  const b1 = Number(t.b1);
  const b2 = Number(t.b2);
  const b3 = Number(t.b3);
  const c1 = Number(t.c1);
  const c2 = Number(t.c2);
  const c3 = Number(t.c3);
  for (const [k, n] of [
    ["b1", b1],
    ["b2", b2],
    ["b3", b3],
    ["c1", c1],
    ["c2", c2],
    ["c3", c3],
  ]) {
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      return `${k} must be between 0 and 100`;
    }
  }
  if (!(b1 > 0 && b1 < b2 && b2 < b3 && b3 <= 100)) {
    return "Share boundaries must be increasing: 0 < b1 < b2 < b3 ≤ 100 (e.g. 10, 25, 50)";
  }
  if (!(c1 > c2 && c2 > c3)) {
    return "Cap values must be decreasing: c1 > c2 > c3 (e.g. 85, 75, 60)";
  }
  return "";
}

export default function RecruitmentSettingsPage() {
  const { data } = useGetRecruitmentSettingsQuery();
  const { data: emailData } = useGetRecruitmentEmailTemplatesQuery();
  const { data: offerTplData } = useGetOfferTemplatesQuery();
  const [saveSettings, { isLoading }] = useUpdateRecruitmentSettingsMutation();
  const [saveEmail] = useUpdateRecruitmentEmailTemplateMutation();
  const [saveOfferTpl] = useSaveOfferTemplateMutation();

  const [form, setForm] = useState({
    companyName: "",
    careersHeadline: "",
    careersSubheadline: "",
    careersLogoUrl: "",
    careersBannerUrl: "",
    careersPublicBaseUrl: "",
    joiningLinkExpiryDays: "7",
  });
  const [aiForm, setAiForm] = useState({
    aiMatchingEnabled: true,
    defaultMinMatchScore: "0",
    mustHaveSkills: "40",
    experience: "25",
    roleRelevance: "15",
    education: "10",
    niceToHaveSkills: "10",
    ...DEFAULT_TIERS,
  });
  const [tierError, setTierError] = useState("");

  useEffect(() => {
    const s = data?.data;
    if (!s) return;
    setForm({
      companyName: s.companyName || "",
      careersHeadline: s.careersHeadline || "",
      careersSubheadline: s.careersSubheadline || "",
      careersLogoUrl: s.careersLogoUrl || "",
      careersBannerUrl: s.careersBannerUrl || "",
      careersPublicBaseUrl: s.careersPublicBaseUrl || "",
      joiningLinkExpiryDays: String(s.joiningLinkExpiryDays ?? 7),
    });
    const w = s.matchWeights || {};
    const t = s.mustHaveCapTiers || {};
    const legacyCap = s.mustHaveCap ?? 60;
    setAiForm({
      aiMatchingEnabled: s.aiMatchingEnabled !== false,
      defaultMinMatchScore: String(s.defaultMinMatchScore ?? 0),
      mustHaveSkills: String(w.mustHaveSkills ?? 40),
      experience: String(w.experience ?? 25),
      roleRelevance: String(w.roleRelevance ?? 15),
      education: String(w.education ?? 10),
      niceToHaveSkills: String(w.niceToHaveSkills ?? 10),
      b1: String(t.b1 ?? 10),
      b2: String(t.b2 ?? 25),
      b3: String(t.b3 ?? 50),
      c1: String(t.c1 ?? 85),
      c2: String(t.c2 ?? 75),
      c3: String(t.c3 ?? legacyCap),
    });
    setTierError("");
  }, [data]);

  const weightTotal =
    Number(aiForm.mustHaveSkills || 0) +
    Number(aiForm.experience || 0) +
    Number(aiForm.roleRelevance || 0) +
    Number(aiForm.education || 0) +
    Number(aiForm.niceToHaveSkills || 0);

  const envAiOn = Boolean(data?.data?.aiEnvEnabled);

  const setTierField = (key, value) => {
    const next = { ...aiForm, [key]: value };
    setAiForm(next);
    setTierError(
      validateTiersClient({
        b1: next.b1,
        b2: next.b2,
        b3: next.b3,
        c1: next.c1,
        c2: next.c2,
        c3: next.c3,
      })
    );
  };

  const emails = emailData?.data || [];
  const offerTpls = offerTplData?.data || [];

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={Settings} length={0} name="Recruitment settings" />

      <form
        className={`${fleet.card} space-y-3 p-4`}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await saveSettings({
              ...form,
              joiningLinkExpiryDays: Number(form.joiningLinkExpiryDays) || 7,
            }).unwrap();
            toast.success("Settings saved");
          } catch (err) {
            toast.error(err?.data?.message || "Failed");
          }
        }}
      >
        <h3 className="text-sm font-semibold">Careers branding</h3>
        {[
          ["companyName", "Company name"],
          ["careersHeadline", "Headline"],
          ["careersSubheadline", "Subheadline"],
          ["careersLogoUrl", "Logo URL"],
          ["careersBannerUrl", "Banner URL"],
          [
            "careersPublicBaseUrl",
            "Public app base URL (offer/joining links)",
          ],
        ].map(([key, label]) => (
          <div key={key}>
            <label className={recLabel}>{label}</label>
            <input
              className={recField}
              value={form[key]}
              placeholder={
                key === "careersPublicBaseUrl"
                  ? "https://crm.example.com"
                  : undefined
              }
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className={recLabel}>Joining link expiry (days)</label>
          <input
            type="number"
            min={1}
            max={90}
            className={recField}
            value={form.joiningLinkExpiryDays}
            onChange={(e) =>
              setForm({ ...form, joiningLinkExpiryDays: e.target.value })
            }
          />
        </div>
        <button type="submit" disabled={isLoading} className={fleet.primaryBtn}>
          Save branding
        </button>
        <p className="text-xs text-zinc-500">
          Pipeline includes Offer Accepted. Set public base URL so accept and
          joining emails point at this CRM. Careers:{" "}
          <a className="underline" href="/careers">
            /careers
          </a>
        </p>
      </form>

      <form
        className={`${fleet.card} space-y-4 p-4`}
        onSubmit={async (e) => {
          e.preventDefault();
          if (weightTotal !== 100) {
            toast.error(`Weights must total 100 (currently ${weightTotal})`);
            return;
          }
          const err = validateTiersClient(aiForm);
          if (err) {
            setTierError(err);
            toast.error(err);
            return;
          }
          try {
            await saveSettings({
              aiMatchingEnabled: aiForm.aiMatchingEnabled,
              mustHaveCapTiers: {
                b1: Number(aiForm.b1),
                b2: Number(aiForm.b2),
                b3: Number(aiForm.b3),
                c1: Number(aiForm.c1),
                c2: Number(aiForm.c2),
                c3: Number(aiForm.c3),
              },
              defaultMinMatchScore: Number(aiForm.defaultMinMatchScore) || 0,
              matchWeights: {
                mustHaveSkills: Number(aiForm.mustHaveSkills),
                experience: Number(aiForm.experience),
                roleRelevance: Number(aiForm.roleRelevance),
                education: Number(aiForm.education),
                niceToHaveSkills: Number(aiForm.niceToHaveSkills),
              },
            }).unwrap();
            toast.success("AI matching settings saved");
          } catch (err) {
            toast.error(err?.data?.message || "Failed");
          }
        }}
      >
        <h3 className="text-sm font-semibold">AI Matching</h3>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={aiForm.aiMatchingEnabled}
            disabled={!envAiOn}
            onChange={(e) =>
              setAiForm({ ...aiForm, aiMatchingEnabled: e.target.checked })
            }
          />
          Enable AI matching path
        </label>
        {!envAiOn ? (
          <p className="text-xs text-amber-700">
            Server env <code>AI_ENABLED</code> is off — matching stays
            rule-based. This switch is disabled until AI is enabled in .env.
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["mustHaveSkills", "Must-have skills %"],
            ["experience", "Experience %"],
            ["roleRelevance", "Role relevance %"],
            ["education", "Education %"],
            ["niceToHaveSkills", "Nice-to-have %"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className={recLabel}>{label}</label>
              <input
                type="number"
                min={0}
                max={100}
                className={recField}
                value={aiForm[key]}
                onChange={(e) =>
                  setAiForm({ ...aiForm, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <p
          className={`text-xs ${weightTotal === 100 ? "text-zinc-500" : "text-red-600"}`}
        >
          Weights total: {weightTotal} / 100
          {weightTotal !== 100 ? " — must equal 100 to save" : ""}
        </p>

        <div className="space-y-3 rounded-lg border border-zinc-200 p-3">
          <h4 className="text-sm font-semibold text-zinc-800">
            Missing must-have skills
          </h4>
          <ul className="space-y-1 text-xs text-zinc-600">
            <li>
              Missing share below {aiForm.b1 || "10"}%: no cap
            </li>
            <li>
              {aiForm.b1 || "10"}% to {aiForm.b2 || "25"}% missing: cap at{" "}
              {aiForm.c1 || "85"}%
            </li>
            <li>
              {aiForm.b2 || "25"}% to {aiForm.b3 || "50"}% missing: cap at{" "}
              {aiForm.c2 || "75"}%
            </li>
            <li>
              {aiForm.b3 || "50"}% or more missing: cap at {aiForm.c3 || "60"}%
            </li>
          </ul>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["b1", "Share boundary 1 (%)"],
              ["b2", "Share boundary 2 (%)"],
              ["b3", "Share boundary 3 (%)"],
              ["c1", "Cap 1 (%)"],
              ["c2", "Cap 2 (%)"],
              ["c3", "Cap 3 (%)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className={recLabel}>{label}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={recField}
                  value={aiForm[key]}
                  onChange={(e) => setTierField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          {tierError ? (
            <p className="text-xs text-red-600">{tierError}</p>
          ) : null}
          <p className="text-xs text-zinc-500">
            Related skills count as partly missing. Example: with 10 must-have
            skills, 2 fully missing = 20% missing.
          </p>
        </div>

        <div>
          <label className={recLabel}>
            Default min score filter (applicants)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            className={recField}
            value={aiForm.defaultMinMatchScore}
            onChange={(e) =>
              setAiForm({ ...aiForm, defaultMinMatchScore: e.target.value })
            }
          />
        </div>

        <p className="text-xs text-zinc-500">
          Changing weights or caps does not re-score existing applications. Use
          &quot;Re-match all&quot; on a job&apos;s applicants page.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isLoading || weightTotal !== 100 || Boolean(tierError)}
            className={fleet.primaryBtn}
          >
            Save AI matching
          </button>
          <button
            type="button"
            className={fleet.secondaryBtn}
            onClick={async () => {
              try {
                await saveSettings({ resetMatchWeights: true }).unwrap();
                toast.success("Reset to defaults");
              } catch (err) {
                toast.error(err?.data?.message || "Failed");
              }
            }}
          >
            Reset to defaults
          </button>
        </div>
      </form>

      <div className={`${fleet.card} space-y-4 p-4`}>
        <h3 className="text-sm font-semibold">Email templates</h3>
        {emails.map((tpl) => (
          <EmailTplEditor key={tpl.key} tpl={tpl} onSave={saveEmail} />
        ))}
      </div>

      <div className={`${fleet.card} space-y-3 p-4`}>
        <h3 className="text-sm font-semibold">Offer templates</h3>
        {offerTpls.map((tpl) => (
          <div key={tpl._id} className="rounded-lg border border-zinc-200 p-3">
            <p className="text-sm font-medium">{tpl.name}</p>
            <p className="text-xs text-zinc-500">{tpl.subject}</p>
          </div>
        ))}
        <button
          type="button"
          className={fleet.secondaryBtn}
          onClick={async () => {
            const name = prompt("Template name", "Custom offer");
            if (!name) return;
            try {
              await saveOfferTpl({
                name,
                subject: "Job Offer — {{job_title}}",
                bodyHtml:
                  "<p>Dear {{candidate_name}},</p><p>Offer for {{job_title}} at {{company_name}}. Salary {{salary}}, joining {{joining_date}}.</p>",
              }).unwrap();
              toast.success("Template added");
            } catch (e) {
              toast.error(e?.data?.message || "Failed");
            }
          }}
        >
          Add offer template
        </button>
      </div>
    </div>
  );
}

function EmailTplEditor({ tpl, onSave }) {
  const [subject, setSubject] = useState(tpl.subject);
  const [bodyHtml, setBodyHtml] = useState(tpl.bodyHtml);
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-3">
      <p className="text-sm font-medium capitalize">{tpl.name}</p>
      <input
        className={recField}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        rows={4}
        className={`${recField} resize-none`}
        value={bodyHtml}
        onChange={(e) => setBodyHtml(e.target.value)}
      />
      <button
        type="button"
        className={fleet.secondaryBtn}
        onClick={async () => {
          try {
            await onSave({ key: tpl.key, body: { subject, bodyHtml } }).unwrap();
            toast.success("Template saved");
          } catch (e) {
            toast.error(e?.data?.message || "Failed");
          }
        }}
      >
        Save {tpl.key}
      </button>
    </div>
  );
}
