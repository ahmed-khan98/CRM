"use client";
import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const StripeButton = ({
  id,
  stripePublishableKey,
  currency = "USD",
  onSuccess,
  onError,
  className = "",
}) => {
  const paymentElementRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadStripeJs = () =>
      new Promise((resolve, reject) => {
        if (window.Stripe) {
          resolve();
          return;
        }
        const existing = document.querySelector(
          'script[data-stripe-js="1"]',
        );
        if (existing) {
          existing.addEventListener("load", resolve);
          existing.addEventListener("error", reject);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.async = true;
        script.dataset.stripeJs = "1";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Stripe.js"));
        document.head.appendChild(script);
      });

    const init = async () => {
      setIsLoading(true);
      setError(null);

      if (!stripePublishableKey) {
        setError("Stripe is not configured for this payment link");
        setIsLoading(false);
        return;
      }

      try {
        await loadStripeJs();
        if (cancelled) return;

        const intentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}paymentlink/pay-with-stripe/create-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          },
        );
        const intentData = await intentRes.json();
        if (!intentRes.ok) {
          throw new Error(
            intentData?.message || "Failed to start Stripe payment",
          );
        }

        const clientSecret = intentData?.data?.clientSecret;
        const piId = intentData?.data?.paymentIntentId;
        if (!clientSecret) throw new Error("Missing Stripe client secret");

        const stripe = window.Stripe(stripePublishableKey);
        const elements = stripe.elements({
          clientSecret,
          appearance: { theme: "stripe" },
        });
        const paymentElement = elements.create("payment");
        if (!paymentElementRef.current) return;
        paymentElement.mount(paymentElementRef.current);

        stripeRef.current = stripe;
        elementsRef.current = elements;
        if (!cancelled) {
          setPaymentIntentId(piId);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Stripe init error:", err);
        if (!cancelled) {
          setError(err?.message || "Failed to initialize Stripe");
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      try {
        elementsRef.current?.getElement?.("payment")?.unmount?.();
      } catch {
        /* ignore */
      }
    };
  }, [id, stripePublishableKey]);

  const handlePay = async () => {
    if (!stripeRef.current || !elementsRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      const { error: confirmError, paymentIntent } =
        await stripeRef.current.confirmPayment({
          elements: elementsRef.current,
          redirect: "if_required",
        });

      if (confirmError) {
        toast.error(confirmError.message || "Card payment failed");
        return;
      }

      const pi =
        paymentIntent?.id ||
        paymentIntentId;

      if (paymentIntent && paymentIntent.status !== "succeeded") {
        throw new Error(
          `Payment not completed (status: ${paymentIntent.status})`,
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}paymentlink/pay-with-stripe/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, paymentIntentId: pi }),
        },
      );
      const details = await response.json();
      if (!response.ok) {
        const msg = details?.message || details?.error || "Payment failed";
        toast.error(msg);
        onError?.(new Error(msg));
        return;
      }

      toast.success(
        `Payment successful! Status: ${details?.data?.status || "succeeded"}`,
      );
      onSuccess?.(details?.data);
    } catch (err) {
      console.error("Stripe pay error:", err);
      toast.error(err.message || "Payment processing failed");
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className={`border border-rose-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center text-rose-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-xl z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-zinc-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading Stripe...</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              Processing Payment...
            </p>
          </div>
        </div>
      )}

      <div
        ref={paymentElementRef}
        className="min-h-[90px] rounded-xl border border-zinc-200 bg-white p-3"
      />

      <button
        type="button"
        onClick={handlePay}
        disabled={isLoading || isProcessing}
        className="mt-4 w-full rounded-xl bg-zinc-900 text-white text-sm font-semibold py-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processing..." : `Pay with card (${currency})`}
      </button>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-[11px] leading-relaxed">
          This is a one-time secure payment link. Do not share it with others.
          It will expire once payment is completed.
        </p>
      </div>
    </div>
  );
};

export default StripeButton;
