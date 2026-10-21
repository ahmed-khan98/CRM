"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Mail,
  Phone,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import Badge from "@/app/_Components/ui/saas/Badge";
import { useGetClientQuery } from "@/app/_Services/Client/page";
import { useClientActivityQuery } from "@/app/_Services/paymentLink/page";
import { formatDate } from "@/app/utilities/date";

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "paid" || value === "completed" || value === "success") {
    return "success";
  }
  if (value === "pending" || value === "processing") {
    return "warning";
  }
  if (
    value === "failed" ||
    value === "cancelled" ||
    value === "canceled" ||
    value === "charge back"
  ) {
    return "error";
  }
  return "neutral";
}

function isPaidStatus(status) {
  const value = String(status || "").toLowerCase();
  return value === "paid" || value === "completed" || value === "success";
}

function isPendingStatus(status) {
  const value = String(status || "").toLowerCase();
  return value === "pending" || value === "processing";
}

function parseAmount(value) {
  if (value == null || value === "") return 0;
  const n = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatSaleType(type) {
  const value = String(type || "").toUpperCase().replace(/\s+/g, " ").trim();
  if (value === "UP SELL" || value === "UPSELL") return "UPSELL";
  if (value === "FRESH") return "FRESH";
  return type || "—";
}

function saleTypeTone(type) {
  const label = formatSaleType(type);
  if (label === "FRESH") return "info"; // blue
  if (label === "UPSELL") return "purple";
  return "neutral";
}

function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <Badge tone={statusTone(status)} className="capitalize">
      {status}
    </Badge>
  );
}

function InfoTile({ icon: Icon, label, value, href, highlight }) {
  const content = value || "—";
  return (
    <div
      className={`rounded-2xl border p-3.5 ${
        highlight
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-zinc-800 bg-[#050505]"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${
          highlight ? "text-emerald-400" : "text-zinc-500"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      {href && value ? (
        <a
          href={href}
          className="break-all text-sm font-semibold text-zinc-100 hover:text-white"
        >
          {content}
        </a>
      ) : (
        <p
          className={`break-all text-sm font-semibold ${
            highlight ? "text-emerald-400" : "capitalize text-zinc-100"
          }`}
        >
          {content}
        </p>
      )}
    </div>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useGetClientQuery(id);
  const { data: activityData, isLoading: activityLoading } =
    useClientActivityQuery(id, { skip: !id });

  const client = data?.data;
  const sales = activityData?.data?.sales || [];

  const timeline = useMemo(
    () =>
      [...sales]
        .map((row) => ({
          ...row,
          _at: row.saleDate || row.createdAt,
          _status: row.status || "paid",
          _type: formatSaleType(row.type),
          _seller:
            row.seller?.fullName ||
            row.agent?.fullName ||
            null,
        }))
        .sort(
          (a, b) =>
            new Date(b._at || 0).getTime() - new Date(a._at || 0).getTime(),
        ),
    [sales],
  );

  const totalPaidAmount = useMemo(
    () =>
      timeline
        .filter((row) => isPaidStatus(row._status))
        .reduce((sum, row) => sum + parseAmount(row.amount), 0),
    [timeline],
  );

  const filteredTimeline = useMemo(() => {
    if (statusFilter === "paid") {
      return timeline.filter((row) => isPaidStatus(row._status));
    }
    if (statusFilter === "pending") {
      return timeline.filter((row) => isPendingStatus(row._status));
    }
    return timeline;
  }, [timeline, statusFilter]);

  const paidCount = timeline.filter((row) => isPaidStatus(row._status)).length;
  const pendingCount = timeline.filter((row) =>
    isPendingStatus(row._status),
  ).length;

  if (isLoading) {
    return (
      <PageLoader title="Loading client" subtitle="Fetching client profile..." />
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center text-zinc-500">Client not found.</div>
    );
  }

  const handledByName =
    client.handleBy?.fullName ||
    (typeof client.handleBy === "string" ? null : client.handleBy?.name);

  return (
    <div className="mx-1 space-y-4 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#050505] shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/[0.02]" />
        <div className="relative border-b border-zinc-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/client")}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to clients
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-100">
                <User className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-zinc-100 capitalize sm:text-2xl">
                    {client.name}
                  </h1>
                  {client.signupType && (
                    <Badge tone="info" className="capitalize">
                      {client.signupType}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  Client profile & sales activity
                </p>
              </div>
            </div>

            {(client.brandId?.name || client.departmentId?.name) && (
              <div className="flex flex-wrap gap-1.5">
                {client.brandId?.name && (
                  <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/15 px-2 py-1 text-xs font-medium uppercase tracking-wider text-sky-300">
                    {client.brandId.name}
                  </span>
                )}
                {client.departmentId?.name && (
                  <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-1 text-xs font-medium uppercase tracking-wider text-purple-300">
                    {client.departmentId.name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-5">
          <InfoTile
            icon={Mail}
            label="Email"
            value={client.email}
            href={client.email ? `mailto:${client.email}` : undefined}
          />
          <InfoTile
            icon={Phone}
            label="Phone"
            value={client.phoneNo}
            href={client.phoneNo ? `tel:${client.phoneNo}` : undefined}
          />
          <InfoTile
            icon={Building2}
            label="Company"
            value={client.companyName || "No company"}
          />
          <InfoTile icon={Users} label="Handled by" value={handledByName} />
          <InfoTile
            icon={DollarSign}
            label="Total paid"
            value={formatMoney(totalPaidAmount)}
            highlight
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[#050505] p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-200">
              Sales timeline
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Sales recorded for this client
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-zinc-700 bg-zinc-900/80 p-1">
              {[
                { key: "all", label: `All (${timeline.length})` },
                { key: "paid", label: `Paid (${paidCount})` },
                { key: "pending", label: `Pending (${pendingCount})` },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStatusFilter(item.key)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                    statusFilter === item.key
                      ? item.key === "paid"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : item.key === "pending"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-zinc-700 text-white shadow-sm"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {!activityLoading && filteredTimeline.length > 0 && (
              <Badge tone="neutral">{filteredTimeline.length} sales</Badge>
            )}
          </div>
        </div>

        {activityLoading ? (
          <p className="text-sm text-zinc-500">Loading sales...</p>
        ) : filteredTimeline.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-zinc-400">
              {timeline.length === 0
                ? "No sales yet"
                : `No ${statusFilter} sales found`}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {timeline.length === 0
                ? "Sales will appear here once recorded"
                : "Try switching the filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTimeline.map((row) => (
              <div
                key={row._id}
                className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3.5 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15">
                  <TrendingUp className="h-4 w-4 text-sky-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-100">Sale</p>
                    <Badge tone={saleTypeTone(row._type)}>{row._type}</Badge>
                    <StatusBadge status={row._status} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {row._at ? formatDate(row._at) : "—"}
                    {row.amount != null && row.amount !== ""
                      ? ` · ${formatMoney(parseAmount(row.amount), row.currency)}`
                      : ""}
                    {` · Seller: ${row._seller || "—"}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
