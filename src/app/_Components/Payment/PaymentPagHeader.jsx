import { ShieldCheck } from 'lucide-react'
import React, { memo } from 'react'
import Image from "next/image";


const PaymentPagHeader = ({ image }) => {
  return (
    <div className="bg-white border-b border-slate-200 py-2.5 px-6 mb-6">
           <div className="max-w-5xl mx-auto flex justify-between items-center">
             <Image
               src={image || "/placeholder.svg"}
               alt="logo"
               width={140}
               height={45}
               className="object-contain h-10 w-auto"
             />
             <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
               <ShieldCheck size={18} className="text-emerald-500" />
               Secure Checkout
             </div>
           </div>
         </div>
  )
}

export default memo(PaymentPagHeader)
