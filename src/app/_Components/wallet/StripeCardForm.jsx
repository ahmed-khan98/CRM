"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CreditCard, Lock, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { useAddCardMutation } from "@/app/_Services/wallet/page"

const StripeCardForm = ({ onSuccess,onClose }) => {
      const [addCard, { isLoading }] = useAddCardMutation()
    
  const [stripe, setStripe] = useState(null)
  const [elements, setElements] = useState(null)
  const [card, setCard] = useState(null)
  const [cardError, setCardError] = useState("")
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const cardElementRef = useRef(null)

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
  })

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe('pk_test_51HvHoVBGDx2Lb6IFoAUFCZG7LjSCigVrcHPAlXO45x02BCK4sLaWAzBTCjOh8xN2O2ahFw4a69n5SY7GW7RbJsie005oQBdm0K')
        console.log(stripeInstance,'stripeInstance')
        setStripe(stripeInstance)

        const elementsInstance = stripeInstance.elements()
        setElements(elementsInstance)

        const cardElement = elementsInstance.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
          hidePostalCode: true,
        })

        setCard(cardElement)

        // Mount card element
        if (cardElementRef.current) {
          cardElement.mount(cardElementRef.current)
        }

        // Listen for card changes
        cardElement.on("change", (event) => {
          setCardError(event.error ? event.error.message : "")
          setCardComplete(event.complete)
        })
      }
    }

    // Load Stripe script if not already loaded
    if (!window.Stripe) {
      const script = document.createElement("script")
      script.src = "https://js.stripe.com/v3/"
      script.onload = initializeStripe
      document.head.appendChild(script)
    } else {
      initializeStripe()
    }

    return () => {
      if (card) {
        card.destroy()
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !card || !cardComplete) {
      toast.error("Please enter complete card information")
      return
    }

    if (!billingDetails.name.trim()) {
      toast.error("Please enter cardholder name")
      return
    }

    setProcessing(true)

    try {
      // Create payment method with Stripe
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
        },
      })

      if (error) {
        toast.error(error.message)
        setProcessing(false)
        return
      }
      const cardData = {
        paymentMethodId: paymentMethod.id,
        cardHolderName: billingDetails.name,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
      }
      await addCard(cardData).unwrap()
      toast.success("Card added successfully")
      onSuccess()

      // Call parent callback with payment method
    //   if (onPaymentMethodCreated) {
    //     await onPaymentMethodCreated(paymentMethod)
    //   }

    } catch (error) {
      toast.error("Failed to create payment method",error)
      console.error("Payment method creation error:", error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-[#FB3B11] mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Add Payment Method</h3>
      </div> */}

      <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-[#FB3B11]" />
            Add stripe Card
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]"
            required
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
          <input
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]"
          />
        </div>

        {/* Stripe Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
          <div
            className={`border ${cardError ? "border-red-300" : "border-gray-300"} rounded-xl p-4 focus-within:ring-2 focus-within:ring-[#FB3B11] focus-within:border-[#FB3B11]`}
          >
            <div ref={cardElementRef} />
          </div>
          {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}
        </div>

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
          <Lock className="h-4 w-4 mr-2" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!cardComplete || processing || isLoading || !billingDetails.name.trim()}
          className="w-full bg-[#FB3B11] text-white py-3 rounded-xl font-medium hover:bg-[#e03610] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing || isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            "Add Card"
          )}
        </motion.button>
      </form>
      </motion.div>
      </motion.div>
  )
}

export default StripeCardForm
