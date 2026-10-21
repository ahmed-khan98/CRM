"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { RefreshCw, Users } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetJobApplicationsQuery,
  useMoveApplicationStageMutation,
  useBulkMoveApplicationsMutation,
  useGetRecruitmentSettingsQuery,
  useRecomputeApplicationMatchMutation,
  useRecomputeJobMatchesMutation,
  useLazyGetRematchBatchProgressQuery,
} from "@/app/_Services/recruitment/page";
import {
  stageLabel,
  DEFAULT_STAGES,
  recField,
  formatRecDate,
} from "@/app/_Components/recruitment/recruitmentUi";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import Tooltip from "@/app/_Components/ui/Tooltip";
import MatchPercentCell from "@/app/_Components/recruitment/MatchPercentCell";
import {
  isMatchProcessing,
  jobNeedsRematch,
} from "@/app/_Components/recruitment/matchUi";
import { useDebouncedValue } from "@/app/hooks/useDebouncedValue";

const MATCH_STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Processing" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
  { value: "not_analyzed", label: "Not analyzed" },
];

export default function JobApplicantsPage() {
  const { id: jobId } = useParams();
  const [view, setView] = useState("table");
  const [stage, setStage] = useState("");
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);
  const [matchStatus, setMatchStatus] = useState("");
  const [minScore, setMinScore] = useState("");
  const debouncedMinScore = useDebouncedValue(minScore, 400);
  const [selected, setSelected] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [batchProgress, setBatchProgress] = useState(null);
  const [rematchId, setRematchId] = useState(null);

  const { data: settingsData } = useGetRecruitmentSettingsQuery();
  const defaultMin = settingsData?.data?.defaultMinMatchScore;

  useEffect(() => {
    if (defaultMin != null && defaultMin > 0 && minScore === "") {
      setMinScore(String(defaultMin));
    }
  }, [defaultMin]); // eslint-disable-line react-hooks/exhaustive-deps

  const minScoreNum = Number(debouncedMinScore);
  const params = useMemo(
    () => ({
      jobId,
      stage: stage || undefined,
      q: debouncedQ.trim() || undefined,
      matchStatus: matchStatus || undefined,
      // Only send when > 0 ("0" is truthy as a string and was spamming minScore=0)
      minScore:
        Number.isFinite(minScoreNum) && minScoreNum > 0
          ? minScoreNum
          : undefined,
      limit: 100,
    }),
    [jobId, stage, debouncedQ, matchStatus, minScoreNum]
  );

  const [forcePoll, setForcePoll] = useState(false);
  const { data, isFetching, refetch } = useGetJobApplicationsQuery(params, {
    refetchOnFocus: false,
    // Interval only — avoid also invalidating+manual refetch on rematch
    pollingInterval: forcePoll || batchId ? 5000 : 0,
  });
  const [moveStage] = useMoveApplicationStageMutation();
  const [bulkMove] = useBulkMoveApplicationsMutation();
  const [recomputeOne] = useRecomputeApplicationMatchMutation();
  const [recomputeAll, { isLoading: rematchingAll }] =
    useRecomputeJobMatchesMutation();
  const [fetchProgress] = useLazyGetRematchBatchProgressQuery();

  const items = data?.data?.items || [];
  const hasPendingMatch = items.some((a) => isMatchProcessing(a.matchStatus));
  useEffect(() => {
    // Keep polling while any row is pending/processing; stop when all settled
    setForcePoll(hasPendingMatch || Boolean(batchId));
  }, [hasPendingMatch, batchId]);

  useEffect(() => {
    if (!batchId || !jobId) return undefined;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetchProgress({ jobId, batchId }).unwrap();
        if (cancelled) return;
        const p = res?.data;
        setBatchProgress(p);
        if (p?.status === "done") {
          setBatchId(null);
          refetch();
          toast.success(
            `Re-match finished: ${p.done || 0} done, ${p.failed || 0} failed` +
              (p.notAnalyzed ? `, ${p.notAnalyzed} not analyzed` : "")
          );
        }
      } catch {
        /* ignore transient poll errors */
      }
    };
    tick();
    const t = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [batchId, jobId, fetchProgress, refetch]);

  const stats = data?.data?.stats || {};
  const job = data?.data?.job;
  const stages =
    settingsData?.data?.pipelineStages?.map((s) => s.key) || DEFAULT_STAGES;
  const reasons = settingsData?.data?.rejectionReasons || [];
  const anyProcessing =
    items.some((a) => isMatchProcessing(a.matchStatus)) || Boolean(batchId);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onMove = async (appId, nextStage) => {
    try {
      let rejectionReasonId;
      let note = "";
      if (nextStage === "rejected") {
        const reason = reasons[0]?._id;
        if (!reason && !reasons.length) {
          note = "Rejected";
        } else {
          rejectionReasonId = reason;
          note = reasons[0]?.label || "Rejected";
        }
      }
      await moveStage({
        id: appId,
        stage: nextStage,
        rejectionReasonId,
        note,
      }).unwrap();
      toast.success(`Moved to ${stageLabel(nextStage)}`);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const onBulk = async (nextStage) => {
    if (!selected.length) return;
    try {
      await bulkMove({
        ids: selected,
        stage: nextStage,
        note: nextStage === "rejected" ? "Bulk reject" : "",
        rejectionReasonId: reasons[0]?._id,
      }).unwrap();
      setSelected([]);
      toast.success("Updated");
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const onRematchOne = async (appId) => {
    if (rematchId) return;
    setRematchId(appId);
    try {
      await recomputeOne(appId).unwrap();
      toast.success("Re-match queued");
      setForcePoll(true);
      // Single list refresh — mutation no longer invalidates this query
      await refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Re-match failed");
    } finally {
      setRematchId(null);
    }
  };

  const onRematchAll = async () => {
    if (rematchingAll || batchId) return;
    if (
      !window.confirm(
        "Re-match all applicants for this job? This enqueues every application."
      )
    ) {
      return;
    }
    try {
      const res = await recomputeAll(jobId).unwrap();
      const id = res?.data?.batchId;
      setBatchId(id || null);
      setForcePoll(true);
      setBatchProgress({
        total: res?.data?.total || 0,
        done: 0,
        failed: 0,
        pending: res?.data?.total || 0,
        status: "queued",
      });
      toast.success(res?.message || "Re-match queued");
      await refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Re-match all failed");
    }
  };

  const byStage = useMemo(() => {
    const map = {};
    for (const s of stages.filter((s) => s !== "rejected")) map[s] = [];
    for (const a of items) {
      if (!map[a.stage]) map[a.stage] = [];
      map[a.stage].push(a);
    }
    return map;
  }, [items, stages]);

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader
        icon={Users}
        length={stats.total || items.length}
        name={job?.title ? `${job.title} — Applicants` : "Applicants"}
      >
        <button
          type="button"
          className={fleet.secondaryBtn}
          disabled={rematchingAll || anyProcessing}
          onClick={onRematchAll}
        >
          <RefreshCw
            className={`mr-1 inline h-3.5 w-3.5 ${rematchingAll ? "animate-spin" : ""}`}
          />
          Re-match all
        </button>
        <Link
          href={`/dashboard/recruitment/jobs/${jobId}`}
          className={fleet.secondaryBtn}
        >
          Edit job
        </Link>
      </AttendenceHeader>

      {batchProgress ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          Re-match progress:{" "}
          <strong>
            {(batchProgress.done || 0) +
              (batchProgress.failed || 0) +
              (batchProgress.notAnalyzed || 0)}
            /{batchProgress.total || 0}
          </strong>{" "}
          finished
          {batchProgress.failed
            ? ` · ${batchProgress.failed} failed`
            : ""}
          {batchProgress.pending || batchProgress.processing
            ? ` · ${(batchProgress.pending || 0) + (batchProgress.processing || 0)} in queue`
            : ""}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {["total", ...stages.filter((s) => s !== "rejected"), "rejected"].map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s === "total" ? "" : s)}
              className={`rounded-lg border px-3 py-2 text-center ${
                (s === "total" && !stage) || stage === s
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-800"
              }`}
            >
              <p className="text-lg font-semibold">
                {s === "total" ? stats.total || 0 : stats[s] || 0}
              </p>
              <p className="text-[10px] uppercase opacity-80">
                {s === "total" ? "Total" : stageLabel(s)}
              </p>
            </button>
          )
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className={`${recField} !w-64 max-w-full shrink-0`}
          placeholder="Search name, email, skills…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="w-[160px] shrink-0">
          <CrmSelect
            options={MATCH_STATUS_FILTERS}
            value={matchStatus}
            onChange={(v) => setMatchStatus(v ?? "")}
            placeholder="Match status"
          />
        </div>
        <input
          type="number"
          min={0}
          max={100}
          className={`${recField} !w-24 shrink-0`}
          placeholder="Min %"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          title="Minimum match score"
        />
        <div className="flex rounded-lg border border-zinc-200 p-0.5">
          {["table", "kanban"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                view === v ? "bg-zinc-900 text-white" : "text-zinc-600"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              className={fleet.secondaryBtn}
              onClick={() => onBulk("shortlisted")}
            >
              Shortlist ({selected.length})
            </button>
            <button
              type="button"
              className={fleet.secondaryBtn}
              onClick={() => onBulk("rejected")}
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {view === "table" ? (
        <div className={`${fleet.card} overflow-x-auto`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-3 py-2" />
                <th className="px-3 py-2">Candidate</th>
                <th className="px-3 py-2">Exp</th>
                <th className="px-3 py-2">Match</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Applied</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && !items.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : !items.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                    No applicants yet.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a._id} className="border-b border-zinc-100">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(a._id)}
                        onChange={() => toggle(a._id)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/dashboard/recruitment/candidates/${a.candidateId?._id}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {a.candidateId?.fullName}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        {a.candidateId?.email}
                      </p>
                      {jobNeedsRematch(a, job) ? (
                        <p className="text-[11px] text-amber-700">
                          Job updated, re-match recommended
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      {a.candidateId?.experienceYears ?? 0}y
                    </td>
                    <td className="px-3 py-2">
                      <MatchPercentCell
                        matchPercent={a.matchPercent}
                        matchStatus={a.matchStatus}
                        confidence={a.confidence}
                        matchStatusReason={a.matchStatusReason}
                      />
                    </td>
                    <td className="px-3 py-2">{stageLabel(a.stage)}</td>
                    <td className="px-3 py-2">{a.source}</td>
                    <td className="px-3 py-2 text-xs text-zinc-500">
                      {formatRecDate(a.createdAt)}
                    </td>
                    <td className="px-3 py-2 min-w-[220px]">
                      <div className="flex items-center justify-end gap-1">
                        <div className="min-w-[140px]">
                          <CrmSelect
                            options={stages.map((s) => ({
                              value: s,
                              label: stageLabel(s),
                            }))}
                            value={a.stage}
                            onChange={(v) => v && onMove(a._id, v)}
                            placeholder="Stage"
                          />
                        </div>
                        <Tooltip label="Re-match" side="top">
                          <button
                            type="button"
                            className={fleet.secondaryBtn}
                            disabled={
                              rematchId === a._id ||
                              isMatchProcessing(a.matchStatus)
                            }
                            onClick={() => onRematchOne(a._id)}
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                rematchId === a._id ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {stages
            .filter((s) => s !== "rejected")
            .map((s) => (
              <div
                key={s}
                className="w-64 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const appId = e.dataTransfer.getData("text/appId");
                  if (appId) onMove(appId, s);
                }}
              >
                <p className="mb-2 px-1 text-xs font-semibold uppercase text-zinc-500">
                  {stageLabel(s)} ({(byStage[s] || []).length})
                </p>
                <div className="space-y-2">
                  {(byStage[s] || []).map((a) => (
                    <div
                      key={a._id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/appId", a._id)
                      }
                      className="cursor-grab rounded-lg border border-zinc-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                    >
                      <Link
                        href={`/dashboard/recruitment/candidates/${a.candidateId?._id}`}
                        className="text-sm font-medium text-zinc-900 hover:underline"
                      >
                        {a.candidateId?.fullName}
                      </Link>
                      <p className="mt-1 text-xs text-zinc-500">
                        <MatchPercentCell
                          matchPercent={a.matchPercent}
                          matchStatus={a.matchStatus}
                          confidence={a.confidence}
                          matchStatusReason={a.matchStatusReason}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
