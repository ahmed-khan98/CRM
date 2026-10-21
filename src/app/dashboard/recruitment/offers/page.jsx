"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetRecruitmentOffersQuery,
  useGetRecruitmentApplicationsQuery,
  useCreateRecruitmentOfferMutation,
  useSendRecruitmentOfferMutation,
  useRespondRecruitmentOfferMutation,
  useResendJoiningLinkMutation,
  useGetOfferTemplatesQuery,
} from "@/app/_Services/recruitment/page";
import {
  recField,
  recLabel,
  stageLabel,
  joiningStatusLabel,
} from "@/app/_Components/recruitment/recruitmentUi";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";
import JoiningReviewModal from "@/app/_Components/recruitment/JoiningReviewModal";
import CreateEmployeeFromOffer from "@/app/_Components/recruitment/CreateEmployeeFromOffer";

const compactBtn =
  "!h-7 !min-h-0 !gap-1 !rounded-lg !px-2 !py-0 !text-xs !font-medium";

function formatJoiningDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OffersPage() {
  const { data, isFetching, refetch } = useGetRecruitmentOffersQuery({
    limit: 50,
  });
  const { data: tplData } = useGetOfferTemplatesQuery();
  const { data: appsData } = useGetRecruitmentApplicationsQuery({ limit: 100 });
  const [create, { isLoading: creating }] = useCreateRecruitmentOfferMutation();
  const [send] = useSendRecruitmentOfferMutation();
  const [respond] = useRespondRecruitmentOfferMutation();
  const [resendJoining] = useResendJoiningLinkMutation();
  const items = data?.data?.items || [];
  const templates = tplData?.data || [];
  const applicationOptions = useMemo(() => {
    return (appsData?.data?.items || []).map((a) => ({
      value: a._id,
      label: `${a.candidateId?.fullName || "Candidate"} · ${
        a.jobId?.title || "Job"
      } · ${stageLabel(a.stage)}`,
    }));
  }, [appsData]);

  const [form, setForm] = useState({
    applicationId: "",
    salary: "",
    joiningDate: "",
    templateId: "",
  });
  const [reviewOfferId, setReviewOfferId] = useState(null);
  /** e.g. "abc123:send" | "abc123:accept" | "abc123:decline" | "abc123:resend" */
  const [busyAction, setBusyAction] = useState(null);
  const isBusy = (offerId, action) => busyAction === `${offerId}:${action}`;
  const rowBusy = (offerId) =>
    Boolean(busyAction && busyAction.startsWith(`${offerId}:`));

  const runOfferAction = async (offerId, action, fn, successMsg) => {
    setBusyAction(`${offerId}:${action}`);
    try {
      await fn();
      toast.success(successMsg);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={Mail} length={items.length} name="Offers" />

      <form
        className={`${fleet.card} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4`}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!form.applicationId) {
            toast.error("Select a candidate / application");
            return;
          }
          try {
            await create({
              applicationId: form.applicationId,
              salary: form.salary ? Number(form.salary) : null,
              joiningDate: form.joiningDate || null,
              templateId: form.templateId || undefined,
            }).unwrap();
            toast.success("Offer draft created");
            setForm({
              applicationId: "",
              salary: "",
              joiningDate: "",
              templateId: "",
            });
          } catch (err) {
            toast.error(err?.data?.message || "Failed");
          }
        }}
      >
        <h3 className="sm:col-span-2 lg:col-span-4 text-sm font-semibold">
          Create offer draft
        </h3>
        <div className="sm:col-span-2 lg:col-span-4">
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
          <label className={recLabel}>Salary</label>
          <input
            type="number"
            className={recField}
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>
        <div>
          <label className={recLabel}>Joining date</label>
          <LeaveDateField
            value={form.joiningDate}
            onChange={(joiningDate) => setForm({ ...form, joiningDate })}
            placeholder="Select joining date"
          />
        </div>
        <div>
          <label className={recLabel}>Template</label>
          <CrmSelect
            options={[
              { value: "", label: "Default template" },
              ...templates.map((t) => ({ value: t._id, label: t.name })),
            ]}
            value={form.templateId}
            onChange={(v) => setForm({ ...form, templateId: v || "" })}
            placeholder="Default template"
            isClearable
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={creating}
            className={`${fleet.primaryBtn} h-9 min-h-0 w-full justify-center px-4 py-0 disabled:opacity-60 sm:w-auto`}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create draft"
            )}
          </button>
        </div>
      </form>

      <div className={`${fleet.card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joining</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && !items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No offers yet.
                </td>
              </tr>
            ) : (
              items.map((o) => (
                <tr key={o._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3">
                    {o.candidateName ||
                      o.applicationId?.candidateId?.fullName ||
                      "—"}
                  </td>
                  <td className="px-4 py-3">
                    {o.jobTitle || o.applicationId?.jobId?.title || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {o.salary != null
                      ? `${o.salaryCurrency} ${o.salary.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {(() => {
                      const dateLabel = formatJoiningDate(o.joiningDate);
                      const statusLabel = o.joiningDetails
                        ? joiningStatusLabel(o.joiningDetails.status)
                        : o.status === "accepted"
                          ? "Not sent"
                          : null;
                      if (!dateLabel && !statusLabel) return "—";
                      return (
                        <div className="space-y-0.5">
                          {dateLabel ? (
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">
                              {dateLabel}
                            </div>
                          ) : null}
                          {statusLabel ? (
                            <div className="text-[11px] text-zinc-500">
                              {statusLabel}
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {(o.status === "draft" || o.status === "sent") && (
                        <button
                          type="button"
                          disabled={rowBusy(o._id)}
                          className={`${fleet.secondaryBtn} ${compactBtn} disabled:opacity-60`}
                          onClick={() =>
                            runOfferAction(
                              o._id,
                              "send",
                              () => send(o._id).unwrap(),
                              "Offer sent (PDF + accept links)"
                            )
                          }
                        >
                          {isBusy(o._id, "send") ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Sending…
                            </>
                          ) : (
                            "Send"
                          )}
                        </button>
                      )}
                      {o.status === "sent" && (
                        <>
                          <button
                            type="button"
                            disabled={rowBusy(o._id)}
                            className={`${fleet.primaryBtn} ${compactBtn} disabled:opacity-60`}
                            onClick={() =>
                              runOfferAction(
                                o._id,
                                "accept",
                                () =>
                                  respond({
                                    id: o._id,
                                    status: "accepted",
                                  }).unwrap(),
                                "Offer accepted — joining link emailed"
                              )
                            }
                          >
                            {isBusy(o._id, "accept") ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Accepting…
                              </>
                            ) : (
                              "Accept"
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={rowBusy(o._id)}
                            className={`${fleet.secondaryBtn} ${compactBtn} disabled:opacity-60`}
                            onClick={() =>
                              runOfferAction(
                                o._id,
                                "decline",
                                () =>
                                  respond({
                                    id: o._id,
                                    status: "declined",
                                  }).unwrap(),
                                "Marked declined"
                              )
                            }
                          >
                            {isBusy(o._id, "decline") ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Declining…
                              </>
                            ) : (
                              "Decline"
                            )}
                          </button>
                        </>
                      )}
                      {o.status === "accepted" && (
                        <>
                          <button
                            type="button"
                            className={`${fleet.secondaryBtn} ${compactBtn}`}
                            onClick={() => setReviewOfferId(o._id)}
                          >
                            Review
                          </button>
                          <button
                            type="button"
                            disabled={rowBusy(o._id)}
                            className={`${fleet.secondaryBtn} ${compactBtn} disabled:opacity-60`}
                            onClick={() =>
                              runOfferAction(
                                o._id,
                                "resend",
                                () => resendJoining(o._id).unwrap(),
                                "Joining link resent"
                              )
                            }
                          >
                            {isBusy(o._id, "resend") ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Resending…
                              </>
                            ) : (
                              "Resend"
                            )}
                          </button>
                          {o.applicationId?.employeeId ? (
                            <a
                              href={`/dashboard/employee/${
                                o.applicationId.employeeId?._id ||
                                o.applicationId.employeeId
                              }`}
                              className={`${fleet.secondaryBtn} ${compactBtn}`}
                            >
                              View Employee
                            </a>
                          ) : (
                            <CreateEmployeeFromOffer
                              offerId={o._id}
                              joiningStatus={o.joiningDetails?.status}
                              className={compactBtn}
                              onHired={() => refetch()}
                            />
                          )}
                        </>
                      )}
                      {o.joiningDetails && o.status !== "accepted" && (
                        <button
                          type="button"
                          className={`${fleet.secondaryBtn} ${compactBtn}`}
                          onClick={() => setReviewOfferId(o._id)}
                        >
                          View joining
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <JoiningReviewModal
        isOpen={Boolean(reviewOfferId)}
        offerId={reviewOfferId || undefined}
        onClose={() => setReviewOfferId(null)}
      />
    </div>
  );
}
