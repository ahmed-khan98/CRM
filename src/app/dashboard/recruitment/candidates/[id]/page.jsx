"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetRecruitmentCandidateQuery,
  useUpdateRecruitmentCandidateMutation,
  useAddCandidateNoteMutation,
  useRecomputeApplicationMatchMutation,
} from "@/app/_Services/recruitment/page";
import MatchCard from "@/app/_Components/recruitment/MatchCard";
import {
  stageLabel,
  recField,
  recLabel,
  RATING_OPTIONS,
  formatRecDate,
  formatRecDateTime,
  joiningStatusLabel,
} from "@/app/_Components/recruitment/recruitmentUi";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import JoiningReviewModal from "@/app/_Components/recruitment/JoiningReviewModal";
import CreateEmployeeFromOffer from "@/app/_Components/recruitment/CreateEmployeeFromOffer";
import Cookies from "js-cookie";
import { isDownloadOnlyFile } from "@/app/_utils/attachmentUrl";

function getCandidateResumeOpenUrl(candidateId, { disposition = "inline", filename } = {}) {
  const token =
    Cookies.get("token") || Cookies.get("accessToken") || null;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const root = base.endsWith("/") ? base : `${base}/`;
  const params = new URLSearchParams({ disposition });
  if (filename) params.set("filename", filename);
  if (token) params.set("token", token);
  return `${root}recruitment/candidates/${candidateId}/resume?${params.toString()}`;
}

