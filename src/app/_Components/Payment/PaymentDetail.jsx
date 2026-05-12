// "use client";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import PayPalButton from "@/app/_Components/PayPalButton";
// import { useGetPaymentLinkByIdQuery } from "@/app/_Services/paymentLink/page";
// import Image from "next/image";

// const PaymentDetail = ({ id }) => {
//   const router = useRouter();

//   const { data, error, isLoading } = useGetPaymentLinkByIdQuery({ id });

//   const handlePayPalSuccess = (paymentData) => {
//     console.log("PayPal payment successful:", paymentData);
//       router.push("/payment-success");
//   };

//   const handlePayPalError = (error) => {
//     console.error("PayPal payment error:", error);
//      router.push("/payment-failed");
//   };

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{
//             duration: 1,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "linear",
//           }}
//           className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
//         />
//         <span className="ml-4 text-gray-800 font-semibold">
//           Loading ... 🚀
//         </span>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-10 text-center text-red-600">Error fetching data.</div>
//     );
//   if (!data)
//     return (
//       <div className="p-10 text-center text-gray-600">
//         No Payment link info Found.
//       </div>
//     );

//   return (
//     <div className="min-h-screen  py-6 px-4 bg-zinc-100">
//       <div className="max-w-5xl mx-auto space-y-4">

//           <Image
//             src={data?.data?.brandId?.image || "/placeholder.svg"}
//             alt="brand-logo"
//             // fill
//             width="200"
//             height="100"
//             className="rounded object-cover p-3 m-"
//           />
//         <div className="grid lg:grid-cols-2 gap-3">
//           <div className="bg-white rounded-xl shadow-lg p-5">
//             <h2 className="text-xl font-bold text-gray-800 mb-5">
//               Here's your invoice info
//             </h2>
//             {/* (737) 336-9867 */}
//             <div className="space-y-4">
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Brand:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700 mt-1 capitalize">
//                       {data?.data?.brandId?.name}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Customer Name:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700 mt-1 capitalize">
//                       {data?.data?.name}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Customer Email:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700 mt-1 ">
//                       {data?.data?.email}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Services:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700">
//                       {Array.isArray(data?.data?.service) ? (
//                         data?.data?.service.length > 0 ? (
//                           data?.data?.service.map((tagItem, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center m-0.5 gap-0.5 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize whitespace-nowrap "
//                             >
//                               {tagItem}
//                             </span>
//                           ))
//                         ) : (
//                           <span className="text-[12px] text-gray-600">
//                             No Service
//                           </span>
//                         )
//                       ) : (
//                         <span className="capitalize inline-flex items-center m-0.5 gap-0.5 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                           {data?.data?.service || "No Service"}
//                         </span>
//                       )}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Currency:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700 mt-1 ">
//                       {data?.data?.currency}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-b border-gray-200 ">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h6 className="font-medium text-sm  text-gray-800">
//                       Amount:
//                     </h6>
//                   </div>
//                   <div className="text-right ml-2">
//                     <p className="text-sm text-zinc-700 mt-1 ">
//                       {Math.round(data?.data?.amount * 100) / 100}
//                     </p>
//                     {/* <span className="text-2xl font-bold text-gray-800">
//                         ${Math.round(amount * 100) / 100}
//                       </span> */}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-2">
//                 <div className="flex justify-between items-center">
//                   <span className="font-semibold text-gray-800">
//                     Total Amount
//                   </span>
//                   <span className="text-xl font-semibold text-zinc-800">
//                     ${Math.round(data?.data?.amount * 100) / 100}
//                   </span>
//                 </div>
//               </div>

//               {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <div className="flex items-start">
//                   <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
//                   <div>
//                     <p className="text-xs text-blue-700">
//                       <strong>Secure Payment:</strong> All payments are
//                       processed securely. Your payment information is encrypted
//                       and protected.
//                     </p>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Choose a way to Pay
//             </h2>
//             <PayPalButton
//               id={data?.data?._id}
//               paypalClientId={data?.data?.paypalClientId}
//               // amount={Math.round(amount * 100) / 100}
//               onSuccess={handlePayPalSuccess}
//               onError={handlePayPalError}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default PaymentDetail;

import ErrorState from "./ErrorState";
import PayPalClientWrapper from "./PaypalClientWrapper";
import PaidPaymentLink from "./PaidPaymentLink";
import PaymentOrderSummary from "./PaymentOrderSummary";
import PaymentPagHeader from "./PaymentPagHeader";


async function getPaymentData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}paymentLink/${id}`, {
    cache: 'no-store' // Taake hamesha fresh data aaye
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data;
}

const PaymentDetail = async({ id }) => {
  // const { data, error, isLoading } = useGetPaymentLinkByIdQuery({ id });


  const paymentData = await getPaymentData(id);

  // if (isLoading) return <LoadingState />;
  if (!paymentData)
    return <ErrorState message={error ? "Link Expired" : "Not Found"} />;

  if (paymentData?.paymentStatus === "paid")
    return (
      <PaidPaymentLink
        currency={paymentData?.currency}
        amount={paymentData?.amount}
        name={paymentData?.name}
        email={paymentData?.email}
        brand={paymentData?.brandId?.name}
      />
    );

  return (
    <div className="min-h-screen bg-zinc-100  font-sans text-slate-900">
      {/* Top Brand Bar */}
      <PaymentPagHeader image={paymentData?.brandId?.image} />

      <main className="max-w-5xl mx-auto px-4  overflow-visible">
        <div className="grid lg:grid-cols-12 gap-6 items-start relative h-[calc(100vh-80px)]">
          {/* LEFT: Invoice Summary */}
          <div className="lg:col-span-7 lg:h-full lg:overflow-y-hidden space-y-6">
            <PaymentOrderSummary
              name={paymentData?.name}
              email={paymentData?.email}
              brand={paymentData?.brandId?.name}
              currency={paymentData?.currency}
              amount={paymentData?.amount}
              service={paymentData?.service}
            />

            <div className="block lg:hidden">
              <PayPalClientWrapper
                id={paymentData?._id}
                paypalClientId={paymentData?.paypalClientId}
              />
            </div>
          </div>
          {/* RIGHT: Payment Options */}
<aside className="hidden lg:flex lg:col-span-5 flex-col sticky top-6 h-[calc(100vh-40px)]">
  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar cursor-pointer">
                <PayPalClientWrapper
              id={paymentData?._id}
              paypalClientId={paymentData?.paypalClientId}
            />
            {/* <div className="h-10"></div> */}
  </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentDetail;
