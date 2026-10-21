"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TableLoader from "@/app/_Components/Loaders/TableLoader";
import { currencySymbols } from "@/app/utilities/currencyType";

/* ── helpers ── */
const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });
};

const getCurrencySymbol = (currency) => {
  const code = currency?.toString().trim().toUpperCase();
  return currencySymbols[code] || code || "$";
};

const formatCurrencyAmount = (amount, currency) => {
  const value = Number(amount || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

  return `${getCurrencySymbol(currency)} ${value}`;
};

/* ── Status badge styles ── */
const getStatusStyle = (status) => {
  if (!status)
    return {
      pill: "bg-zinc-50/10 text-zinc-400 border-zinc-200",
      dot: "bg-zinc-400",
    };
  const s = status.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (s === "paid")
    return {
      pill: "bg-success/10 text-emerald-700 border-emerald-500/20",
      dot: "bg-emerald-500",
    };
  if (s === "charge back" || s === "refund")
    return {
      pill: "bg-danger/10 text-rose-600 border-rose-200",
      dot: "bg-red-400",
    };
  if (s === "fresh")
    return {
      pill: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      dot: "bg-sky-400",
    };
  if (s === "up sell" || s === "upsell")
    return {
      pill: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      dot: "bg-purple-400",
    };
  return {
    pill: "bg-zinc-50/10 text-zinc-400 border-zinc-200",
    dot: "bg-zinc-400",
  };
};

const HEADERS = [
  { key: "client", label: "Client", w: "min-w-[100px]" },
  { key: "dept_brand", label: "Dept / Brand", w: "min-w-[120px]" },
  { key: "type", label: "Type", w: "min-w-[60px]" },
  { key: "seller", label: "Seller / Agent", w: "min-w-[130px]" },
  { key: "amount", label: "Amount", w: "min-w-[80px]" },
  { key: "status", label: "Status", w: "min-w-[60px]" },
  { key: "merchant", label: "Merchant", w: "min-w-[180px]" },
  // { key: "month", label: "Month", w: "min-w-[100px]" },
  // { key: "saleDate", label: "Sale Date", w: "min-w-[80px]" },
  { key: "actions", label: "", w: "w-10" },
];

/* ── Stats Bar ── */
function StatsBar({ rows }) {
  const total = rows.length;
  const paid = rows.filter((r) => r?.status?.toLowerCase() === "paid").length;
  const revenue = rows
    .filter((r) => r?.status?.toLowerCase() === "paid")
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const paidCurrencies = [
    ...new Set(
      rows
        .filter((r) => r?.status?.toLowerCase() === "paid")
        .map((r) => r?.currency?.toString().trim().toUpperCase())
        .filter(Boolean),
    ),
  ];
  const revenueCurrency =
    paidCurrencies.length === 1
      ? paidCurrencies[0]
      : paidCurrencies.length
        ? "Mixed"
        : "USD";
  const chargebacks = rows.filter(
    (r) => r?.status?.toLowerCase() === "charge back",
  ).length;

  const stats = [
    { label: "Total Sales", value: total, color: "text-zinc-100" },
    { label: "Paid", value: paid, color: "text-emerald-700" },
    { label: "Charge Backs", value: chargebacks, color: "text-rose-600" },
    {
      label: "Revenue",
      value:
        revenueCurrency === "Mixed"
          ? `${revenue.toLocaleString()} Mixed`
          : formatCurrencyAmount(revenue, revenueCurrency),
      color: "text-zinc-900",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2 border-b border-zinc-700/60">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
            {s.label}
          </span>
          <span className={`text-[13px] font-black ${s.color}`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-700/60">
      <p className="text-[11px] text-zinc-500">
        <span className="font-bold text-zinc-300">
          {from}–{to}
        </span>{" "}
        of <span className="font-bold text-zinc-300">{total}</span> records
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="cursor-pointer p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={13} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              p === page
                ? "bg-ink text-white shadow-lg shadow-black/30"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="cursor-pointer p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Single Row ── */
function SaleRow({ emp, index, onEdit, onDelete }) {
  const statusStyle = getStatusStyle(emp?.status);
  const typeStyle = getStatusStyle(emp?.type);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
      className="group border-b border-zinc-700/60 hover:bg-zinc-800/30 transition-colors"
    >
      {/* Client */}
      <td className="px-4 py-2 min-w-[100px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-semibold text-zinc-100 capitalize truncate max-w-[135px]">
            {emp?.clientId?.name || "—"}
          </span>
          <span className="text-[10px] text-zinc-500 truncate max-w-[135px]">
            {emp?.clientId?.email || "—"}
          </span>
          {emp?.clientId?.companyName && (
            <span className="text-[10px] text-zinc-500 truncate max-w-[135px]">
              {emp.clientId.companyName}
            </span>
          )}
        </div>
      </td>

      {/* Dept / Brand */}
      <td className="px-1 py-2 min-w-[120px]">
        <div className="flex flex-col gap-1">
          {emp?.departmentId?.name ? (
            <span className="inline-flex items-center rounded-full border border-zinc-600/40 bg-zinc-800/60 px-3 py-1 text-xs font-normal capitalize text-zinc-300 w-fit">
              {emp.departmentId.name}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500">No dept</span>
          )}
          {emp?.brandId?.name ? (
            <span className="inline-flex items-center rounded-full border border-zinc-600/40 bg-zinc-800/60 px-3 py-1 text-xs font-normal capitalize text-zinc-300 w-fit">
              {emp.brandId.name}
            </span>
          ) : null}
        </div>
      </td>

      {/* Type */}
      <td className="px-2 py-2 min-w-[60px]">
        {emp?.type ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-normal whitespace-nowrap ${typeStyle.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
            {emp.type}
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500">—</span>
        )}
      </td>

      {/* Seller / Agent */}
      <td className="px-4 py-2 min-w-[160px]">
        <div className="flex flex-col gap-0.5">
          {emp?.seller?.fullName ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                Seller
              </span>
              <span className="text-[11px] text-zinc-300 font-medium capitalize">
                {emp.seller.fullName}
              </span>
            </div>
          ) : null}
          {emp?.agent?.fullName ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                Agent
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">
                {emp.agent.fullName}
              </span>
            </div>
          ) : null}
          {!emp?.seller?.fullName && !emp?.agent?.fullName && (
            <span className="text-[11px] text-zinc-500">—</span>
          )}
        </div>
      </td>

      {/* Amount — same chrome as payment-link LinkRow */}
      <td className="px-2 py-2 min-w-[60px]">
        <span className="inline-flex items-center rounded-full border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs font-medium whitespace-nowrap text-zinc-100">
          {getCurrencySymbol(emp?.currency)}
          {Number(emp?.amount || 0).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </span>
      </td>

      <td className="px-2 py-2 min-w-[60px]">
        <div className="flex flex-col items-start gap-0.5">
          {emp?.status ? (
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap ${statusStyle.pill}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">—</span>
          )}
          <p className="text-[10px] text-zinc-500 whitespace-nowrap">
            {emp?.saleDate ? formatDate(emp.saleDate) : "—"}
          </p>
        </div>
      </td>

      {/* Merchant */}
      <td className="px-2 py-2 min-w-[180px]">
        {emp?.merchantType ? (
          <span className="inline-flex items-center rounded-full border border-zinc-700/30 bg-zinc-800/40 px-2 py-1 text-xs font-medium text-zinc-300">
            {emp.merchantType}
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500">—</span>
        )}
      </td>

      {/* Month */}
      {/* <td className="px-2 py-2 min-w-[100px]">
        {emp?.monthId?.monthCode ? (
          <span className="inline-flex items-center rounded-full border border-zinc-600/40 bg-zinc-800/60 px-2 py-1 text-xs font-normal text-zinc-300">
            {emp.monthId.monthCode}
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500">—</span>
        )}
      </td> */}

      {/* Status */}
     

   

      {/* Actions */}
      <td className="px-2 py-2 sticky right-0 bg-ink md:border-l md:border-zinc-700/60  group-hover:bg-zinc-800/80 transition-colors">
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onEdit && onEdit(emp)}
            className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
          >
            <Edit className="h-3 w-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onDelete && onDelete(emp._id)}
            className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg bg-danger/10 border border-rose-200 text-rose-600 hover:bg-danger/20 transition-all"
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ═══════════════════ MAIN EXPORT ═══════════════════ */
export default function SalesTable({ data = [], onEdit, onDelete, isLoading }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PER_PAGE = 10;

  const filtered = data.filter(
    (r) =>
      !search ||
      r?.clientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r?.clientId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r?.departmentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r?.brandId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (isLoading) {
    return <TableLoader dark title="Loading sales" rows={6} />;
  }

  return (
    <div className="crm-table-wrap -mx-1 md:mx-0">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-zinc-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-zinc-100 leading-none">
              Sales
            </h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {filtered.length} records
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search client, brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-7 pr-3 py-1.5 text-[11px] bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-all w-48"
          />
        </div>
      </div>

      {/* Stats */}
      <StatsBar rows={data} />

      {/* Table — same dual-axis scroll as employee DataTable */}
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 220px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#52525b transparent",
        }}
      >
        <table className="crm-table text-left border-collapse"
          style={{ minWidth: "1100px", width: "100%" }}
        >
          <thead className="sticky top-0 z-20">
            <tr className="bg-ink backdrop-blur-sm border-b border-zinc-700/80">
              {HEADERS.map((h) => (
                <th
                  key={h.key}
                  className={`px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-[0.12em] whitespace-nowrap ${h.w} ${
                    h.key === "actions"
                      ? "sticky right-0 bg-ink md:border-l md:border-zinc-700/60"
                      : ""
                  }`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {paged.length > 0 ? (
                paged.map((emp, i) => (
                  <SaleRow
                    key={emp?._id}
                    emp={emp}
                    index={i}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={HEADERS.length} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-400">
                          No sales found
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {search
                            ? "Try adjusting your search"
                            : "No sales recorded yet"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Pagination
        total={filtered.length}
        page={page}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}
