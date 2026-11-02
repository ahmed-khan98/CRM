"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Clock, Paperclip, X } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
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

/**
 * @param {{
 *   mailboxes: Array<{_id:string,emailAddress:string,displayName?:string,permission:string}>,
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
  const [subject, setSubject] = useState(initial.subject || "");
  const [bodyHtml, setBodyHtml] = useState(initial.bodyHtml || "");
  const [attachments, setAttachments] = useState([]);
  const [draftUid, setDraftUid] = useState(initial.draftUid || null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [sendAtLocal, setSendAtLocal] = useState(toLocalInputValue());

  const [sendMail, { isLoading: sending }] = useSendMailboxMailMutation();
  const [saveDraft, { isLoading: saving }] = useSaveMailboxDraftMutation();
  const [createScheduled, { isLoading: scheduling }] =
    useCreateMailboxScheduledMutation();

  if (!sendable.length) {
    return (
      <div className={fleet.modalOverlay} onClick={() => onClose(false)}>
        <div
          className={`${fleet.modalPanel} max-w-md`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-sm text-zinc-300">
            No mailbox with send permission. Ask admin for{" "}
            <strong>read_send</strong> or <strong>manage</strong>.
          </div>
          <div className={fleet.modalFooter}>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              onClick={() => onClose(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      toast.success(
        res?.data?.replyAddress
          ? `Sent — replies go to ${res.data.replyAddress}`
          : "Message sent",
      );
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

  return (
    <div className={fleet.modalOverlay} onClick={() => onClose(false)}>
      <div
        className={`${fleet.modalPanel} max-w-3xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className={fleet.modalTitle}>
            {initial.mode === "reply"
              ? "Reply"
              : initial.mode === "replyAll"
                ? "Reply all"
                : initial.mode === "forward"
                  ? "Forward"
                  : "New message"}
          </h3>
          <button
            type="button"
            className="text-zinc-400 hover:text-white"
            onClick={() => onClose(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className={fleet.modalBody}>
          <div>
            <label className={fleet.modalLabel}>From</label>
            <select
              className={fleet.modalSelect}
              value={mailboxId}
              onChange={(e) => setMailboxId(e.target.value)}
            >
              {sendable.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.emailAddress}
                  {m.displayName ? ` (${m.displayName})` : ""}
                  {m.loginUsername &&
                  m.loginUsername.toLowerCase() !== m.emailAddress?.toLowerCase()
                    ? ` → replies: ${m.loginUsername}`
                    : ""}
                </option>
              ))}
            </select>
            {(() => {
              const m = sendable.find((x) => String(x._id) === String(mailboxId));
              if (
                m?.loginUsername &&
                m.emailAddress &&
                m.loginUsername.toLowerCase() !== m.emailAddress.toLowerCase()
              ) {
                return (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Listed address is {m.emailAddress}, but IMAP/SMTP login is{" "}
                    {m.loginUsername}. Replies will arrive in{" "}
                    <strong>{m.loginUsername}</strong> — edit mailbox in Email
                    Mapping so both match (usually the .com cPanel address).
                  </p>
                );
              }
              return (
                <p className="text-[11px] text-zinc-500 mt-1">
                  Replies arrive in this mailbox&apos;s Inbox. Open the same
                  mailbox (e.g. support@…) after the other person replies, then
                  Refresh.
                </p>
              );
            })()}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={fleet.modalLabel}>To</label>
              {!showCc && (
                <button
                  type="button"
                  className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  onClick={() => setShowCc(true)}
                >
                  Cc/Bcc
                </button>
              )}
            </div>
            <input
              className={fleet.modalInput}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="name@example.com, …"
            />
          </div>

          {showCc && (
            <>
              <div>
                <label className={fleet.modalLabel}>Cc</label>
                <input
                  className={fleet.modalInput}
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </div>
              <div>
                <label className={fleet.modalLabel}>Bcc</label>
                <input
                  className={fleet.modalInput}
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className={fleet.modalLabel}>Subject</label>
            <input
              className={fleet.modalInput}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Message</label>
            <TinyEditor value={bodyHtml} onChange={setBodyHtml} compact height={220} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 cursor-pointer hover:bg-zinc-800">
              <Paperclip className="h-3.5 w-3.5" />
              Attach
              <input type="file" multiple className="hidden" onChange={onFiles} />
            </label>
            <button
              type="button"
              onClick={() => setScheduleMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                scheduleMode
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-200"
                  : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Schedule
            </button>
            {attachments.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300"
              >
                {f.name}
                <button
                  type="button"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {scheduleMode && (
            <div>
              <label className={fleet.modalLabel}>Send at (local time)</label>
              <input
                type="datetime-local"
                className={fleet.modalInput}
                value={sendAtLocal}
                onChange={(e) => setSendAtLocal(e.target.value)}
                min={toLocalInputValue(new Date(Date.now() + 60_000))}
              />
            </div>
          )}
        </div>

        <div className={fleet.modalFooter}>
          <button
            type="button"
            className={fleet.modalCancelBtn}
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={fleet.modalCancelBtn}
            disabled={saving}
            onClick={onDraft}
          >
            Save draft
          </button>
          {scheduleMode ? (
            <button
              type="button"
              className={fleet.modalPrimaryBtn}
              disabled={scheduling}
              onClick={onSchedule}
            >
              Schedule send
            </button>
          ) : (
            <button
              type="button"
              className={fleet.modalPrimaryBtn}
              disabled={sending}
              onClick={onSend}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
