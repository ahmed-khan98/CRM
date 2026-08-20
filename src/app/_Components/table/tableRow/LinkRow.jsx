import React, { memo, useState } from "react";
import { formatDate } from "@/app/utilities/date";
import { useUpdatePaymentStatusMutation } from "@/app/_Services/paymentLink/page";
import toast from "react-hot-toast";
import RowMenu from "../../Payment/RowMenu";
import { currencySymbols } from "@/app/utilities/currencyType";
import Tooltip from "@/app/_Components/ui/Tooltip";

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-zinc-100 text-zinc-500 border-zinc-200",
};


export const LinkRow = memo(
  function LeadRow({ emp, setConfirmDelete, refetchAll }) {
    const [updatePaymentStatus, { isLoading: isUpdatingStatus }] =
      useUpdatePaymentStatusMutation();

    const [isCopied, setIsCopied] = useState(false);

    // ── isEnabled state ──
    const [isEnabled, setIsEnabled] = useState(
      emp?.isActive === undefined ||
        emp?.isActive === null ||
        emp?.isActive === true ||
        emp?.isActive === "true" ||
        emp?.isActive === "enabled" ||
        emp?.isActive === "active",
    );

    const onCopy = (payId) => {
      if (!payId) return;
      const baseUrl = "https://customer-payment-link.vercel.app/";
      const fullUrl = `${baseUrl}${payId}`;
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3000);
        })
        .catch((err) => console.error("Failed to copy URL: ", err));
    };

    // ── Toggle enable/disable ──
    const handleToggle = () => {
      const newVal = !isEnabled;
      setIsEnabled(newVal);
      handleStatus(emp?._id); // calls your existing API
    };

    const handleStatus = async (id) => {
      try {
        const response = await updatePaymentStatus({ id }).unwrap();
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message || "Failed to change status");
        }
        refetchAll();
      } catch (error) {
        console.error("Error updating payment status:", error);
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          error?.data?.message ||
          "Failed to update payment status";
        toast.error(msg);
        // revert optimistic toggle on error
        setIsEnabled((prev) => !prev);
      }
    };

    const statusStyle =
      STATUS_STYLES[emp?.paymentStatus] ??
      "bg-zinc-100 text-zinc-500 border-zinc-200";
    const sym = currencySymbols[emp?.currency] || emp?.currency || "$";

    // ── Row background ──
    const rowBg = !isEnabled ? "bg-gray-200" : "bg-white";

    return (
      <tr
        className={`group border-b border-zinc-100 transition-colors ${rowBg} hover:brightness-95`}
      >
        {/* Customer */}
        <td className="px-2 py-2.5 min-w-[150px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-semibold text-zinc-600 capitalize truncate max-w-[135px]">
              {emp?.clientId?.name || emp?.name || "Master Link"}
            </span>
            <span className="text-[11px] text-zinc-600 truncate max-w-[160px]">
              {emp?.clientId?.email || emp?.email || "—"}
            </span>
            <span className="text-[10px] text-zinc-600 truncate max-w-[160px]">
              {emp?.clientId?.phoneNo || emp?.phoneNo || "-"}
            </span>
          </div>
        </td>

        {/* Brand */}
        <td className="px-1 py-2.5 min-w-[120px]">
          <Tooltip
            label={emp?.brandId?.name}
            side="top"
            className="max-w-full"
            delay
          >
            <p className="text-[11px] text-zinc-700 font-medium capitalize truncate max-w-[130px]">
              {emp?.brandId?.name || "No Brand"}
            </p>
          </Tooltip>
        </td>

        {/* Services */}
        <td className="px-1 py-2.5 min-w-[160px]">
          <div className="flex flex-wrap gap-1 max-w-[155px]">
            {Array.isArray(emp?.service) && emp.service.length > 0 ? (
              <>
                {emp.service.slice(0, 2).map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-medium capitalize whitespace-nowrap"
                  >
                    {s}
                  </span>
                ))}
                {emp.service.length > 2 && (
                  <span className="inline-flex px-1.5 py-0.5 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-full text-[10px] font-medium">
                    +{emp.service.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-zinc-400">No service</span>
            )}
          </div>
        </td>

        {/* Merchant */}
        <td className="px-1 py-2.5 min-w-[100px]">
          <p className="text-[11px] text-zinc-600 truncate max-w-[95px]">
            {emp?.merchantType || "—"}
          </p>
        </td>

        {/* Sale Type */}
        <td className="px-1 py-2.5 min-w-[90px]">
          {emp?.type ? (
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${
                emp.type === "UP SELL"
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-sky-50 text-sky-700 border-sky-200"
              }`}
            >
              {emp.type}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-400">—</span>
          )}
        </td>

        {/* Status */}
        <td className="px-1 py-2.5 min-w-[80px]">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${statusStyle}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {emp?.paymentStatus
              ? emp.paymentStatus.charAt(0).toUpperCase() +
                emp.paymentStatus.slice(1)
              : "—"}
          </span>
        </td>

        {/* Amount */}
        <td className="px-1 py-2.5 min-w-[60px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[12px] font-bold bg-zinc-800 text-white whitespace-nowrap">
            {sym}
            {emp?.amount?.toLocaleString() ?? "0"}
          </span>
        </td>

        {/* Created */}
        <td className="px-1 py-2.5 min-w-[100px]">
          <p className="text-[11px] text-zinc-400 whitespace-nowrap">
            {formatDate(emp?.createdAt)}
          </p>
        </td>

        {/* Updated */}
        <td className="px-1 py-2.5 min-w-[100px]">
          <p className="text-[11px] text-zinc-400 whitespace-nowrap text-center">
            {emp?.paidAt ? formatDate(emp?.paidAt) : "-"}
          </p>
        </td>

        {/* Actions — sticky right */}
        <td
          className={`px-2 py-2.5 sticky right-0 transition-colors md:border-l md:border-zinc-100 w-10 ${rowBg}`}
        >
          <RowMenu
            emp={emp}
            isCopied={isCopied}
            onCopy={onCopy}
            onDelete={(id) => setConfirmDelete(id)}
            isEnabled={isEnabled}
            onToggle={handleToggle}
          />
        </td>
      </tr>
    );
  },
  (prev, next) => prev.emp === next.emp,
);
