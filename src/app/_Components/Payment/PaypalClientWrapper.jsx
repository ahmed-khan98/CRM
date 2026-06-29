"use client";
import { useRouter } from "next/navigation";
import PayPalButton from "./PayPalButton";
import { CreditCard, Lock, Zap } from "lucide-react";

export default function PayPalClientWrapper({ id, paypalClientId,brandParam,currency }) {
  const router = useRouter();

  const handleSuccess = () => router.push("/payment-success");
  const handleError = () => router.push("/payment-failed");

  return (
 <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-[13px] font-black text-zinc-800 tracking-tight">
            Complete Your Payment
          </h3>
          <p className="text-[11px] text-zinc-400">
            Select your preferred payment method
          </p>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="flex items-center justify-center gap-3 px-2 py-4 border-b border-zinc-100 bg-zinc-50/50">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          <Lock className="w-3 h-3 text-emerald-500" />
          SSL Secured
        </span>
        <span className="w-px h-3.5 bg-zinc-200" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          <Zap className="w-3 h-3 text-amber-500" />
          Instant Processing
        </span>
        <span className="w-px h-3.5 bg-zinc-200" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
          {/* PayPal icon */}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#003087">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.828c-.196 0-.378.09-.5.24l-1.613 10.21a.55.55 0 0 0 .543.63h3.804c.46 0 .85-.332.922-.785l.38-2.408.04-.252a.934.934 0 0 1 .922-.785h.581c3.76 0 6.705-1.528 7.565-5.946.36-1.845.174-3.386-.85-4.699z"/>
          </svg>
          PayPal Protected
        </span>
      </div>

      {/* ── Payment button area ── */}
      <div className="px-5 py-5">
        <PayPalButton
          id={id}
          paypalClientId={paypalClientId}
          onSuccess={handleSuccess}
          onError={handleError}
          brandParam={brandParam}
          currency={currency}
        />
      </div>

    </div>
  );
}
