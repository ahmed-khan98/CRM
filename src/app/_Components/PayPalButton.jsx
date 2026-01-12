"use client";
import { BaseUrl } from '@/app/_Services/baseUrl';
import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import Cookies from "js-cookie";
import { useAddPaypalPaymentMutation } from "../_Services/payment/page";
import { useRouter } from "next/navigation";

const PayPalButton = ({
  type,
  id,
  paypalClientId,
  amount,
  onSuccess,
  onError,
  className = "",
}) => {
  const [addPaypalPayment, { isLoading: isPaymentLoading }] =
    useAddPaypalPaymentMutation();
  const router = useRouter();

  const paypalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        initializePayPal();
        return;
      }

      const script = document.createElement("script");

      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}`;

      script.onload = () => {
        initializePayPal();
      };

      script.onerror = () => {
        setError("Failed to load PayPal SDK");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    const initializePayPal = () => {
      if (!window.paypal || !paypalRef.current) {
        setError("PayPal SDK not available");
        setIsLoading(false);
        return;
      }

      try {
        window.paypal
          .Buttons({
            createOrder: async () => {
              setIsProcessing(true);

              try {
                // const token = Cookies.get("token");

                // if (!token) {
                //   throw new Error("Authentication required");
                // }

                let payload = { id };

                const response = await fetch(
                  `${BaseUrl}paymentlink/pay-with-paypal`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      // Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  }
                );

                const data = await response.json();
                console.log(data, "data paypal");

                if (!response.ok) {
                  throw new Error(
                    data.message || "Failed to create PayPal order"
                  );
                }

                return data.data.transactionId;
              } catch (error) {
                console.error("PayPal createOrder error:", error);
                toast.error(error.message || "Failed to create payment");
                setIsProcessing(false);
                throw error;
              }
            },

            onApprove: async (data) => {  
              try {
                const token = Cookies.get("token");
                let payload = { id };
                const response = await fetch(
                  `${BaseUrl}paymentlink/pay-with-paypal/${data.orderID}/charge`,
                  {
                    method: "POST",
                    // headers: {
                    //   Authorization: `Bearer ${token}`,
                    // },
                    headers: {
                      "Content-Type": "application/json",
                      // Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  }
                );

                const details = await response.json();

                if (!response.ok) {
                  throw new Error(details.message || "Payment failed");
                }

                setIsProcessing(false);
                toast.success(
                  `Payment successful! Status: ${details.data.status}`
                );

                if (onSuccess) {
                  onSuccess(details.data);
                }
              } catch (error) {
                console.error("PayPal onApprove error:", error);
                toast.error(error.message || "Payment processing failed");
                setIsProcessing(false);

                if (onError) {
                  onError(error);
                }
              }
            },

            onError: (err) => {
              toast.error(error?.data?.message, "---------------->>>>");
              setIsProcessing(false);

              if (onError) {
                onError(err);
              }
            },

            onCancel: (data) => {
              console.log("PayPal payment cancelled:", data);
              toast("Payment was cancelled");
              setIsProcessing(false);
            },

            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
              height: 45,
            },
          })
          .render(paypalRef.current);

        setIsLoading(false);
      } catch (error) {
        console.error("PayPal initialization error:", error);
        setError("Failed to initialize PayPal");
        setIsLoading(false);
      }
    };

    loadPayPalScript();

    // Cleanup
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [type, id, onSuccess, onError]);

  if (error) {
    return (
      <div
        className={`b-[#5f2781] border border-red-200 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  } 

  return (
    <div className={`relative ${className}`}>
      {/* Amount Display */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-2 mbg-[#5f2781]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">Payment Amount</h3>
            <p className="text-xs text-blue-600 mt-1">
              {type === "missed_appointment_payment"
                ? "Appointment Fee"
                : type === "auction_payment"
                  ? "Auction Payment"
                  : type === "penalized_product_payment"
                    ? "Penalty Fee"
                    : "Store Creation Fee"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-800">${amount}</span>
          </div>
        </div>
      </div> */}

      {/* PayPal Button Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading PayPal...</p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 font-medium">
                Processing Payment...
              </p>
            </div>
          </div>
        )}

        <div
          ref={paypalRef}
          className="min-h-[45px] rounded-xl overflow-hidden"
        />
      </div>

      {/* Security Notice */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-start">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-600">
              <strong>Secure Payment:</strong> Your payment is processed
              securely by PayPal. We never store your payment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalButton;

// PayPalButton.js (Changes only in useEffect)

// ... imports and state are same

// useEffect(() => {
//     const loadPayPalScript = (clientId) => { // clientId argument add karein
//         // ... (existing window.paypal check)

//         const script = document.createElement("script")
//         // Dynamically load Client ID
//         script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
//         // ... (rest of the script loading logic)
//     }

//     const fetchLinkDetailsAndInitPayPal = async () => {
//         setIsLoading(true);
//         // Step 1: Backend Route B ko call karein
//         const response = await fetch(`/api/v1/payment/public/${id}`); // Assuming 'id' is linkId
//         const data = await response.json();

//         if (!response.ok) {
//             setError(data.message || "Failed to load payment link details");
//             setIsLoading(false);
//             return;
//         }

//         const { data: linkData, paypalClientId } = data;

//         // Step 2: PayPal SDK load karein
//         loadPayPalScript(paypalClientId);

//         // *Note: Aapko is component ke props mein 'amount' ki zaroorat nahi padegi,
//         // *lekin UI ke liye aap isko 'linkData.amount' se set kar sakte hain.
//         // *Apne component state mein linkData ko save karein.
//     }

//     // fetchLinkDetailsAndInitPayPal();
//     // ⚠️ Agar aap link details ko parent component mein fetch karte hain, to yeh logic simplify ho jayega.

//     const initializePayPal = () => {
//         // ... (existing checks)

//         window.paypal
//             .Buttons({
//                 createOrder: async () => {
//                     setIsProcessing(true)
//                     try {
//                         // Backend Route C ko call karein (No need for token/payload here)
//                         const response = await fetch(`/api/v1/payment/public/${id}/create-order`, {
//                              method: "POST",
//                              headers: { "Content-Type": "application/json" },
//                              body: JSON.stringify({ linkId: id }) // Only send linkId
//                         })

//                         const data = await response.json()
//                         if (!response.ok) {
//                             throw new Error(data.message || "Failed to create PayPal order")
//                         }

//                         return data.data.transactionId // PayPal Order ID return karein
//                     } catch (error) {
//                         // ... (error handling)
//                         throw error
//                     }
//                 },

//                 onApprove: async (data) => {
//                     try {
//                         // ⚠️ Yahan aapko link details se merchantType chahiye hoga.
//                         // Assume karein ki aapne link details component state mein save kiye hain.
//                         // const merchantType = linkDetails.merchantType;

//                         const response = await fetch(`/api/v1/payment/public/${id}/charge`, {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                                 orderID: data.orderID,
//                                 // merchantType: merchantType // Agar aapko ye zaroori ho to body mein bhejein
//                             }),
//                         })

//                         // ... (rest of onApprove logic)

//                     } catch (error) {
//                         // ... (error handling)
//                     }
//                 },

//                 // ... (onError, onCancel, style are same)
//             })
//             .render(paypalRef.current)

//         setIsLoading(false)
//     }

//     // Is logic ko update karein ki yeh link ID ke hisaab se payment data fetch kare
//     // Abhi ke liye, main assume kar raha hun ki aapka parent component fetch karega.
//     // Agar nahi, to fetchLinkDetailsAndInitPayPal ko call karein.

// }, [type, id, onSuccess, onError])
