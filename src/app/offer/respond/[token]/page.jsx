"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useGetPublicOfferRespondQuery,
  usePublicRespondOfferMutation,
} from "@/app/_Services/recruitment/page";
import { formatRecDate } from "@/app/_Components/recruitment/recruitmentUi";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";

export default function OfferRespondPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const preset = String(searchParams.get("action") || "").toLowerCase();
  const { data, isFetching, error } = useGetPublicOfferRespondQuery(token, {
    skip: !token,
  });
  const [respond, { isLoading }] = usePublicRespondOfferMutation();
  const [done, setDone] = useState(null);

  const offer = data?.data;
  const errMsg =
    error?.data?.message ||
    (error ? "This offer link is invalid or expired." : null);

  const salaryLabel = useMemo(() => {
    if (!offer || offer.salary == null) return "—";
    return `${offer.salaryCurrency || "PKR"} ${Number(
      offer.salary
    ).toLocaleString()}`;
  }, [offer]);

  const onRespond = async (action) => {
    try {
      const res = await respond({ token, action }).unwrap();
      setDone(res.data);
      toast.success(
        action === "accept" || action === "accepted"
          ? "Offer accepted"
          : "Offer declined"
      );
    } catch (e) {
      toast.error(e?.data?.message || "Could not respond");
    }
  };

  if (isFetching && !offer) {
    return (
      <div className={`${pub.pageCenter} text-sm text-slate-600`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading offer…
      </div>
    );
  }

  if (errMsg && !offer) {
    return (
      <div className={pub.pageCenter}>
        <div className={`${pub.card} max-w-md text-center`}>
          <h1 className="text-lg font-semibold text-slate-900">
            Link unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">{errMsg}</p>
        </div>
      </div>
    );
  }

  if (done || offer?.alreadyFinalized) {
    const status = done?.status || offer?.status;
    const accepted = status === "accepted";
    return (
      <div className={pub.pageCenter}>
        <div className={`${pub.card} max-w-md text-center`}>
          <div
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
              accepted
                ? "bg-teal-100 text-teal-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {accepted ? "✓" : "–"}
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            {accepted ? "Thank you — offer accepted" : "Offer declined"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {accepted
              ? "Check your email for a secure link to complete your joining details. All sections are required."
              : "We have recorded your response."}
          </p>
          {(done?.jobTitle || offer?.jobTitle) && (
            <p className="mt-4 text-sm font-medium text-slate-700">
              {done?.jobTitle || offer?.jobTitle}
              {(done?.candidateName || offer?.candidateName) &&
                ` · ${done?.candidateName || offer?.candidateName}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${pub.page} px-4 py-10`}>
      <div className={`${pub.card} mx-auto max-w-xl sm:!p-8`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
          {offer.companyName || "Job offer"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          {offer.jobTitle || "Offer"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Hi {offer.candidateName || "there"},
        </p>

        <dl className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Salary
            </dt>
            <dd className="mt-0.5 font-semibold text-slate-900">{salaryLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Joining date
            </dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {formatRecDate(offer.joiningDate)}
            </dd>
          </div>
        </dl>

        {offer.bodyHtml ? (
          <div
            className="prose prose-sm prose-slate mt-6 max-w-none border-t border-slate-200 pt-6 text-slate-700"
            dangerouslySetInnerHTML={{ __html: offer.bodyHtml }}
          />
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRespond("accept")}
            className={pub.primaryBtn}
          >
            {isLoading && (preset === "accept" || !preset) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Accept offer
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRespond("decline")}
            className={pub.secondaryBtn}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
