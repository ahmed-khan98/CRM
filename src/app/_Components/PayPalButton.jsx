"use client"
import { useEffect, useRef, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { useAddPaypalPaymentMutation } from "../_Services/payment/page"
import { useRouter } from "next/navigation"

const PayPalButton = ({ type, id, amount, onSuccess, onError, className = "" }) => {


    const [addPaypalPayment, { isLoading: isPaymentLoading }] = useAddPaypalPaymentMutation()
    const router = useRouter()
  
  const paypalRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        initializePayPal()
        return
      }

      const script = document.createElement("script")
      script.src =
        "https://www.paypal.com/sdk/js?client-id=Ac1nEE_Wq8aTuTt_FKp6mrnJpESWCVgsxksjS2wT0AXS3mZATUHofxzt5g1CfuScpbQCantRUBHfYW5j"
      script.onload = () => {
        initializePayPal()
      }
      script.onerror = () => {
        setError("Failed to load PayPal SDK")
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializePayPal = () => {
      if (!window.paypal || !paypalRef.current) {
        setError("PayPal SDK not available")
        setIsLoading(false)
        return
      }

      try {
        window.paypal
          .Buttons({
            createOrder: async () => {
              setIsProcessing(true)

              try {
                const token = Cookies.get("token")

                if (!token) {
                  throw new Error("Authentication required")
                }

                let payload = {}

                if (type === "missed_appointment_payment") {
                  payload = {
                    type: "missed_appointment_payment",
                    appointmentId: id,
                  }
                } else if (type === "auction_payment") {
                  payload = {
                    type: "auction_payment",
                    productId: id.productId,
                    auctionWonId: id.auctionWonId,
                  }
                } else if (type === "penalized_product_payment") {
                  payload = {
                    type: "auction_payment",
                    penalizedId: id,
                  }
                } else if (type === "store_payment") {
                  payload = {
                    type: "store_payment",
                    storeId: id,
                  }
                }

                const response = await fetch("https://auction-api.devssh.xyz/api/v1/user/payment/pay-with-paypal", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                })

                const data = await response.json()
                console.log(data,'data paypal')

                if (!response.ok) {
                  throw new Error(data.message || "Failed to create PayPal order")
                }
                // const response = await addPaypalPayment(payload).unwrap()
                // toast.success(response?.message)
                // console.log(response,'response')
                // if (response?.success) {
                //   if (type === "missed_appointment_payment") {
                //     router.push("/dashboard/missedAppointment")
                //   } else if (type === "auction_payment") {
                //     router.push("/dashboard/UnpaidItem")
                //   } else if (type === "penalized_product_payment") {
                //     router.push("/dashboard/penalizedFeeProduct")
                //   } else {
                //     router.push("/dashboard/myItem")
                //   }
                // }

                return data.data.transactionId
              } catch (error) {
                console.error("PayPal createOrder error:", error)
                toast.error(error.message || "Failed to create payment")
                setIsProcessing(false)
                throw error
              }
            },

            onApprove: async (data) => {
              try {
                const token = Cookies.get("token")

                const response = await fetch(
                  `https://auction-api.devssh.xyz/api/v1/user/payment/pay-with-paypal/${data.orderID}/charge`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                )

                const details = await response.json()

                if (!response.ok) {
                  throw new Error(details.message || "Payment failed")
                }

                setIsProcessing(false)
                toast.success(`Payment successful! Status: ${details.data.status}`)

                if (onSuccess) {
                  onSuccess(details.data)
                }
              } catch (error) {
                console.error("PayPal onApprove error:", error)
                toast.error(error.message || "Payment processing failed")
                setIsProcessing(false)

                if (onError) {
                  onError(error)
                }
              }
            },

            onError: (err) => {
              toast.error(error?.data?.message,'---------------->>>>')
              setIsProcessing(false)

              if (onError) {
                onError(err)
              }
            },

            onCancel: (data) => {
              console.log("PayPal payment cancelled:", data)
              toast.info("Payment was cancelled")
              setIsProcessing(false)
            },

            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
              height: 45,
            },
          })
          .render(paypalRef.current)

        setIsLoading(false)
      } catch (error) {
        console.error("PayPal initialization error:", error)
        setError("Failed to initialize PayPal")
        setIsLoading(false)
      }
    }

    loadPayPalScript()

    // Cleanup
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ""
      }
    }
  }, [type, id, onSuccess, onError])

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Amount Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
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
      </div>

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
              <p className="text-sm text-gray-600 font-medium">Processing Payment...</p>
            </div>
          </div>
        )}

        <div ref={paypalRef} className="min-h-[45px] rounded-xl overflow-hidden" />
      </div>

      {/* Security Notice */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-start">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-600">
              <strong>Secure Payment:</strong> Your payment is processed securely by PayPal. We never store your payment
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayPalButton
