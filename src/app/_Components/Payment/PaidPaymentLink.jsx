import React, { memo } from 'react'
import Screen from './Screen'
import { CheckCircle2 } from 'lucide-react'
import SuccessRow from './SuccessRow'

const PaidPaymentLink = ({ currency, amount, name, email, brand }) => {
  return (
     <Screen>
         <div className="bg-white border border-zinc-200 rounded-2xl sm:p-6 p-10 max-w-md w-full text-center shadow-xl">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
             <CheckCircle2 className="w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-2xl font-bold text-zinc-800 mb-2">Payment Successful</h2>
           <p className="text-zinc-500 text-sm mb-6">
             Your payment of{" "}
             <span className="text-emerald-600 font-semibold">
               ${Number(amount).toFixed(2)} {currency}
             </span>{" "}
             has been received.
           </p>
           <div className="bg-zinc-50 border border-zinc-100 rounded-xl sm:p-2 p-4 text-left space-y-2.5 mb-5">
             <SuccessRow label="Customer" value={name} />
             <SuccessRow label="Email"    value={email} />
             <SuccessRow label="Brand"    value={brand} />
             {/* <SuccessRow label="Date"     value={new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })} /> */}
           </div>
           {/* <p className="text-zinc-400 text-xs">A confirmation has been sent to {email}</p> */}
         </div>
      </Screen> 
  )
}

export default memo(PaidPaymentLink)
