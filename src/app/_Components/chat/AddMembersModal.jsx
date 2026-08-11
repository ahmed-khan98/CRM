"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";

function AddMembersModal({
  existingIds = [],
  searchUsers,
  users,
  onClose,
  onAdd,
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

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white text-zinc-900 shadow-xl sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-3">
          <p className="font-semibold">Add members</p>
          <button type="button" aria-label="Close" onClick={onClose}>
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
                    className="inline-flex max-w-full items-center gap-1 rounded-full bg-zinc-100 py-0.5 pl-0.5 pr-1.5 text-[11px] font-medium text-zinc-800"
                  >
                    <Avatar src={u.image} name={u.fullName} size="xs" />
                    <span className="truncate max-w-[90px]">{u.fullName}</span>
                    <button
                      type="button"
                      className="rounded-full p-0.5 hover:bg-zinc-200"
                      onClick={() => toggleMember(u)}
                    >
                      <X className="h-3 w-3 text-zinc-500" />
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
            className="mb-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none"
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
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-50 ${
                      checked ? "bg-zinc-50" : ""
                    }`}
                    onClick={() => toggleMember(u)}
                  >
                    <Avatar
                      src={u.image}
                      name={u.fullName}
                      size="sm"
                      online={u.isOnline}
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium">{u.fullName}</p>
                      <p className="truncate text-xs text-zinc-500">{u.email}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
                        checked
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-300"
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

        <div className="shrink-0 border-t border-zinc-100 px-4 py-3">
          <button
            type="button"
            disabled={selected.length < 1 || saving}
            className="w-full rounded-lg bg-zinc-950 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
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
