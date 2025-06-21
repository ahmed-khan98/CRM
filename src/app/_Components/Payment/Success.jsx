"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentSuccessMutation } from "@/app/_Services/payment/page";
import { BiCheckCircle } from "react-icons/bi";

const PaymentSuccessComponent = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const status = searchParams.get("status");
  const router = useRouter();
  console.log(status,'----status')
  const [paymentSuccess] = usePaymentSuccessMutation();

  useEffect(() => {
    if (session_id) {
      paymentSuccess({ session_id,status });
    }
  }, [session_id, paymentSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <BiCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Your payment was successful
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for your payment. We will <br />
          be in contact with more details shortly.
        </p>

        <button
          onClick={() => router.push("/dashboard/wishlist")}
          className="cursor-pointer mt-6 px-6 py-2 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
};

export default function Success() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessComponent />
    </Suspense>
  );
}
