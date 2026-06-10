import React, { memo } from 'react'
import Screen from './Screen'
import { CheckCircle2 } from 'lucide-react'
import SuccessRow from './SuccessRow'

const getCurrencyPrefix = (currency) => {
  switch (currency) {
    case "EUR":
      return "€";
    case "AED":
      return "AED ";
    case "SAR":
      return "SAR ";
    case "PKR":
      return "₨";
    default:
      return "$"; // USD, CAD, AUD
  }
};

const PaidPaymentLink = ({ currency, amount, name, email, brand,service,description }) => {
  return (
     <Screen>
         <div className="bg-white border border-zinc-200 rounded-2xl sm:p-6 p-10 max-w-md w-full text-center shadow-xl">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
             <CheckCircle2 className="w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-2xl font-bold text-zinc-800 mb-2">Payment Successful</h2>
           <p className="text-zinc-500 text-sm mb-6">
             Your payment of{" "}
            {/* <div className="mt-3 mb-6"> */}
  <span className=" text-emerald-600">
    {getCurrencyPrefix(currency)}
    {Number(amount).toFixed(2)}
  </span>
  <span className="ml-2 text-zinc-500 font-medium">
    {currency || "USD"}
  </span>
{/* </div> */}
{" "}
             has been received.
           </p>
           <div className="bg-zinc-50 border border-zinc-100 rounded-xl sm:p-2 p-4 text-left space-y-2.5 mb-5">
             <SuccessRow label="Customer" value={name} />
             <SuccessRow label="Email"    value={email} />
                          {brand && <SuccessRow label="Brand"    value={brand} /> }

             {/* <SuccessRow label="Date"     value={new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })} /> */}
          
           {/* <p className="text-zinc-400 text-xs">A confirmation has been sent to {email}</p> */}
          {(service  && service[0] === 'none brand payment')  && (
  <div className="mt-1 text-left  border-b border-zinc-100 pb-1">
    <p className="text-[11px] text-zinc-400 mb-1 uppercase tracking-wider">
      Services Provided
    </p>

    <div className="flex flex-wrap gap-2">
      {Array.isArray(service) ? (
        service.map((item, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium"
          >
            {item}
          </span>
        ))
      ) : (
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
          {service}
        </span>
      )}
    </div>
  </div>
)}
          {description && (
  <div className="mt-2 text-left">
    <p className="text-[11px] text-zinc-400 mb-1 uppercase tracking-wider">
      Description
    </p>

    <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-xl">
      <p className="text-[11px] text-zinc-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  </div>
)}
 </div>
         </div>
      </Screen> 
  )
}

export default memo(PaidPaymentLink)
