import React, { memo } from "react";
import Screen from "./Screen";
import { CheckCircle2, User, Mail, Building2, Tag, FileText, Download } from "lucide-react";
import SuccessRow from "./SuccessRow";

const getCurrencyPrefix = (currency) => {
  switch (currency) {
    case "EUR": return "€";
    case "AED": return "AED ";
    case "SAR": return "SAR ";
    case "PKR": return "₨";
    default:    return "$";
  }
};

const PaidPaymentLink = ({ isMasterPayemntLink,currency, amount, name, email, brand, service, description }) => {
  const sym      = getCurrencyPrefix(currency);
  const services = Array.isArray(service) ? service : service ? [service] : [];
  return (
    <Screen>
      <div className="max-w-md w-full">

        {/* ── Success card ── */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Green top banner */}
          <div className="bg-emerald-600 px-6 pt-5 pb-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mb-1">
              Payment Successful
            </h2>
            <p className="text-emerald-100 text-[12px]">
              Your payment has been received and confirmed
            </p>
          </div>

          {/* Amount pill — overlapping banner and card */}
          <div className="flex justify-center -mt-5 mb-1 px-6">
            <div className="bg-white border border-zinc-200 shadow-md rounded-full px-6 py-2 flex items-baseline gap-1.5">
              <span className="text-zinc-400 text-sm font-bold">{sym}</span>
              <span className="text-zinc-900 font-black text-2xl tracking-tight">
                {Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-zinc-400 text-[11px] font-bold uppercase ml-1">
                {currency || "USD"}
              </span>
            </div>
          </div>

        
          {/* Details */}
          <div className="px-5 pb-5 space-y-0">

            {/* Customer info */}
            <div className="border border-zinc-100 rounded-xl overflow-hidden divide-y divide-zinc-100">
              {(!isMasterPayemntLink && name) && (
              <SuccessRow icon={User} label="Customer Name" value={name} />
              )}
              {(!isMasterPayemntLink && email) && (
              <SuccessRow icon={Mail} label="Email" value={email} />
              )}
              {brand && (
              <SuccessRow icon={Building2} label="Brand" value={brand} />
              )}
            </div>

            {/* Services */}
            {services.length > 0 && (
              <div className="pt-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  <Tag className="w-3 h-3" /> Services Provided
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {services.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {(!isMasterPayemntLink && description) && (
              <div className="pt-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  <FileText className="w-3 h-3" /> Description
                </p>
                <div className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <p className="text-[12px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </div>

        
        </div>

      </div>
    </Screen>
  );
};

export default memo(PaidPaymentLink);