export default function CandidateProfilePage() {
  const { id } = useParams();
  const { data, isFetching, refetch } = useGetRecruitmentCandidateQuery(id);
  const [update] = useUpdateRecruitmentCandidateMutation();
  const [addNote, { isLoading: noting }] = useAddCandidateNoteMutation();
  const [recomputeMatch, { isLoading: rematching }] =
    useRecomputeApplicationMatchMutation();
  const [rematchAppId, setRematchAppId] = useState(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [openingResume, setOpeningResume] = useState(false);
  const [reviewJoiningId, setReviewJoiningId] = useState(null);
  const c = data?.data;

  const onRematch = async (appId) => {
    setRematchAppId(appId);
    try {
      await recomputeMatch(appId).unwrap();
      toast.success("Re-match queued");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Re-match failed");
    } finally {
      setRematchAppId(null);
    }
  };

  const hasResume = Boolean(
    c?.hasResume || c?.resumeUrl || c?.resumePublicId || c?.resumePath
  );
  const resumeDisplayName =
    c?.resumeFileName ||
    decodeURIComponent(
      String(c?.resumeUrl || "")
        .split("?")[0]
        .split("/")
        .pop() || ""
    ) ||
    (hasResume ? "resume.pdf" : "");

  const openResume = async () => {
    if (!hasResume || openingResume) return;
    const name = resumeDisplayName || "resume.pdf";
    const downloadOnly = isDownloadOnlyFile(c.resumeUrl || name, name);
    const apiUrl = getCandidateResumeOpenUrl(id, {
      disposition: downloadOnly ? "attachment" : "inline",
      filename: name,
    });
    setOpeningResume(true);
    try {
      const token = Cookies.get("token") || Cookies.get("accessToken");
      const res = await fetch(apiUrl, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "Could not open resume");
      }
      const blob = await res.blob();
      if (blob.type?.includes("text/html") || blob.size < 20) {
        throw new Error("Invalid resume file");
      }
      const href = URL.createObjectURL(blob);
      if (downloadOnly) {
        const a = document.createElement("a");
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 60_000);
        toast.success("Download started");
      } else {
        // Do not pass "noopener" in features — it makes window.open return null
        // even on success, which used to also navigate the current tab.
        const win = window.open(href, "_blank");
        if (win) {
          try {
            win.opener = null;
          } catch {
            /* ignore */
          }
        } else {
          toast.error("Allow popups to open the resume in a new tab");
        }
        setTimeout(() => URL.revokeObjectURL(href), 120_000);
      }
    } catch (err) {
      toast.error(err?.message || "Could not open resume");
    } finally {
      setOpeningResume(false);
    }
  };

  if (isFetching && !c) {
    return <p className="p-6 text-sm text-zinc-500">Loading candidate…</p>;
  }
  if (!c) {
    return <p className="p-6 text-sm text-zinc-500">Candidate not found.</p>;
  }

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={User} length={c.applications?.length || 0} name={c.fullName}>
        {hasResume && (
          <button
            type="button"
            onClick={openResume}
            disabled={openingResume}
            className={fleet.primaryBtn}
          >
            {openingResume ? "Opening…" : "Resume"}
          </button>
        )}
      </AttendenceHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${fleet.card} space-y-2.5 p-4 lg:col-span-1`}>
          <h3 className="mb-1 text-sm font-semibold text-zinc-900">Profile</h3>
          <ProfileRow label="Email" value={c.email} />
          <ProfileRow label="Phone" value={c.phone} />
          <ProfileRow
            label="CV / Resume"
            value={hasResume ? resumeDisplayName : null}
          />
          <ProfileRow label="Location" value={c.currentLocation} />
          <ProfileLink label="LinkedIn" href={c.linkedIn} />
          <div className="flex flex-wrap gap-1 pt-1">
            {(c.skills || []).map((s) => (
              <span
                key={s}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-100"
              >
                {s}
              </span>
            ))}
          </div>
          <div>
            <label className={recLabel}>Rating (1–5)</label>
            <CrmSelect
              options={RATING_OPTIONS}
              value={String(c.rating || 0)}
              onChange={async (v) => {
                try {
                  await update({
                    id,
                    body: { rating: Number(v) },
                  }).unwrap();
                  toast.success("Rating saved");
                } catch (err) {
                  toast.error(err?.data?.message || "Failed");
                }
              }}
              placeholder="Rating"
            />
          </div>
          <div>
            <label className={recLabel}>Tags (comma)</label>
            <div className="flex gap-2">
              <input
                className={recField}
                placeholder={(c.tags || []).join(", ")}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <button
                type="button"
                className={fleet.secondaryBtn}
                onClick={async () => {
                  try {
                    await update({ id, body: { tags } }).unwrap();
                    toast.success("Tags saved");
                    setTags("");
                  } catch (err) {
                    toast.error(err?.data?.message || "Failed");
                  }
                }}
              >
                Save
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(c.tags || []).map((t) => (
                <span
                  key={t}
                  className="rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {c.duplicates?.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
              Possible duplicates:{" "}
              {c.duplicates.map((d) => d.fullName || d.email).join(", ")}
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {(c.joiningDetails || []).length > 0 && (
            <div className={`${fleet.card} p-4`}>
              <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                Joining details
              </h3>
              <ul className="list-none space-y-2 p-0">
                {c.joiningDetails.map((j) => (
                  <li
                    key={j._id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">
                        {j.jobTitle || "Role"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {joiningStatusLabel(j.status)}
                        {j.submittedAt
                          ? ` · ${formatRecDateTime(j.submittedAt)}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        className={fleet.secondaryBtn}
                        onClick={() => setReviewJoiningId(j._id)}
                      >
                        Review
                      </button>
                      {j.offerId ? (
                        <CreateEmployeeFromOffer
                          offerId={j.offerId}
                          joiningStatus={j.status}
                          onHired={() => refetch()}
                        />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={`${fleet.card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900">
              Applications & match
            </h3>
            <ul className="list-none space-y-4 p-0">
              {(c.applications || []).map((a) => (
                <li key={a._id} className="list-none space-y-3">
                  <MatchCard
                    application={a}
                    job={a.jobId}
                    onRematch={onRematch}
                    rematching={rematching && rematchAppId === a._id}
                  />
                  <div className="rounded-lg border border-zinc-200 px-3 py-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <Link
                          href={`/dashboard/recruitment/jobs/${a.jobId?._id}/applicants`}
                          className="font-medium text-zinc-900 hover:underline"
                        >
                          {a.jobId?.title || "Job"}
                        </Link>
                        <p className="text-xs text-zinc-500">
                          {stageLabel(a.stage)}
                          {a.createdAt
                            ? ` · ${formatRecDate(a.createdAt)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    {(a.answers || []).length > 0 ? (
                      <div className="mt-3 space-y-2 border-t border-zinc-200 pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Screening answers
                        </p>
                        {a.answers.map((ans) => (
                          <div
                            key={ans._id}
                            className="rounded-lg bg-zinc-50 px-3 py-2"
                          >
                            <p className="text-xs font-medium text-zinc-500">
                              {ans.questionId?.label || "Question"}
                            </p>
                            <AnswerValue value={ans.value} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-zinc-500">
                        No screening answers for this application.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${fleet.card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900">Internal notes</h3>
            <div className="mb-3 flex gap-2">
              <input
                className={recField}
                placeholder="Add a private note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                type="button"
                disabled={noting || !note.trim()}
                className={fleet.primaryBtn}
                onClick={async () => {
                  try {
                    await addNote({ id, body: { body: note } }).unwrap();
                    setNote("");
                    toast.success("Note added");
                  } catch (e) {
                    toast.error(e?.data?.message || "Failed");
                  }
                }}
              >
                Add
              </button>
            </div>
            <ul className="list-none space-y-2 p-0">
              {(c.notes || []).map((n) => (
                <li
                  key={n._id}
                  className="list-none rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-900"
                >
                  <p>{n.body}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {n.authorId?.fullName} ·{" "}
                    {n.createdAt ? formatRecDateTime(n.createdAt) : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${fleet.card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900">Activity</h3>
            <ul className="list-none space-y-2 p-0 text-sm">
              {(c.history || []).slice(0, 30).map((h) => (
                <li
                  key={h._id}
                  className="list-none border-b border-zinc-200 py-2"
                >
                  <span className="font-medium text-zinc-900">
                    {h.fromStage ? `${stageLabel(h.fromStage)} → ` : ""}
                    {stageLabel(h.toStage)}
                  </span>
                  <span className="text-zinc-500">
                    {" "}
                    · {h.by?.fullName || "System"} ·{" "}
                    {h.at ? formatRecDateTime(h.at) : ""}
                  </span>
                  {h.note && (
                    <p className="text-xs text-zinc-500">{h.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <JoiningReviewModal
        isOpen={Boolean(reviewJoiningId)}
        joiningId={reviewJoiningId || undefined}
        onClose={() => setReviewJoiningId(null)}
      />
    </div>
  );
}

function normalizeUrl(url) {
  const s = String(url || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

function looksLikeUrl(value) {
  const s = String(value || "").trim();
  if (!s) return false;
  return /^https?:\/\//i.test(s) || /^(www\.)?[\w.-]+\.[a-z]{2,}/i.test(s);
}

function AnswerValue({ value }) {
  if (value == null || value === "") {
    return <p className="mt-0.5 text-sm text-zinc-900">—</p>;
  }
  if (typeof value === "object") {
    return (
      <p className="mt-0.5 text-sm text-zinc-900">{JSON.stringify(value)}</p>
    );
  }
  const text = String(value);
  if (looksLikeUrl(text)) {
    const href = normalizeUrl(text);
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-0.5 block break-all text-sm font-medium text-sky-400 hover:underline"
      >
        {text}
      </a>
    );
  }
  return <p className="mt-0.5 text-sm font-medium text-zinc-900">{text}</p>;
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-200 py-1.5 last:border-0">
      <p className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="min-w-0 text-right text-sm font-medium text-zinc-900">
        {value || "—"}
      </p>
    </div>
  );
}

function ProfileLink({ label, href }) {
  const url = normalizeUrl(href);
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-200 py-1.5 last:border-0">
      <p className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 break-all text-right text-sm font-medium text-sky-400 hover:underline"
        >
          {String(href).trim()}
        </a>
      ) : (
        <p className="text-sm font-medium text-zinc-900">—</p>
      )}
    </div>
  );
}
