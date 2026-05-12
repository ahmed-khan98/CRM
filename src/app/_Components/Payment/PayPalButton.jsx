"use client";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const PayPalButton = ({
  id,
  paypalClientId,
  amount,
  onSuccess,
  onError,
  className = "",
}) => {

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
                  `${process.env.NEXT_PUBLIC_API_URL}paymentlink/pay-with-paypal`,
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
                console.log(data,'--->>>onApprove')
                const token = Cookies.get("token");
                let payload = { id };
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}paymentlink/pay-with-paypal/${data.orderID}/charge`,
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
              console.log('on error',error)
              toast.error(error?.data?.message || 'on error toast', "---------------->>>>");
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
  }, [paypalClientId, id, onSuccess, onError]);

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
