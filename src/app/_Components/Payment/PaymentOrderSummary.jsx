import { FileText, Receipt, ShieldCheck, Tag } from "lucide-react";
import React from "react";
import DetailRow from "./DetailRow";

const currencySymbols = {
  USD: "$",
  CAD: "$",
  AUD: "$",
  EUR: "€",
};

const PaymentOrderSummary = ({
  isMasterPayemntLink,
  name,
  email,
  brand,
  currency,
  amount,
  service,
  description,
}) => {
  return (
    <>
      <section className="bg-white rounded-2xl shadow-md border border-zinc-200 overflow-visible">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-zinc-50 rounded-t-2xl border-b border-zinc-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
            <Receipt className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-black text-zinc-800 tracking-tight">
              Order Summary
            </p>
            <p className="text-[11px] text-zinc-500">
              Review your order details below
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {!isMasterPayemntLink && (
            <div className=" p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 border-b border-zinc-100">
              {/* Agar name or email null/falsy hain to component hide ho jaye ga */}
              {name && <DetailRow label="Customer" value={name} />}

              {email && (
                <DetailRow
                  label="Email"
                  value={email}
                  className="lowercase break-all"
                />
              )}

              {brand && <DetailRow label="Brand" value={brand} />}
              {currency && <DetailRow label="Currency" value={currency} />}
            </div>
          )}

          <div className={!isMasterPayemntLink ? "px-4 py-2" : "p-6"}>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              <Tag className="w-3 h-3" /> Services Provided
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(service) ? (
                service?.map((s, i) => (
                   <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize"
                    >
                      {s}
                    </span>
                 
                ))
              ) : (
                 <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize"
                    >
                  {service || "other"}
                    </span>
             
              )}
            </div>
          </div>
          {(!isMasterPayemntLink && description) && (
            <div className="px-4 py-3 border-t border-zinc-100">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-widest">
                <FileText className="w-3 h-3" /> Description
              </p>

              <p className="text-[12px] text-zinc-600 leading-relaxed whitespace-pre-wrap bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Total Display */}
        <div className="p-6 bg-zinc-900 text-white flex justify-between items-center rounded-2xl">
          <div>
            <p className="text-zinc-300 text-xs uppercase font-bold tracking-widest">
              Total Amount Due
            </p>
            <p className="text-sm text-zinc-500">Payable via PayPal or Card</p>
          </div>
          <div className="text-right">
            <span className="text-white font-extrabold text-2xl tracking-tight">
              {currencySymbols[currency] || "$"}
              {Number(amount).toFixed(2)}

              <span className="text-zinc-400 text-sm font-normal ml-1">
                {currency || "USD"}
              </span>
            </span>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
        <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
        <p className="text-xs text-emerald-800 leading-relaxed">
          Your transaction is protected by industry-standard encryption. No
          sensitive card data is stored on our servers.
        </p>
      </div>
    </>
  );
};

export default PaymentOrderSummary;
