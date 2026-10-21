"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLazyGetPublicApplicationStatusQuery } from "@/app/_Services/recruitment/page";
import {
  stageLabel,
  formatRecDateTime,
} from "@/app/_Components/recruitment/recruitmentUi";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function StatusForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [trigger, { data, isFetching }] =
    useLazyGetPublicApplicationStatusQuery();
  const payload = data?.data;
  const items = payload?.items || [];

  return (
    <div className={pub.shellNarrow}>
      <Link href="/careers" className={pub.link}>
        ← Careers
      </Link>
      <div className={`${pub.card} mt-4`}>
        <h1 className="text-2xl font-semibold text-slate-900">
          Application status
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter the email you used when applying — we&apos;ll show every
          application under that email.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await trigger({ email: email.trim() }).unwrap();
            } catch (err) {
              toast.error(err?.data?.message || "Not found");
            }
          }}
        >
          <div>
            <label className={pub.label}>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={pub.field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isFetching}
            className={`${pub.primaryBtn} w-full`}
          >
            {isFetching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking…
              </>
            ) : (
              "Check status"
            )}
          </button>
        </form>

        {payload && (
          <div className="mt-6 space-y-3">
            {payload.candidateName ? (
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
                <span>{payload.candidateName}</span>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                />
                <span className="font-normal text-slate-500">
                  {payload.email}
                </span>
              </p>
            ) : null}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.applicationId}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-teal-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {item.jobTitle}
                    </p>
                    <p className="mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-900">
                        {stageLabel(item.stage)}
                      </span>
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                      Applied {formatRecDateTime(item.appliedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationStatusPage() {
  return (
    <div className={pub.page}>
      <Suspense
        fallback={<p className="p-8 text-sm text-slate-600">Loading…</p>}
      >
        <StatusForm />
      </Suspense>
    </div>
  );
}
