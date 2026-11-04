"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import moment from "moment-timezone";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
  Paperclip,
  Star,
} from "lucide-react";
import { getAccessToken } from "@/app/_utils/authCookies";
import { usePatchMailboxMessageFlagsMutation } from "@/app/_Services/mailbox/page";
import MailboxCrmCard from "@/app/_Components/mailbox/inbox/MailboxCrmCard";
import toast from "react-hot-toast";

function personLabel(a) {
  if (!a) return "";
  return a.name || a.address || "";
}

function personEmail(a) {
  return a?.address || "";
}

function formatPeople(list) {
  if (!list?.length) return "—";
  return list
    .map((a) => (a.name ? `${a.name} <${a.address}>` : a.address))
    .join(", ");
}

function avatarInitial(from) {
  const a = from?.[0];
  const raw = (a?.name || a?.address || "?").trim();
  return raw.charAt(0).toUpperCase();
}

function avatarHue(from) {
  const s = String(from?.[0]?.address || from?.[0]?.name || "x");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 17) % 360;
  return h;
}

function formatGmailDate(date) {
  if (!date) return "";
  const m = moment(date);
  if (!m.isValid()) return "";
  if (m.isSame(moment(), "day")) return m.format("h:mm A");
  if (m.isSame(moment(), "year")) return m.format("MMM D, h:mm A");
  return m.format("MMM D, YYYY, h:mm A");
}

function fileSizeLabel(size) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
  const [detailsOpen, setDetailsOpen] = useState(false);

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
    return <div className="p-6 text-sm text-rose-300">{error}</div>;
  }

  if (!message) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-zinc-500">
        Select a message to read
      </div>
    );
  }

  const from = message.from?.[0];
  const fromName = personLabel(from) || "Unknown";
  const fromAddr = personEmail(from);
  const toSummary =
    message.to?.length === 1
      ? personLabel(message.to[0]) || personEmail(message.to[0])
      : `${message.to?.length || 0} recipients`;
  const hue = avatarHue(message.from);

  const toggleFlag = async () => {
    try {
      await patchFlags({
        mailboxId,
        uid: message.uid,
        folder,
        flagged: !message.flagged,
      }).unwrap();
      toast.success(message.flagged ? "Unstarred" : "Starred");
    } catch (err) {
      toast.error(err?.data?.message || "Could not update star");
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
    <div className="flex flex-col h-full min-h-0 bg-[#1e1f20]">
      {/* Subject — Gmail-style large title */}
      <div className="px-5 pt-4 pb-2 shrink-0 flex items-start gap-3">
        <h2 className="flex-1 text-[1.375rem] leading-snug font-normal text-[#e8eaed] tracking-tight">
          {message.subject || "(no subject)"}
        </h2>
        <button
          type="button"
          onClick={toggleFlag}
          className="mt-1 p-1.5 rounded-full hover:bg-white/5 text-zinc-400"
          title={message.flagged ? "Unstar" : "Star"}
        >
          <Star
            className={`h-5 w-5 ${
              message.flagged
                ? "fill-[#f4b400] text-[#f4b400]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          />
        </button>
      </div>

      {/* Sender row — avatar + name + date */}
      <div className="px-5 pb-3 shrink-0">
        <div className="flex items-start gap-3">
          <div
            className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-medium text-white select-none"
            style={{
              background: `hsl(${hue} 42% 42%)`,
            }}
            aria-hidden
          >
            {avatarInitial(message.from)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#e8eaed] truncate">
                {fromName}
              </span>
              {fromAddr && fromName !== fromAddr && (
                <span className="text-xs text-[#9aa0a6] truncate">
                  &lt;{fromAddr}&gt;
                </span>
              )}
              <span className="ml-auto text-xs text-[#9aa0a6] whitespace-nowrap pl-2">
                {formatGmailDate(message.date)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#9aa0a6] hover:text-[#e8eaed]"
            >
              <span>
                to {toSummary}
                {message.cc?.length ? `, cc ${message.cc.length}` : ""}
              </span>
              {detailsOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {detailsOpen && (
              <div className="mt-2 rounded-lg border border-[#3c4043] bg-[#292a2d] px-3 py-2 text-xs text-[#bdc1c6] space-y-1.5">
                <div className="grid grid-cols-[3.5rem_1fr] gap-x-2 gap-y-1">
                  <span className="text-[#9aa0a6]">from</span>
                  <span className="break-all">{formatPeople(message.from)}</span>
                  <span className="text-[#9aa0a6]">to</span>
                  <span className="break-all">{formatPeople(message.to)}</span>
                  {message.cc?.length > 0 && (
                    <>
                      <span className="text-[#9aa0a6]">cc</span>
                      <span className="break-all">
                        {formatPeople(message.cc)}
                      </span>
                    </>
                  )}
                  <span className="text-[#9aa0a6]">date</span>
                  <span>
                    {message.date
                      ? moment(message.date).format("ddd, MMM D, YYYY, h:mm A")
                      : "—"}
                  </span>
                  {message.subject && (
                    <>
                      <span className="text-[#9aa0a6]">subject</span>
                      <span className="break-words">{message.subject}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attachments — Gmail chip cards */}
      {message.attachments?.length > 0 && (
        <div className="px-5 pb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] mb-2">
            <Paperclip className="h-3.5 w-3.5" />
            {message.attachments.length} attachment
            {message.attachments.length === 1 ? "" : "s"}
          </div>
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <button
                key={att.index}
                type="button"
                disabled={downloading === att.index}
                onClick={() => downloadAtt(att.index, att.filename)}
                className="group flex items-center gap-2 max-w-[240px] rounded-xl border border-[#3c4043] bg-[#292a2d] px-2.5 py-2 text-left hover:bg-[#35363a] disabled:opacity-60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3c4043] text-[#e8eaed]">
                  {downloading === att.index ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-[#e8eaed]">
                    {att.filename || `file-${att.index}`}
                  </span>
                  <span className="block text-[10px] text-[#9aa0a6]">
                    {fileSizeLabel(att.size) || "Attachment"}
                  </span>
                </span>
                <Download className="h-3.5 w-3.5 shrink-0 text-[#9aa0a6] opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
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

      {!loadImages &&
        (message.imagesBlocked ||
          /data-blocked-src/i.test(message.html || "")) && (
          <div className="mx-5 mb-2 shrink-0 flex items-center justify-between gap-2 rounded-lg border border-[#3c4043] bg-[#292a2d] px-3 py-2">
            <span className="text-[11px] text-[#9aa0a6]">
              Images are not displayed.
            </span>
            <button
              type="button"
              onClick={() => onLoadImages?.()}
              className="text-[11px] font-medium text-[#8ab4f8] hover:underline"
            >
              Display images
            </button>
          </div>
        )}

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar-dark px-5 py-4 border-t border-[#3c4043]/40">
        <div
          className="mailbox-html prose prose-invert max-w-none text-[0.9375rem] leading-relaxed text-[#e8eaed] break-words [&_a]:text-[#8ab4f8]"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </div>
  );
}
