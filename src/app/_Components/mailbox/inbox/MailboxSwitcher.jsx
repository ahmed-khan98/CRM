"use client";

import { useMemo } from "react";

export default function MailboxSwitcher({
  grouped = [],
  value,
  onChange,
  disabled,
}) {
  const mailboxes = useMemo(() => {
    const list = [];
    for (const g of grouped) {
      for (const m of g.mailboxes || []) {
        list.push(m);
      }
    }
    return list;
  }, [grouped]);

  return (
    <select
      className="min-w-[220px] max-w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-400"
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select mailbox…</option>
      {mailboxes.map((m) => (
        <option key={m._id} value={m._id}>
          {m.emailAddress}
        </option>
      ))}
    </select>
  );
}
