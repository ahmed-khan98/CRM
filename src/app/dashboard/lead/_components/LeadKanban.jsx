"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/app/utilities/date";
import { getActionStatusColor } from "@/app/utilities/color";

const PIPELINE_COLUMNS = [
  { key: "no action", label: "No action" },
  { key: "no answer", label: "No answer" },
  { key: "interested", label: "Interested" },
  { key: "non interested", label: "Not interested" },
  { key: "in loop", label: "In loop" },
  { key: "schedule", label: "Scheduled" },
  { key: "invalid", label: "Invalid" },
  { key: "general", label: "General" },
];

function normalizeAction(action) {
  if (action === "not interested") return "non interested";
  return action || "no action";
}

function LeadKanban({ items = [], onEdit, setConfirmDelete }) {
  const router = useRouter();

  const grouped = PIPELINE_COLUMNS.reduce((acc, col) => {
    acc[col.key] = [];
    return acc;
  }, {});

  items.forEach((lead) => {
    const key = normalizeAction(lead?.lastAction);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(lead);
  });

  return (
    <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-4">
      {PIPELINE_COLUMNS.map((col) => (
        <div
          key={col.key}
          className="min-w-[240px] rounded-3xl border border-slate-200 bg-slate-50/80 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
              {col.label}
            </h3>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm">
              {grouped[col.key]?.length || 0}
            </span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
            {(grouped[col.key] || []).map((lead) => (
              <div
                key={lead._id}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/lead/detail/${lead._id}`)}
                  className="w-full text-left"
                >
                  <p className="text-sm font-semibold capitalize text-slate-900">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{lead.email || lead.phoneNo}</p>
                  {lead.lastComment && (
                    <p className="mt-2 line-clamp-2 text-[11px] text-slate-600">
                      {lead.lastComment}
                    </p>
                  )}
                </button>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getActionStatusColor(
                      lead.lastAction,
                    )}`}
                  >
                    {col.label}
                  </span>
                  {lead.scheduleDate && (
                    <span className="text-[10px] text-slate-500">
                      {formatDate(lead.scheduleDate)}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(lead)}
                    className="rounded-xl bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white"
                  >
                    Action
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete?.(lead._id)}
                    className="rounded-xl border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!grouped[col.key]?.length && (
              <p className="py-6 text-center text-[11px] text-slate-400">No leads</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(LeadKanban);
