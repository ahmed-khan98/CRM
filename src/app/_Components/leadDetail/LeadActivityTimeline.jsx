"use client";

import { useMemo } from "react";
import { formatDate } from "@/app/utilities/date";
import { DollarSign, Mail, MessageSquare } from "lucide-react";
import { useLeadPaymentLinksQuery } from "@/app/_Services/paymentLink/page";
import { useLeadbyEmailQuery } from "@/app/_Services/sentEmail/page";

export default function LeadActivityTimeline({ leadId, comments = [] }) {
  const { data: paymentResp } = useLeadPaymentLinksQuery(leadId, {
    skip: !leadId,
  });
  const { data: emailResp } = useLeadbyEmailQuery(
    { id: leadId, page: 1, limit: 20 },
    { skip: !leadId },
  );

  const payments = paymentResp?.data || [];
  const emails = emailResp?.data?.items || [];

  const events = useMemo(() => {
    const rows = [];

    comments.forEach((c) => {
      rows.push({
        id: `comment-${c._id}`,
        type: "comment",
        at: c.createdAt,
        title: c.lastAction || "Comment",
        body: c.lastComment,
        by: c.userId?.fullName,
      });
    });

    emails.forEach((e) => {
      rows.push({
        id: `email-${e._id}`,
        type: "email",
        at: e.sentAt || e.createdAt,
        title: e.subject || "Email sent",
        body: e.recipients?.[0] || e.toEmail || e.email,
        by: e.senderId?.fullName,
      });
    });

    payments.forEach((p) => {
      rows.push({
        id: `pay-${p._id}`,
        type: "payment",
        at: p.createdAt,
        title: `Payment link — ${p.paymentStatus || "pending"}`,
        body: p.amount ? `${p.currency || "USD"} ${p.amount}` : p.service?.join(", "),
        by: p.agent?.fullName,
      });
    });

    return rows.sort(
      (a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime(),
    );
  }, [comments, emails, payments]);

  if (!events.length) {
    return (
      <p className="text-sm text-zinc-500 py-4 text-center">No activity yet.</p>
    );
  }

  const iconFor = (type) => {
    if (type === "email") return Mail;
    if (type === "payment") return DollarSign;
    return MessageSquare;
  };

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const Icon = iconFor(event.type);
        return (
          <div
            key={event.id}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Icon className="h-4 w-4 text-violet-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold capitalize text-white">
                  {event.title}
                </p>
                <span className="shrink-0 text-[10px] text-zinc-500">
                  {event.at ? formatDate(event.at) : ""}
                </span>
              </div>
              {event.body && (
                <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{event.body}</p>
              )}
              {event.by && (
                <p className="mt-1 text-[10px] text-zinc-500">By {event.by}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
