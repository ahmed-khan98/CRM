"use client";
import { useRouter } from "next/navigation";
import PayPalButton from "./PayPalButton";
import { CreditCard } from "lucide-react";

export default function PayPalClientWrapper({ id, paypalClientId,brandParam }) {
  const router = useRouter();

  const handleSuccess = () => router.push("/payment-success");
  const handleError = () => router.push("/payment-failed");

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
      <div className="mb-8 text-center">
        <div className="inline-flex p-3 bg-zinc-100 rounded-2xl mb-2">
          <CreditCard size={32} className="text-zinc-800" />
        </div>
        <h3 className="text-xl font-bold">Complete Your Payment</h3>
        <p className="text-slate-500 text-sm mt-1">
          Select your preferred payment method
        </p>
      </div>

      <div className="space-y-4">
        <PayPalButton
          id={id}
          paypalClientId={paypalClientId}
          onSuccess={handleSuccess}
          onError={handleError}
          brandParam={brandParam}
        />
      </div>
    </div>
  );
}
