"use client";

import { useMemo, useState } from "react";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import { Clock, Loader2, Send, X } from "lucide-react";
import {
  useCancelMailboxScheduledMutation,
  useGetMailboxScheduledQuery,
  useSendMailboxScheduledNowMutation,
} from "@/app/_Services/mailbox/page";

function statusClass(status) {
  if (status === "failed") return "text-rose-300";
  if (status === "sending") return "text-amber-300";
  if (status === "pending") return "text-sky-300";
  return "text-zinc-400";
}

/**
 * Virtual Scheduled folder: list + detail actions (cancel / send now).
 */
export default function MailboxScheduledPanel({ mailboxId, canSend }) {
  const {
    data,
    isFetching,
    refetch,
  } = useGetMailboxScheduledQuery(
    { mailboxId },
    { skip: !mailboxId, pollingInterval: 30000 },
  );
  const rows = data?.data || [];
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => rows.find((r) => String(r._id) === String(selectedId)) || null,
    [rows, selectedId],
  );

  const [cancelScheduled, { isLoading: cancelling }] =
    useCancelMailboxScheduledMutation();
  const [sendNow, { isLoading: sendingNow }] =
    useSendMailboxScheduledNowMutation();

  const onCancel = async () => {
    if (!selected) return;
    try {
      await cancelScheduled({ mailboxId, id: selected._id }).unwrap();
      toast.success("Cancelled");
      setSelectedId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Cancel failed");
    }
  };

  const onSendNow = async () => {
    if (!selected) return;
    try {
      await sendNow({ mailboxId, id: selected._id }).unwrap();
      toast.success("Sent now");
      setSelectedId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Send now failed");
    }
  };

  return (
    <div className="contents">
      <section className="border-r border-zinc-800 min-h-0 flex flex-col h-full">
        <div className="p-2 border-b border-zinc-800 text-xs text-zinc-400 flex items-center gap-1.5 shrink-0">
          <Clock className="h-3.5 w-3.5" />
          Scheduled ({rows.length})
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar-dark">
          {isFetching && !rows.length && (
            <div className="p-4 flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading…
            </div>
          )}
          {!isFetching && rows.length === 0 && (
            <div className="p-6 text-sm text-zinc-500 text-center">
              No pending scheduled messages.
            </div>
          )}
          {rows.map((r) => {
            const active = String(r._id) === String(selectedId);
            return (
              <button
                key={r._id}
                type="button"
                onClick={() => setSelectedId(r._id)}
                className={`w-full text-left px-3 py-2.5 border-b border-zinc-800/80 transition-colors ${
                  active ? "bg-zinc-800/80" : "hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] text-zinc-100 font-medium">
                    {r.subject || "(no subject)"}
                  </span>
                  <span className={`text-[10px] shrink-0 ${statusClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                  To: {(r.to || []).join(", ") || "—"}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {r.sendAt
                    ? moment(r.sendAt).format("DD MMM YYYY, HH:mm")
                    : "—"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="min-h-0 flex flex-col h-full">
        {!selected ? (
          <div className="flex items-center justify-center h-full text-sm text-zinc-500">
            Select a scheduled message
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-zinc-800 space-y-1 shrink-0">
              <h2 className="text-base font-semibold text-zinc-50">
                {selected.subject || "(no subject)"}
              </h2>
              <div className="text-xs text-zinc-400 space-y-0.5">
                <div>
                  <span className="text-zinc-500">To:</span>{" "}
                  {(selected.to || []).join(", ") || "—"}
                </div>
                {(selected.cc || []).length > 0 && (
                  <div>
                    <span className="text-zinc-500">Cc:</span>{" "}
                    {selected.cc.join(", ")}
                  </div>
                )}
                <div>
                  <span className="text-zinc-500">Send at:</span>{" "}
                  {selected.sendAt
                    ? moment(selected.sendAt).format("DD MMM YYYY, HH:mm")
                    : "—"}
                </div>
                <div>
                  <span className="text-zinc-500">Status:</span>{" "}
                  <span className={statusClass(selected.status)}>
                    {selected.status}
                  </span>
                  {selected.attempts ? ` · attempts ${selected.attempts}` : ""}
                </div>
                {selected.error && (
                  <div className="text-rose-300">{selected.error}</div>
                )}
              </div>
            </div>

            {canSend && ["pending", "failed"].includes(selected.status) && (
              <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-zinc-800 shrink-0">
                <button
                  type="button"
                  disabled={sendingNow}
                  onClick={onSendNow}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-800"
                >
                  <Send className="h-3 w-3" />
                  Send now
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={onCancel}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-800"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar-dark px-4 py-3">
              <div
                className="mailbox-html prose prose-invert max-w-none text-sm text-zinc-200 break-words"
                dangerouslySetInnerHTML={{
                  __html:
                    selected.bodyHtml ||
                    "<p class='text-zinc-500'>(empty)</p>",
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
