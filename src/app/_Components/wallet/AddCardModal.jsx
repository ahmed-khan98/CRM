"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, CreditCard, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { useAddCardMutation } from "@/app/_Services/wallet/page"

const AddCardModal = ({ onClose, onSuccess }) => {
  const [addCard, { isLoading }] = useAddCardMutation()
  const [stripe, setStripe] = useState(null)
  const [elements, setElements] = useState(null)
  const [card, setCard] = useState(null)
  const [cardError, setCardError] = useState("")
  const [cardComplete, setCardComplete] = useState(false)
  const cardElementRef = useRef(null)

  const [formData, setFormData] = useState({
    cardHolderName: "",
  })
  const [errors, setErrors] = useState({})

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe(`${process.env.STRIPE_PUBLIC_KEY}`)
        setStripe(stripeInstance)

        const elementsInstance = stripeInstance.elements()
        setElements(elementsInstance)

        const cardElement = elementsInstance.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
              padding: "12px",
            },
            invalid: {
              color: "#9e2146",
            },
          },
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Cardholder name is required"
    }

    if (!cardComplete) {
      newErrors.card = "Please enter complete card information"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm() || !stripe || !card) {
      return
    }

    try {
      // Create payment method with Stripe
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
        billing_details: {
          name: formData.cardHolderName,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }
      // Send payment method ID to your backend
      const cardData = {
        paymentMethodId: paymentMethod.id,
        cardHolderName: formData.cardHolderName,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
      }

      await addCard(cardData).unwrap()
      toast.success("Card added successfully")
      onSuccess()
    } catch (error) {
      toast.error(error.data?.message || "Failed to add card")
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
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-[#FB3B11]" />
            Add New Card
          </h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border ${errors.cardHolderName ? "border-red-300" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]`}
              />
              {errors.cardHolderName && <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>}
            </div>

            {/* Stripe Card Element */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
              <div
                className={`border ${cardError || errors.card ? "border-red-300" : "border-gray-300"
                  } rounded-xl p-4 focus-within:ring-2 focus-within:ring-[#FB3B11] focus-within:border-[#FB3B11]`}
              >
                <div ref={cardElementRef} />
              </div>
              {cardError && <p className="text-red-500 text-xs mt-1">{cardError}</p>}
              {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !formData.cardHolderName.trim()}
              className="cursor-pointer w-full bg-[#FB3B11] text-white py-3 rounded-xl font-medium hover:bg-[#e03610] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding Card...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Add Card
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your card information is securely processed by Stripe and never stored on our servers.
          </p>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AddCardModal


