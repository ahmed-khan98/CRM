"use client";
import { useRouter } from "next/navigation";
import StripeButton from "./StripeButton";
import { CreditCard, Lock, Zap } from "lucide-react";

export default function StripeClientWrapper({
  id,
  stripePublishableKey,
  currency,
}) {
  const router = useRouter();

  const handleSuccess = () => router.push("/payment-success");
  const handleError = () => router.push("/payment-failed");

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-[13px] font-black text-zinc-900 tracking-tight">
            Complete Your Payment
          </h3>
          <p className="text-[11px] text-zinc-400">
            Pay securely with your card via Stripe
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 px-2 py-4 border-b border-zinc-200 bg-zinc-50/50">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          <Lock className="w-3 h-3 text-emerald-700" />
          SSL Secured
        </span>
        <span className="w-px h-3.5 bg-zinc-200" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          <Zap className="w-3 h-3 text-amber-700" />
          Instant Processing
        </span>
        <span className="w-px h-3.5 bg-zinc-200" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          Stripe Protected
        </span>
      </div>

      <div className="px-5 py-5">
        <StripeButton
          id={id}
          stripePublishableKey={stripePublishableKey}
          currency={currency}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
