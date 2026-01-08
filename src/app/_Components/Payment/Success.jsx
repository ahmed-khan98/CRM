"use client";

import { BiCheckCircle } from "react-icons/bi";
import { Check } from "lucide-react"
import { useEffect, useState } from "react";

 const Success = () => {
     const [currentDateTime, setCurrentDateTime] = useState("")

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    setCurrentDateTime(`${formattedDate}, ${formattedTime}`)
  }, [])

   return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
     <div className="w-full max-w-md p-4">
        {/* Success Icon with Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2 animate-bounce-in">
              <Check className="w-16 h-16 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up border border-gray-100">
          {/* Headline */}
          <h1 className="text-3xl font-bold text-center text-gray-900 my-4 text-balance">Payment Successful! 🎉</h1>

          {/* Subheading */}
          <p className="text-center text-gray-600 my-8 text-pretty">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>

          {/* Payment Details */}
          {/* <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
              <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">Transaction ID</span>
                <span className="text-gray-900 font-mono font-semibold text-sm">#TXN-20250108</span>
              </div>
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">Amount Paid</span>
                <span className="text-emerald-600 font-bold text-lg">$99.99 USD</span>
              </div> 
               <div className="" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">Date</span>
                <span className="text-gray-900 font-semibold text-sm">{currentDateTime || "Loading..."}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">Status</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                  <Check className="w-4 h-4" />
                  Completed
                </span>
              </div>
            </div>
          </div> */}


        </div>

      </div>
    </div>
  );
};

export default Success

// export default function Success() {
  //   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <PaymentSuccessComponent />
//     </Suspense>
//   );
// }

// const searchParams = useSearchParams();
// const session_id = searchParams.get("session_id");
// const status = searchParams.get("status");
// const type = searchParams.get("type");
// const router = useRouter();
// console.log(status,'----status')
// const [paymentSuccess] = usePaymentSuccessMutation();

// useEffect(() => {
//   if (session_id) {
//     paymentSuccess({ session_id,status,type });
//   }
// }, [session_id, paymentSuccess]);
