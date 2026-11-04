"use client";

import moment from "moment-timezone";
import { Paperclip, Star } from "lucide-react";

function formatAddr(list, { preferAddress = false } = {}) {
  if (!list?.length) return "—";
  const a = list[0];
  if (preferAddress) return a.address || a.name || "—";
  return a.name || a.address || "—";
}

function isSentFolder(folder) {
  const f = String(folder || "").toLowerCase();
  return f === "sent" || f.includes("sent");
}

function formatWhen(date) {
  if (!date) return "";
  const m = moment(date);
  if (!m.isValid()) return "";
  if (m.isSame(moment(), "day")) return m.format("HH:mm");
  if (m.isSame(moment(), "year")) return m.format("DD MMM");
  return m.format("DD MMM YYYY");
}

export default function MailboxMessageList({
  messages = [],
  selectedUid,
  onSelect,
  loading,
  search,
  onSearchChange,
  page,
  total,
  pageSize,
  onPageChange,
  folder,
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 25)));
  const showRecipient = isSentFolder(folder);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-2 border-b border-zinc-800 shrink-0">
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400"
          placeholder="Search in folder…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar-dark">
        {loading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-zinc-900/80 animate-pulse"
              />
            ))}
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="p-6 text-sm text-zinc-500 text-center">
            No messages in this folder.
          </div>
        )}
        {!loading &&
          messages.map((m) => {
            const active = String(m.uid) === String(selectedUid);
            return (
              <button
                key={m.uid}
                type="button"
                onClick={() => onSelect(m)}
                className={`w-full text-left px-3 py-2.5 border-b border-zinc-800/80 transition-colors ${
                  active ? "bg-zinc-800/80" : "hover:bg-zinc-900/60"
                } ${!m.seen ? "bg-zinc-900/40" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`truncate text-[13px] ${
                          m.seen
                            ? "text-zinc-300 font-normal"
                            : "text-zinc-50 font-semibold"
                        }`}
                      >
                        {showRecipient
                          ? formatAddr(m.to, { preferAddress: true })
                          : formatAddr(m.from)}
                      </span>
                      {m.flagged && (
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                      {m.hasAttachments && (
                        <Paperclip className="h-3 w-3 text-zinc-500 shrink-0" />
                      )}
                      <span className="ml-auto text-[10px] text-zinc-500 tabular-nums shrink-0">
                        {formatWhen(m.date)}
                      </span>
                    </div>
                    <div
                      className={`truncate text-[12px] mt-0.5 ${
                        m.seen ? "text-zinc-500" : "text-zinc-300"
                      }`}
                    >
                      {m.subject}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400 shrink-0">
          <button
            type="button"
            disabled={page <= 1}
            className="disabled:opacity-40 hover:text-white"
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            className="disabled:opacity-40 hover:text-white"
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
