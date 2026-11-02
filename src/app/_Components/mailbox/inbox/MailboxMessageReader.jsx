"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import moment from "moment-timezone";
import { Download, Flag, Loader2 } from "lucide-react";
import { getAccessToken } from "@/app/_utils/authCookies";
import { usePatchMailboxMessageFlagsMutation } from "@/app/_Services/mailbox/page";
import MailboxCrmCard from "@/app/_Components/mailbox/inbox/MailboxCrmCard";
import toast from "react-hot-toast";

function formatPeople(list) {
  if (!list?.length) return "—";
  return list
    .map((a) => (a.name ? `${a.name} <${a.address}>` : a.address))
    .join(", ");
}

export default function MailboxMessageReader({
  mailboxId,
  folder,
  message,
  loading,
  error,
  crmDirection = "inbound",
  loadImages = false,
  onLoadImages,
}) {
  const [patchFlags] = usePatchMailboxMessageFlagsMutation();
  const [downloading, setDownloading] = useState(null);

  const safeHtml = useMemo(() => {
    if (!message?.html) return "";
    return DOMPurify.sanitize(message.html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["data-blocked-src"],
    });
  }, [message?.html]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading message…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-rose-300">
        {error}
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-zinc-500">
        Select a message to read
      </div>
    );
  }

  const toggleFlag = async () => {
    try {
      await patchFlags({
        mailboxId,
        uid: message.uid,
        folder,
        flagged: !message.flagged,
      }).unwrap();
      toast.success(message.flagged ? "Unflagged" : "Flagged");
    } catch (err) {
      toast.error(err?.data?.message || "Could not update flag");
    }
  };

  const downloadAtt = async (index, filename) => {
    setDownloading(index);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
      const token = getAccessToken();
      const url = `${base}/mailbox/mail/${mailboxId}/messages/${message.uid}/attachments/${index}?folder=${encodeURIComponent(folder)}`;
      const res = await fetch(url, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Download failed");
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename || `attachment-${index}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0 space-y-1">
        <div className="flex items-start gap-2">
          <h2 className="text-base font-semibold text-zinc-50 flex-1">
            {message.subject}
          </h2>
          <button
            type="button"
            onClick={toggleFlag}
            className={`p-1.5 rounded-lg border ${
              message.flagged
                ? "border-amber-500/40 text-amber-300"
                : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
            }`}
            title="Flag"
          >
            <Flag
              className={`h-3.5 w-3.5 ${message.flagged ? "fill-amber-300" : ""}`}
            />
          </button>
        </div>
        <div className="text-xs text-zinc-400 space-y-0.5">
          <div>
            <span className="text-zinc-500">From:</span>{" "}
            {formatPeople(message.from)}
          </div>
          <div>
            <span className="text-zinc-500">To:</span>{" "}
            {formatPeople(message.to)}
          </div>
          {message.cc?.length > 0 && (
            <div>
              <span className="text-zinc-500">Cc:</span>{" "}
              {formatPeople(message.cc)}
            </div>
          )}
          <div>
            <span className="text-zinc-500">Date:</span>{" "}
            {message.date
              ? moment(message.date).format("DD MMM YYYY, HH:mm")
              : "—"}
          </div>
        </div>
      </div>

      {message.attachments?.length > 0 && (
        <div className="px-4 py-2 border-b border-zinc-800 flex flex-wrap gap-2 shrink-0">
          {message.attachments.map((att) => (
            <button
              key={att.index}
              type="button"
              disabled={downloading === att.index}
              onClick={() => downloadAtt(att.index, att.filename)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              <Download className="h-3 w-3" />
              {att.filename}
              {att.size ? (
                <span className="text-zinc-500">
                  ({Math.max(1, Math.round(att.size / 1024))} KB)
                </span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      <MailboxCrmCard
        mailboxId={mailboxId}
        email={
          crmDirection === "outbound"
            ? message.to?.[0]?.address
            : message.from?.[0]?.address
        }
        messageId={message.messageId}
        subject={message.subject}
        date={message.date}
        direction={crmDirection}
      />

      {(message.imagesBlocked || !loadImages) && (
        <div className="px-4 py-2 border-b border-zinc-800 shrink-0 flex items-center justify-between gap-2 bg-zinc-900/50">
          <span className="text-[11px] text-zinc-500">
            Remote images are blocked for safety.
          </span>
          <button
            type="button"
            onClick={() => onLoadImages?.()}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-zinc-600 text-zinc-200 hover:bg-zinc-800"
          >
            Load images
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        <div
          className="mailbox-html prose prose-invert max-w-none text-sm text-zinc-200 break-words"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </div>
  );
}
