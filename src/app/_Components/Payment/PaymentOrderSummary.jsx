import { Info, ShieldCheck } from 'lucide-react'
import React from 'react'
import DetailRow from './DetailRow'

const currencySymbols = {
  USD: "$",
  CAD: "$",
  AUD: "$",
  EUR: "€"
};

const PaymentOrderSummary = ({name, email, brand, currency, amount, service}) => {
  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-visible">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Info size={20} className="text-zinc-600" /> Order Summary
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {name &&
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
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
          </div>}

          <div className={name ? "pt-4" : "pt-1"}>
            <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Services Provided
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(service) ? (
                service?.map((s, i) => (
                  <span
                    key={s}
                    className="text-[12px] px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-full capitalize font-medium"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium">
                  {service || "other"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Display */}
        <div className="p-6 bg-zinc-900 text-white flex justify-between items-center rounded-2xl">
          <div>
            <p className="text-zinc-300 text-xs uppercase font-bold tracking-widest">
              Total Amount Due
            </p>
            <p className="text-sm text-zinc-500">
              Payable via PayPal or Card
            </p>
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

      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
        <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
        <p className="text-xs text-emerald-800 leading-relaxed">
          Your transaction is protected by industry-standard encryption.
          No sensitive card data is stored on our servers.
        </p>
      </div>
    </>
  )
}

export default PaymentOrderSummary