"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import { formatDisplayName } from "@/app/_Components/chat/chatUtils";

function AddMembersModal({
  existingIds = [],
  searchUsers,
  users,
  onClose,
  onAdd,
  dark = false,
  theme,
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  const existing = useMemo(
    () => new Set(existingIds.map(String)),
    [existingIds]
  );

  useEffect(() => {
    const t = setTimeout(() => searchUsers({ q }), 200);
    return () => clearTimeout(t);
  }, [q, searchUsers]);

  const selectedIds = useMemo(
    () => new Set(selected.map((u) => String(u._id))),
    [selected]
  );

  const available = useMemo(
    () => (users || []).filter((u) => !existing.has(String(u._id))),
    [users, existing]
  );

  const toggleMember = (u) => {
    const id = String(u._id);
    setSelected((prev) =>
      prev.some((x) => String(x._id) === id)
        ? prev.filter((x) => String(x._id) !== id)
        : [...prev, u]
    );
  };

  const panel = dark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900";
  const divider = dark ? "border-white/[0.07]" : "border-zinc-200";
  const inputCls = theme?.input
    ? `${theme.input} mb-2 w-full rounded-lg px-3 py-2 text-sm outline-none`
    : `mb-2 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
        dark
          ? "border-white/[0.08] bg-[#1c1c20] text-white placeholder:text-zinc-500"
          : "border-zinc-200 bg-white text-zinc-900"
      }`;
  const rowHover = dark ? "hover:bg-white/[0.04]" : "hover:bg-zinc-50";
  const rowOn = dark ? "bg-white/[0.07]" : "bg-zinc-50";
  const chip = dark
    ? "bg-white/[0.08] text-zinc-100"
    : "bg-zinc-50 text-zinc-900";
  const chipClose = dark ? "hover:bg-white/[0.12]" : "hover:bg-zinc-200";
  const checkOn = dark
    ? "border-[#e4e4e7] bg-[#f4f4f5] text-[#09090b]"
    : "border-zinc-950 bg-ink text-white";
  const checkOff = dark ? "border-white/20" : "border-zinc-200";
  const actionBtn =
    theme?.accent ||
    (dark ? "bg-[#f4f4f5] text-[#09090b]" : "bg-ink text-white");
  const closeBtn = dark
    ? "text-zinc-400 hover:text-zinc-100"
    : "text-zinc-500 hover:text-zinc-900";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl shadow-xl sm:rounded-2xl ${panel}`}
      >
        <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${divider}`}>
          <p className="font-semibold">Add members</p>
          <button type="button" aria-label="Close" onClick={onClose} className={closeBtn}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {selected.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Selected ({selected.length})
              </p>
              <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                {selected.map((u) => (
                  <span
                    key={u._id}
                    className={`inline-flex max-w-full items-center gap-1 rounded-full py-0.5 pl-0.5 pr-1.5 text-[11px] font-medium ${chip}`}
                  >
                    <Avatar src={u.image} name={formatDisplayName(u.fullName)} size="xs" />
                    <span className="truncate max-w-[90px]">{formatDisplayName(u.fullName)}</span>
                    <button
                      type="button"
                      className={`rounded-full p-0.5 ${chipClose}`}
                      onClick={() => toggleMember(u)}
                    >
                      <X className={`h-3 w-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search employees"
            className={inputCls}
          />

          <div className="space-y-1">
            {available.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-zinc-400">
                No more employees to add
              </p>
            ) : (
              available.map((u) => {
                const checked = selectedIds.has(String(u._id));
                return (
                  <button
                    key={u._id}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 ${rowHover} ${
                      checked ? rowOn : ""
                    }`}
                    onClick={() => toggleMember(u)}
                  >
                    <Avatar
                      src={u.image}
                      name={formatDisplayName(u.fullName)}
                      size="sm"
                      online={u.isOnline}
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium">{formatDisplayName(u.fullName)}</p>
                      <p className="truncate text-xs text-zinc-500">{u.email}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
                        checked ? checkOn : checkOff
                      }`}
                    >
                      {checked ? "✓" : ""}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className={`shrink-0 border-t px-4 py-3 ${divider}`}>
          <button
            type="button"
            disabled={selected.length < 1 || saving}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-40 ${actionBtn}`}
            onClick={async () => {
              setSaving(true);
              try {
                await onAdd(selected.map((u) => u._id));
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving
              ? "Adding…"
              : `Add${selected.length ? ` (${selected.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(AddMembersModal);
