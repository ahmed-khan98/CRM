"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarDays, Loader2 } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetRecruitmentInterviewsQuery,
  useGetRecruitmentApplicationsQuery,
  useCreateRecruitmentInterviewMutation,
  useCancelRecruitmentInterviewMutation,
  useSubmitInterviewFeedbackMutation,
} from "@/app/_Services/recruitment/page";
import {
  canManageRecruitment,
  INTERVIEW_TYPES,
  stageLabel,
  recField,
  recLabel,
  formatRecDateTime,
} from "@/app/_Components/recruitment/recruitmentUi";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import ModalShell from "@/app/_Components/Modal/ModalShell";
import Cookies from "js-cookie";

const RECOMMENDATION_OPTIONS = [
  { value: "hire", label: "Hire" },
  { value: "hold", label: "Hold" },
  { value: "no_hire", label: "No hire" },
];

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n}`,
}));

export default function InterviewsPage() {
  const user = Cookies.get("currentuser")
    ? JSON.parse(Cookies.get("currentuser"))
    : null;
  const isHr = canManageRecruitment(user?.role);
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: "4",
    comments: "",
    recommendation: "hold",
  });
  const params = useMemo(
    () => ({ upcoming: upcomingOnly ? "true" : undefined, limit: 50 }),
    [upcomingOnly]
  );
  const { data, isFetching } = useGetRecruitmentInterviewsQuery(params);
  const { data: appsData } = useGetRecruitmentApplicationsQuery(
    { limit: 100 },
    { skip: !isHr }
  );
  const [create, { isLoading: creating }] = useCreateRecruitmentInterviewMutation();
  const [cancel, { isLoading: cancelling }] = useCancelRecruitmentInterviewMutation();
  const [submitFeedback, { isLoading: savingFeedback }] =
    useSubmitInterviewFeedbackMutation();
  const items = data?.data?.items || [];
  const applicationOptions = useMemo(() => {
    return (appsData?.data?.items || []).map((a) => ({
      value: a._id,
      label: `${a.candidateId?.fullName || "Candidate"} · ${
        a.jobId?.title || "Job"
      } · ${stageLabel(a.stage)}`,
    }));
  }, [appsData]);

  const handleCancelInterview = async () => {
    if (!confirmCancel?._id) return;
    try {
      await cancel(confirmCancel._id).unwrap();
      toast.success("Interview cancelled");
      setConfirmCancel(null);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const openFeedback = (iv) => {
    const mine =
      (iv.feedback || []).find(
        (f) => String(f.by?._id || f.by) === String(user?._id)
      ) || iv.feedback?.[0];
    setFeedbackForm({
      rating: String(mine?.rating || 4),
      comments: mine?.comments || "",
      recommendation: mine?.recommendation || "hold",
    });
    setFeedbackTarget(iv);
  };

  const saveFeedback = async () => {
    if (!feedbackTarget?._id) return;
    try {
      await submitFeedback({
        id: feedbackTarget._id,
        body: {
          rating: Number(feedbackForm.rating) || 0,
          comments: feedbackForm.comments,
          recommendation: feedbackForm.recommendation,
        },
      }).unwrap();
      toast.success("Feedback saved");
      setFeedbackTarget(null);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const [form, setForm] = useState({
    applicationId: "",
    date: "",
    time: "10:00",
    type: "video",
    round: "Round 1",
    meetingLink: "",
    durationMin: 60,
  });

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader
        icon={CalendarDays}
        length={items.length}
        name={isHr ? "Interviews" : "My interviews"}
      >
        <button
          type="button"
          className={fleet.secondaryBtn}
          onClick={() => setUpcomingOnly((v) => !v)}
        >
          {upcomingOnly ? "Show all" : "Upcoming only"}
        </button>
      </AttendenceHeader>

      {isHr && (
        <form
          className={`${fleet.card} grid gap-3 p-4 sm:grid-cols-3`}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.applicationId) {
              toast.error("Select a candidate / application");
              return;
            }
            if (!form.date) {
              toast.error("Select a date");
              return;
            }
            const startsAt = `${form.date}T${form.time || "10:00"}`;
            try {
              await create({
                applicationId: form.applicationId,
                type: form.type,
                round: form.round,
                meetingLink: form.meetingLink,
                startsAt,
                durationMin: Number(form.durationMin) || 60,
                interviewerIds: user?._id ? [user._id] : [],
              }).unwrap();
              toast.success("Interview scheduled");
              setForm((f) => ({ ...f, applicationId: "", date: "" }));
            } catch (err) {
              toast.error(err?.data?.message || "Failed");
            }
          }}
        >
          <h3 className="sm:col-span-3 text-sm font-semibold text-zinc-900">
            Schedule interview
          </h3>
          <div className="sm:col-span-3">
            <label className={recLabel}>Candidate / application</label>
            <CrmSelect
              options={applicationOptions}
              value={form.applicationId}
              onChange={(v) => setForm({ ...form, applicationId: v || "" })}
              placeholder="Select candidate (name · job · stage)"
              isClearable
            />
          </div>
          <div>
            <label className={recLabel}>Date</label>
            <LeaveDateField
              value={form.date}
              onChange={(date) => setForm({ ...form, date })}
              placeholder="Select date"
            />
          </div>
          <div>
            <label className={recLabel}>Time</label>
            <input
              type="time"
              className={recField}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={recLabel}>Type</label>
            <CrmSelect
              options={INTERVIEW_TYPES}
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v || "video" })}
              placeholder="Type"
            />
          </div>
          <div>
            <label className={recLabel}>Round</label>
            <input
              className={recField}
              placeholder="Round"
              value={form.round}
              onChange={(e) => setForm({ ...form, round: e.target.value })}
            />
          </div>
          <div>
            <label className={recLabel}>Meeting link / location</label>
            <input
              className={recField}
              placeholder="Meeting link / location"
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className={`${fleet.primaryBtn} h-9 min-h-0 px-4 py-0 disabled:opacity-60`}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling…
                </>
              ) : (
                "Schedule"
              )}
            </button>
          </div>
        </form>
      )}

      <div className={`${fleet.card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Feedback</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && !items.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  No interviews found.
                </td>
              </tr>
            ) : (
              items.map((iv) => {
                const fb = iv.feedback?.[0];
                return (
                  <tr key={iv._id} className="border-b border-zinc-200">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/recruitment/candidates/${iv.applicationId?.candidateId?._id}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {iv.applicationId?.candidateId?.fullName || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-900">
                      {iv.applicationId?.jobId?.title || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-900">
                      {formatRecDateTime(iv.startsAt)}
                      <p className="text-zinc-500">{iv.round}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-zinc-900">
                      {iv.type}
                    </td>
                    <td className="px-4 py-3 capitalize text-zinc-900">
                      {iv.status}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-900">
                      {fb ? (
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={() => openFeedback(iv)}
                        >
                          <span className="font-medium">
                            {fb.rating}/5 ·{" "}
                            {String(fb.recommendation || "").replace("_", " ")}
                          </span>
                          {fb.comments ? (
                            <p className="mt-0.5 line-clamp-2 text-zinc-500">
                              {fb.comments}
                            </p>
                          ) : null}
                          {fb.by?.fullName ? (
                            <p className="text-[11px] text-zinc-500">
                              by {fb.by.fullName}
                            </p>
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className={`${fleet.secondaryBtn} h-8 min-h-0 px-2.5 py-0 text-xs`}
                          onClick={() => openFeedback(iv)}
                        >
                          {fb ? "Edit feedback" : "Feedback"}
                        </button>
                        {isHr && iv.status === "scheduled" && (
                          <button
                            type="button"
                            className={`${fleet.secondaryBtn} h-8 min-h-0 px-2.5 py-0 text-xs`}
                            onClick={() => setConfirmCancel(iv)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirmCancel && (
        <WarningModal
          setConfirmDelete={setConfirmCancel}
          isDeleting={cancelling}
          handleDelete={handleCancelInterview}
          title="Cancel interview"
          description={`Cancel the interview with ${
            confirmCancel.applicationId?.candidateId?.fullName ||
            "this candidate"
          }?`}
          confirmLabel="Yes, Cancel"
          message="interview"
        />
      )}

      <ModalShell
        isOpen={Boolean(feedbackTarget)}
        onClose={() => !savingFeedback && setFeedbackTarget(null)}
        title="Interview feedback"
        maxWidthClass="max-w-lg"
        footer={
          <>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              disabled={savingFeedback}
              onClick={() => setFeedbackTarget(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={fleet.modalPrimaryBtn}
              disabled={Boolean(savingFeedback)}
              onClick={() => {
                if (!savingFeedback) saveFeedback();
              }}
            >
              {savingFeedback ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save feedback"
              )}
            </button>
          </>
        }
      >
        {feedbackTarget && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              {feedbackTarget.applicationId?.candidateId?.fullName ||
                "Candidate"}{" "}
              · {feedbackTarget.applicationId?.jobId?.title || "Job"} ·{" "}
              {feedbackTarget.round}
            </p>
            <div>
              <label className={fleet.modalLabel}>Rating (1–5)</label>
              <CrmSelect
                options={RATING_OPTIONS}
                value={feedbackForm.rating}
                onChange={(v) =>
                  setFeedbackForm((f) => ({ ...f, rating: v || "4" }))
                }
                placeholder="Rating"
              />
            </div>
            <div>
              <label className={fleet.modalLabel}>Recommendation</label>
              <CrmSelect
                options={RECOMMENDATION_OPTIONS}
                value={feedbackForm.recommendation}
                onChange={(v) =>
                  setFeedbackForm((f) => ({
                    ...f,
                    recommendation: v || "hold",
                  }))
                }
                placeholder="Recommendation"
              />
            </div>
            <div>
              <label className={fleet.modalLabel}>Comments</label>
              <textarea
                rows={4}
                className={fleet.modalTextarea}
                placeholder="Strengths, concerns, notes…"
                value={feedbackForm.comments}
                onChange={(e) =>
                  setFeedbackForm((f) => ({ ...f, comments: e.target.value }))
                }
              />
            </div>
            {(feedbackTarget.feedback || []).length > 1 && (
              <div className="space-y-2 border-t border-white/[0.06] pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  All feedback
                </p>
                {feedbackTarget.feedback.map((f) => (
                  <div
                    key={f._id}
                    className="rounded-xl border border-white/[0.06] bg-[#121212] px-3 py-2 text-sm text-zinc-200"
                  >
                    <p className="font-medium">
                      {f.rating}/5 ·{" "}
                      {String(f.recommendation || "").replace("_", " ")}
                      {f.by?.fullName ? (
                        <span className="font-normal text-zinc-500">
                          {" "}
                          · {f.by.fullName}
                        </span>
                      ) : null}
                    </p>
                    {f.comments ? (
                      <p className="mt-1 text-zinc-400">{f.comments}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalShell>
    </div>
  );
}
