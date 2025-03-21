"use client";
import React, { useEffect, Suspense } from "react";
import { usePaymentfaildMutation } from "@/app/_Services/payment/page";
import { useSearchParams, useRouter } from "next/navigation";
import { BiErrorCircle } from "react-icons/bi";

const PaymentFailComponent = () => {
  const searchParams = useSearchParams();  
  const session_id = searchParams.get("session_id");  
  const router = useRouter();

  const [paymentfaild] = usePaymentfaildMutation();

  useEffect(() => {
    if (session_id) {
      paymentfaild({ session_id });
    }
  }, [session_id, paymentfaild]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full border-b-4 border-red-500 max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <BiErrorCircle className="text-red-500 text-7xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">Your payment failed</h2>
        <p className="text-gray-600 mt-2">Try again later</p>

        <button
          onClick={() => router.push("/dashboard/wonitem")}
          className="cursor-pointer mt-6 px-6 py-2 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
};

export default function Faild() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailComponent />
    </Suspense>
  );
}
