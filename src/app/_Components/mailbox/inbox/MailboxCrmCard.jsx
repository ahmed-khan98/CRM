"use client";

import Link from "next/link";
import { Loader2, User, ChartBar } from "lucide-react";
import { useGetMailboxCrmLinkQuery } from "@/app/_Services/mailbox/page";

/**
 * Read-only Client / Lead card for the counterparty email.
 */
export default function MailboxCrmCard({
  mailboxId,
  email,
  messageId,
  subject,
  date,
  direction = "inbound",
}) {
  const addr = String(email || "").trim().toLowerCase();
  const skip = !mailboxId || !addr || !addr.includes("@");

  const { data, isFetching, isError, error } = useGetMailboxCrmLinkQuery(
    {
      mailboxId,
      email: addr,
      messageId,
      subject,
      date,
      direction,
    },
    { skip },
  );

  if (skip) return null;

  const links = data?.data;
  const client = links?.client;
  const lead = links?.lead;

  return (
    <div className="px-4 py-2.5 border-b border-zinc-800 shrink-0 bg-zinc-900/40">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">
        CRM link
      </div>
      {isFetching && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          Looking up…
        </div>
      )}
      {isError && (
        <p className="text-xs text-rose-300">
          {error?.data?.message || "CRM lookup failed"}
        </p>
      )}
      {!isFetching && !isError && !client && !lead && (
        <p className="text-xs text-zinc-500">
          No client or lead for <span className="text-zinc-400">{addr}</span>.
          Create manually in Leads if needed.
        </p>
      )}
      {!isFetching && (client || lead) && (
        <div className="flex flex-wrap gap-2">
          {client && (
            <Link
              href={client.href || `/dashboard/client/${client._id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200 hover:bg-emerald-500/20"
            >
              <User className="h-3 w-3" />
              Client: {client.name || client.email}
              {client.companyName ? ` · ${client.companyName}` : ""}
            </Link>
          )}
          {lead && (
            <Link
              href={lead.href || `/dashboard/lead/detail/${lead._id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-xs text-sky-200 hover:bg-sky-500/20"
            >
              <ChartBar className="h-3 w-3" />
              Lead: {lead.name || lead.email}
              {lead.serialNo ? ` · ${lead.serialNo}` : ""}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
