"use client";
import { useEffect, useState } from "react";
import StripeClientWrapper from "./StripeClientWrapper";

const PaymentDetailStripe = ({
  id,
  stripePublishableKey,
  position,
  currency,
}) => {
  const [show, setShow] = useState(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateShow = () => {
      const isDesktop = mediaQuery.matches;
      setShow(position === "desktop" ? isDesktop : !isDesktop);
    };

    updateShow();

    const handleChange = (event) => {
      const isDesktop = event.matches;
      setShow(position === "desktop" ? isDesktop : !isDesktop);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [position]);

  if (show === undefined) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-8">
        <div className="text-center text-sm text-zinc-500">
          Loading payment options...
        </div>
      </div>
    );
  }

  if (!show) return null;

  return (
    <StripeClientWrapper
      id={id}
      stripePublishableKey={stripePublishableKey}
      currency={currency}
    />
  );
};

export default PaymentDetailStripe;
