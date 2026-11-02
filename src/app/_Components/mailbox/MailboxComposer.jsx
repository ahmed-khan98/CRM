"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  Clock,
  Maximize2,
  Minimize2,
  Paperclip,
  Trash2,
  X,
} from "lucide-react";
import TinyEditor from "@/app/_Components/TinyEditor";
import {
  useCreateMailboxScheduledMutation,
  useSaveMailboxDraftMutation,
  useSendMailboxMailMutation,
} from "@/app/_Services/mailbox/page";

function toLocalInputValue(d = new Date(Date.now() + 60 * 60 * 1000)) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseAddresses(raw) {
  return String(raw || "")
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function titleForMode(mode) {
  if (mode === "reply") return "Reply";
  if (mode === "replyAll") return "Reply all";
  if (mode === "forward") return "Forward";
  return "New message";
}

/**
 * Gmail-style floating compose window (bottom-right).
 * @param {{
 *   mailboxes: Array<{_id:string,emailAddress:string,displayName?:string,permission:string,loginUsername?:string}>,
 *   initial?: object,
 *   onClose: (sent?: boolean) => void,
 * }} props
 */
export default function MailboxComposer({ mailboxes = [], initial = {}, onClose }) {
  const sendable = useMemo(
    () =>
      mailboxes.filter((m) =>
        ["read_send", "manage"].includes(m.permission),
      ),
    [mailboxes],
  );

  const [mailboxId, setMailboxId] = useState(
    initial.mailboxId || sendable[0]?._id || "",
  );
  const [to, setTo] = useState(
    (initial.to || []).map((a) => a.address || a).join(", "),
  );
  const [cc, setCc] = useState(
    (initial.cc || []).map((a) => a.address || a).join(", "),
  );
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(Boolean(initial.cc?.length));
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState(initial.subject || "");
  const [bodyHtml, setBodyHtml] = useState(initial.bodyHtml || "");
  const [attachments, setAttachments] = useState([]);
  const [draftUid, setDraftUid] = useState(initial.draftUid || null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [sendAtLocal, setSendAtLocal] = useState(toLocalInputValue());
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const [sendMail, { isLoading: sending }] = useSendMailboxMailMutation();
  const [saveDraft, { isLoading: saving }] = useSaveMailboxDraftMutation();
  const [createScheduled, { isLoading: scheduling }] =
    useCreateMailboxScheduledMutation();

  const buildPayload = async () => {
    const attPayload = [];
    for (const f of attachments) {
      const contentBase64 = await fileToBase64(f);
      attPayload.push({
        filename: f.name,
        contentType: f.type || "application/octet-stream",
        contentBase64,
      });
    }
    return {
      mailboxId,
      to: parseAddresses(to),
      cc: parseAddresses(cc),
      bcc: parseAddresses(bcc),
      subject,
      bodyHtml,
      attachments: attPayload,
      inReplyTo: initial.inReplyTo || null,
      references: initial.references || null,
      draftUid: draftUid || null,
    };
  };

  const onSend = async () => {
    if (!parseAddresses(to).length) return toast.error("Add at least one To address");
    try {
      const payload = await buildPayload();
      const res = await sendMail(payload).unwrap();
      if (res?.data?.warning) toast(res.data.warning, { icon: "⚠️", duration: 6000 });
      toast.success("Message sent");
      onClose(true);
    } catch (err) {
      toast.error(err?.data?.message || "Send failed");
    }
  };

  const onDraft = async () => {
    try {
      const payload = await buildPayload();
      const res = await saveDraft(payload).unwrap();
      if (res?.data?.uid) setDraftUid(res.data.uid);
      toast.success("Draft saved");
    } catch (err) {
      toast.error(err?.data?.message || "Draft save failed");
    }
  };

  const onSchedule = async () => {
    if (!parseAddresses(to).length) return toast.error("Add at least one To address");
    if (!sendAtLocal) return toast.error("Pick a send time");
    const sendAt = new Date(sendAtLocal);
    if (Number.isNaN(sendAt.getTime()) || sendAt.getTime() <= Date.now()) {
      return toast.error("Send time must be in the future");
    }
    try {
      const payload = await buildPayload();
      await createScheduled({
        mailboxId: payload.mailboxId,
        to: payload.to,
        cc: payload.cc,
        bcc: payload.bcc,
        subject: payload.subject,
        bodyHtml: payload.bodyHtml,
        attachments: payload.attachments,
        sendAt: sendAt.toISOString(),
      }).unwrap();
      toast.success(
        `Scheduled for ${sendAt.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}`,
      );
      onClose(true);
    } catch (err) {
      toast.error(err?.data?.message || "Schedule failed");
    }
  };

  const onFiles = (e) => {
    const files = [...(e.target.files || [])];
    setAttachments((prev) => [...prev, ...files].slice(0, 20));
    e.target.value = "";
  };

  const discard = () => onClose(false);

  const noAccess = !sendable.length;

  // Inline size so panel never exceeds viewport (fixes From/To/Subject cut off at top)
  const panelStyle = minimized
    ? undefined
    : expanded
      ? {
          top: 12,
          right: 12,
          bottom: 12,
          left: "auto",
          width: "min(880px, calc(100vw - 24px))",
          maxHeight: "calc(100vh - 24px)",
          height: "calc(100vh - 24px)",
        }
      : {
          bottom: 0,
          right: 16,
          left: "auto",
          width: "min(720px, calc(100vw - 16px))",
          maxHeight: "calc(100vh - 8px)",
          height: "min(620px, calc(100vh - 8px))",
        };

  const panel = (
    <div
      style={panelStyle}
      className={`fixed z-[80] flex flex-col overflow-hidden overflow-x-hidden border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl shadow-black/50 ${
        minimized
          ? "bottom-0 right-4 !h-11 !w-[320px] !max-h-11 rounded-t-xl"
          : expanded
            ? "rounded-2xl"
            : "left-0 sm:left-auto rounded-t-xl sm:rounded-xl"
      }`}
      role="dialog"
      aria-label={titleForMode(initial.mode)}
    >
      {/* Title bar — Gmail-like */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800 border-b border-zinc-700 shrink-0 cursor-pointer select-none"
        onDoubleClick={() => {
          if (minimized) setMinimized(false);
          else setExpanded((v) => !v);
        }}
      >
        <button
          type="button"
          className="flex-1 text-left text-sm font-medium text-zinc-100 truncate"
          onClick={() => minimized && setMinimized(false)}
        >
          {titleForMode(initial.mode)}
          {subject ? ` — ${subject}` : ""}
        </button>
        <button
          type="button"
          title={minimized ? "Restore" : "Minimize"}
          className="p-1 rounded text-zinc-400 hover:bg-zinc-700 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setMinimized((v) => !v);
            if (!minimized) setExpanded(false);
          }}
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title={expanded ? "Exit full screen" : "Full screen"}
          className="p-1 rounded text-zinc-400 hover:bg-zinc-700 hover:text-white hidden sm:inline-flex"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
            setMinimized(false);
          }}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Close"
          className="p-1 rounded text-zinc-400 hover:bg-zinc-700 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            discard();
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {!minimized && (
        <>
          {noAccess ? (
            <div className="flex-1 p-5 text-sm text-zinc-400">
              No mailbox with send permission. Ask admin for{" "}
              <strong className="text-zinc-200">read_send</strong> or{" "}
              <strong className="text-zinc-200">manage</strong>.
            </div>
          ) : (
            <>
              <div className="shrink-0 border-b border-zinc-800 bg-zinc-900 overflow-x-hidden">
                <div className="flex items-center gap-2 px-3 py-1 border-b border-zinc-800/80 min-w-0">
                  <span className="text-xs text-zinc-500 w-12 shrink-0">From</span>
                  <select
                    className="flex-1 min-w-0 bg-transparent text-sm text-zinc-100 outline-none py-0.5 truncate"
                    value={mailboxId}
                    onChange={(e) => setMailboxId(e.target.value)}
                  >
                    {sendable.map((m) => (
                      <option key={m._id} value={m._id} className="bg-zinc-900">
                        {m.emailAddress}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 border-b border-zinc-800/80 min-w-0">
                  <span className="text-xs text-zinc-500 w-12 shrink-0">To</span>
                  <input
                    className="flex-1 min-w-0 w-full bg-transparent text-sm text-zinc-100 outline-none py-0.5 placeholder:text-zinc-600"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                  />
                  <div className="flex items-center gap-2 shrink-0 text-xs text-zinc-400">
                    {!showCc && (
                      <button
                        type="button"
                        className="hover:text-zinc-200"
                        onClick={() => setShowCc(true)}
                      >
                        Cc
                      </button>
                    )}
                    {!showBcc && (
                      <button
                        type="button"
                        className="hover:text-zinc-200"
                        onClick={() => setShowBcc(true)}
                      >
                        Bcc
                      </button>
                    )}
                  </div>
                </div>

                {showCc && (
                  <div className="flex items-center gap-2 px-3 py-1 border-b border-zinc-800/80 min-w-0">
                    <span className="text-xs text-zinc-500 w-12 shrink-0">Cc</span>
                    <input
                      className="flex-1 min-w-0 w-full bg-transparent text-sm text-zinc-100 outline-none py-0.5"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                    />
                  </div>
                )}

                {showBcc && (
                  <div className="flex items-center gap-2 px-3 py-1 border-b border-zinc-800/80 min-w-0">
                    <span className="text-xs text-zinc-500 w-12 shrink-0">Bcc</span>
                    <input
                      className="flex-1 min-w-0 w-full bg-transparent text-sm text-zinc-100 outline-none py-0.5"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 px-3 py-1 min-w-0">
                  <span className="text-xs text-zinc-500 w-12 shrink-0">Subject</span>
                  <input
                    className="flex-1 min-w-0 w-full bg-transparent text-sm text-zinc-100 outline-none py-0.5 placeholder:text-zinc-600"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-2 py-1.5 gap-1.5">
                <div className="flex-1 min-h-[180px] min-w-0 overflow-hidden">
                  <TinyEditor
                    value={bodyHtml}
                    onChange={setBodyHtml}
                    dark
                    fill
                    showMenubar
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1 shrink-0">
                    {attachments.map((f, i) => (
                      <span
                        key={`${f.name}-${i}`}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                      >
                        {f.name}
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {scheduleMode && (
                  <div className="px-1 shrink-0">
                    <label className="text-[11px] text-zinc-500 block mb-1">
                      Send at (local time)
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100"
                      value={sendAtLocal}
                      onChange={(e) => setSendAtLocal(e.target.value)}
                      min={toLocalInputValue(new Date(Date.now() + 60_000))}
                    />
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="shrink-0 flex flex-wrap items-center gap-2 px-3 py-2.5 border-t border-zinc-800 bg-zinc-900/90">
                {scheduleMode ? (
                  <button
                    type="button"
                    disabled={scheduling}
                    onClick={onSchedule}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-600 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
                  >
                    Schedule send
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={onSend}
                    className="inline-flex items-center px-5 py-1.5 rounded-full bg-sky-600 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
                  >
                    Send
                  </button>
                )}

                <label
                  className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                  title="Attach"
                >
                  <Paperclip className="h-4 w-4" />
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onFiles}
                  />
                </label>

                <button
                  type="button"
                  title="Schedule"
                  onClick={() => setScheduleMode((v) => !v)}
                  className={`p-2 rounded-full hover:bg-zinc-800 ${
                    scheduleMode ? "text-sky-400" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={onDraft}
                  className="text-xs text-zinc-400 hover:text-zinc-200 px-2"
                >
                  Save draft
                </button>

                <button
                  type="button"
                  title="Discard"
                  onClick={discard}
                  className="ml-auto p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
}
