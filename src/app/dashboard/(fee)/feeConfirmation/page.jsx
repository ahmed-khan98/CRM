// "use client"

// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter, useSearchParams } from 'next/navigation'
// import { CreditCard, Check, Plus } from 'lucide-react'
// import { useGetCardsQuery } from "@/app/_Services/wallet/page"
// import StripeCardForm from "@/app/_Components/wallet/StripeCardForm"
// import { useAddCardPaymentMutation, useAddPaymentMutation } from "@/app/_Services/payment/page"
// import toast from "react-hot-toast"

// const page = () => {
//     const router = useRouter()

//     const searchParams = useSearchParams()
//     const type = searchParams.get('type')
//     const id = searchParams.get('id')
//     const amount = searchParams.get('amount')
//     const [showAddCard, setShowAddCard] = useState(false)
//     const [activeId, setActiveId] = useState(null)
//     const [stripeLoading, setStripeLoading] = useState(false)
//     const [Loading, setLoading] = useState(false)
//     const { data: cardsData, isLoading, refetch } = useGetCardsQuery()
//     const [addPayment, { isLoading: isPocessing }] = useAddPaymentMutation()
//     const [addCardPayment, { isLoading: isPaymentLoading }] = useAddCardPaymentMutation()


//     useEffect(() => {
//         if (cardsData?.data?.length) {
//           const defaultCard = cardsData?.data?.find(card => card.isDefault)
//           if (defaultCard) {
//             setActiveId(defaultCard.paymentMethodId)
//           }
//         }
//       }, [cardsData])

//     const getCardTypeIcon = (cardType) => {
//         switch (cardType) {
//             case "visa":
//                 return <span className="font-bold text-blue-600">VISA</span>
//             case "MASTERCARD":
//                 return <span className="font-bold text-red-600">MC</span>
//             case "AMEX":
//                 return <span className="font-bold text-blue-500">AMEX</span>
//             case "DISCOVER":
//                 return <span className="font-bold text-orange-500">DISC</span>
//             default:
//                 return <span className="font-bold text-gray-600">CARD</span>
//         }
//     }

//     const handleStripePayments = async () => {
//         setStripeLoading(true)
//         try {
//             let payload = {}

//             if (type === "missed_appointment_payment") {
//                 payload = {
//                     appointmentId: id,
//                     type: "missed_appointment_payment",
//                 }
//             } else if (type === "auction_payment") {
//                 payload = {
//                     auctionWonId: id,
//                     type: "auction_payment",
//                 }
//             } else if (type === "penalized_product_payment") {
//                 payload = {
//                     penalizedId: id,
//                     type: "penalized_product_payment",
//                 }
//             } else {
//                 payload = {
//                     storeId: id,
//                     type: "store_payment",
//                 }
//             }

//             const response = await addPayment(payload).unwrap()

//             if (response?.data?.url) {
//                 window.location.href = response.data.url
//             }
//         } catch (error) {
//             setStripeLoading(false)
//             toast.error(error?.data?.message || "Something went wrong")
//         }
//     }

//     const handleCardPayments = async () => {
//         setLoading(true)
//         try {
//             let payload = {}

//             if (type === "missed_appointment_payment") {
//                 payload = {
//                     appointmentId: id,
//                     type: "missed_appointment_payment",
//                     cardId: activeId
//                 }
//             } else if (type === "auction_payment") {
//                 payload = {
//                     auctionWonId: id,
//                     type: "auction_payment",
//                     cardId: activeId
//                 }
//             } else if (type === "penalized_product_payment") {
//                 payload = {
//                     penalizedId: id,
//                     type: "penalized_product_payment",
//                     cardId: activeId
//                 }
//             } else {
//                 payload = {
//                     storeId: id,
//                     type: "store_payment",
//                     cardId: activeId
//                 }
//             }

//             const response = await addCardPayment(payload).unwrap()

//             if (response?.success) {
//                 if (type === "missed_appointment_payment") {
//                     router.push('/dashboard/missedAppointment')
//                 } else if (type === "auction_payment") {
//                     router.push('/dashboard/UnpaidItem')
//                 } else if (type === "penalized_product_payment") {
//                     router.push('/dashboard/penalizedFeeProduct')
//                 } else {
//                     router.push('/dashboard/myItem')
//                 }
//             }
//         } catch (error) {
//             setLoading(false)
//             toast.error(error?.data?.message || "Something went wrong")
//         }
//     }


//     return (
//         <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-4">
//             <div className="max-w-3xl mx-auto">
//                 <div className="flex items-center justify-between  my-10 md:my-6">
//                     <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <CreditCard className="mr-2 h-6 w-6 text-[#FB3B11]" />
//                         Payment Confirmation
//                     </h1>
//                 </div>

//                 <div className="bg-white rounded-3xl shadow-md p-6">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Your Cards</h2>

//                     {isLoading ? (
//                         <div className="space-y-4">
//                             {[...Array(3)].map((_, index) => (
//                                 <div key={index} className="animate-pulse bg-gray-100 rounded-xl p-5">
//                                     <div className="flex justify-between">
//                                         <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
//                                         <div className="h-6 bg-gray-200 rounded w-1/6"></div>
//                                     </div>
//                                     <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
//                                     <div className="h-4 bg-gray-200 rounded w-1/5"></div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : cardsData?.data?.length === 0 ? (
//                         <div className="text-center py-10">
//                             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                                 <CreditCard className="h-8 w-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-700 mb-1">No cards added yet</h3>
//                             <p className="text-gray-500 max-w-xs mx-auto mb-6">
//                                 Add a payment card to make deposits and withdrawals from your wallet.
//                             </p>
//                             <motion.button
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => setShowAddCard(true)}
//                                 className="cursor-pointer bg-[#FB3B11] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
//                             >
//                                 <Plus className="h-4 w-4 inline mr-1" />
//                                 Add Your First Card
//                             </motion.button>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             {cardsData?.data?.map((card) => (
//                                 <motion.div
//                                     key={card?.paymentMethodId}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className={`cursor-pointer border ${activeId === card?.paymentMethodId ? 'border-[#FB3B11]' : 'border-gray-200'} rounded-xl p-5 relative ${activeId === card?.paymentMethodId ? 'bg-orange-50' : 'bg-white'}`}
//                                 >


//                                     <div className="flex justify-between items-start" onClick={() => setActiveId(card?.paymentMethodId)}>
//                                         <div>
//                                             <div className="flex items-center mb-2">
//                                                 {getCardTypeIcon(card?.cardType)}
//                                                 <span className="ml-2 text-lg font-medium">•••• {card?.lastFourDigits}</span>
//                                                 {(activeId === card?.paymentMethodId ) && (
//                                                     <span className="ml-2 bg-[#FB3B11] text-white text-xs px-2 py-0.5 rounded-full">
//                                                         Active
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <p className="text-gray-600 text-sm">{card?.cardHolderName}</p>
//                                             <p className="text-gray-500 text-xs mt-1">
//                                                 Expires {card?.expiryMonth.toString().padStart(2, '0')}/{card?.expiryYear}
//                                             </p>
//                                         </div>

//                                         <div className="flex space-x-2">
//                                             {activeId !== card?.paymentMethodId && (
//                                                 <motion.button
//                                                     whileTap={{ scale: 0.95 }}
//                                                     onClick={() => setActiveId(card?.paymentMethodId)}
//                                                     disabled={activeId === card?.paymentMethodId}
//                                                     className="cursor-pointer text-[#FB3B11] hover:bg-orange-50 p-2 rounded-full transition-colors"
//                                                     title="Select For Payment"
//                                                 >
//                                                     <Check className="h-5 w-5" />
//                                                 </motion.button>
//                                             )}

//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     )}
//                 </div>


//                 <div className="bg-white rounded-3xl shadow-md p-6 my-2 md:my-6">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Fee Details</h2>

//                     {isLoading ?
//                         <div className="space-y-4">
//                             {[...Array(3)].map((_, index) => (
//                                 <div key={index} className="animate-pulse bg-gray-100 rounded-xl p-5">
//                                     <div className="flex justify-between">
//                                         <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
//                                         <div className="h-6 bg-gray-200 rounded w-1/6"></div>
//                                     </div>
//                                     <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
//                                     <div className="h-4 bg-gray-200 rounded w-1/5"></div>
//                                 </div>
//                             ))}
//                         </div>
//                         :
//                         <div className="space-y-4">
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className='border-b  border-gray-200 p-1 relative bg-white'
//                             >


//                                 <div className="flex justify-between items-start">
//                                     <div>
//                                         <div className="flex items-center mb-1">
//                                             <span className="ml-1 text-md text-gray-700">{type === 'missed_appointment_payment' ? 'Appointment Missed' : type === 'auction_payment' ? 'Won Product' : type === 'penalized_product_payment' ? 'Penalized Product Penalty' : 'Store Creation Fee'}</span>
//                                         </div>
//                                         {/* <p className="text-gray-500 text-xs mt-1 ml-1">
//                         Expires
//                       </p> */}
//                                     </div>

//                                     <div className="flex space-x-2">
//                                         <div className="flex items-center mb-1">
//                                             <span className="ml-2 text-md  text-gray-500">{`$ ${amount}`}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                             >
//                                 <div className="flex justify-end ">
//                                     <button
//                                         disabled={(isPocessing || stripeLoading)}

//                                         onClick={() => handleStripePayments()}
//                                         className="cursor-pointer mx-1 w-40 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
//                                     >
//                                         {(isPocessing && stripeLoading) ? (
//                                             <>
//                                                 <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                                 Processing...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <CreditCard className="h-4 w-4" />
//                                                 Pay with Stripe
//                                             </>
//                                         )}

//                                     </button>
//                                     <button
//                                         onClick={() => handleCardPayments()}
//                                         disabled={(isPaymentLoading || Loading)}
//                                         className="cursor-pointer mx-1 w-40 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
//                                     >

//                                         {(isPaymentLoading && Loading) ? (
//                                             <>
//                                                 <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                                 Processing...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <CreditCard className="h-4 w-4" />
//                                                 Pay with Card
//                                             </>
//                                         )}
//                                     </button>

//                                 </div>
//                             </motion.div>
//                         </div>
//                     }
//                 </div>
//             </div>

//             <AnimatePresence>
//                 {showAddCard && (
//                     <StripeCardForm onClose={() => setShowAddCard(false)} onSuccess={handleAddCardSuccess} />
//                 )}
//             </AnimatePresence>
//         </div>
//     )
// }

// export default page

"use client"
import { useEffect, useState,Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Check, Plus, AlertCircle } from "lucide-react"
import { useGetCardsQuery } from "@/app/_Services/wallet/page"
import StripeCardForm from "@/app/_Components/wallet/StripeCardForm"
import { useAddCardPaymentMutation, useAddPaymentMutation } from "@/app/_Services/payment/page"
import toast from "react-hot-toast"
import PayPalButton from "@/app/_Components/PayPalButton"

const FeeCindirmation = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const amount = searchParams.get("amount")
  const productId = searchParams.get("productId")
  const product = searchParams.get("product")
  const sku = searchParams.get("sku")
  const [showAddCard, setShowAddCard] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card") // 'card', 'stripe', 'paypal'

  const { data: cardsData, isLoading, refetch } = useGetCardsQuery()
  const [addPayment, { isLoading: isPocessing }] = useAddPaymentMutation()
  const [addCardPayment, { isLoading: isPaymentLoading }] = useAddCardPaymentMutation()

  useEffect(() => {
    if (cardsData?.data?.length) {
      const defaultCard = cardsData?.data?.find((card) => card.isDefault)
      if (defaultCard) {
        setActiveId(defaultCard.paymentMethodId)
      }
    }
  }, [cardsData])

  const getCardTypeIcon = (cardType) => {
    switch (cardType) {
      case "visa":
        return <span className="font-bold text-blue-600">VISA</span>
      case "MASTERCARD":
        return <span className="font-bold text-red-600">MC</span>
      case "AMEX":
        return <span className="font-bold text-blue-500">AMEX</span>
      case "DISCOVER":
        return <span className="font-bold text-orange-500">DISC</span>
      default:
        return <span className="font-bold text-gray-600">CARD</span>
    }
  }

  const handleStripePayments = async () => {
    setStripeLoading(true)
    try {
      let payload = {}
      if (type === "missed_appointment_payment") {
        payload = {
          appointmentId: id,
          type: "missed_appointment_payment",
        }
      } else if (type === "auction_payment") {
        payload = {
          auctionWonId: id,
          productId: productId,
          type: "auction_payment",
        }
      } else if (type === "penalized_product_payment") {
        payload = {
          penalizedId: id,
          type: "penalized_product_payment",
        }
      } else {
        payload = {
          storeId: id,
          type: "store_payment",
        }
      }
      const response = await addPayment(payload).unwrap()
      if (response?.data?.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      setStripeLoading(false)
      toast.error(error?.data?.message || "Something went wrong")
    }
  }

  const handleCardPayments = async () => {
    setLoading(true)
    try {
      let payload = {}
      if (type === "missed_appointment_payment") {
        payload = {
          appointmentId: id,
          type: "missed_appointment_payment",
          cardId: activeId,
        }
      } else if (type === "auction_payment") {
        payload = {
          auctionWonId: id,
          productId: productId,
          type: "auction_payment",
          cardId: activeId,
        }
      } else if (type === "penalized_product_payment") {
        payload = {
          penalizedId: id,
          type: "penalized_product_payment",
          cardId: activeId,
        }
      } else {
        payload = {
          storeId: id,
          type: "store_payment",
          cardId: activeId,
        }
      }
      const response = await addCardPayment(payload).unwrap()
      console.log(response,'response')
      toast.success(response?.data?.message)
      if (response?.success) {
        if (type === "missed_appointment_payment") {
          router.push("/dashboard/missedAppointment")
        } else if (type === "auction_payment") {
          router.push("/dashboard/UnpaidItem")
        } else if (type === "penalized_product_payment") {
          router.push("/dashboard/penalizedFeeProduct")
        } else {
          router.push("/dashboard/myItem")
        }
      }
    } catch (error) {
      setLoading(false)
      toast.error(error?.data?.message || "Something went wrong")
    }
  }

  const handlePayPalSuccess = (paymentData) => {
    console.log("PayPal payment successful:", paymentData)

    // Navigate based on payment type
    if (type === "missed_appointment_payment") {
      router.push("/dashboard/missedAppointment")
    } else if (type === "auction_payment") {
      router.push("/dashboard/UnpaidItem")
    } else if (type === "penalized_product_payment") {
      router.push("/dashboard/penalizedFeeProduct")
    } else {
      router.push("/dashboard/myItem")
    }
  }

  const handlePayPalError = (error) => {
    console.error("PayPal payment error:", error)
    toast.error("PayPal payment failed. Please try again.")
  }

  // Prepare PayPal ID based on type
  const getPayPalId = () => {
    if (type === "auction_payment") {
      // For auction payment, we need both productId and auctionWonId
      const searchId = searchParams.get("productId")
      return {
        productId: searchId,
        auctionWonId: id,
      }
    }
    return id
  }

  const handleAddCardSuccess = () => {
    setShowAddCard(false)
    refetch()
    toast.success("Card added successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between my-10 md:my-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-[#FB3B11]" />
            Payment Confirmation
          </h1>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("card")}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "card" ? "border-[#FB3B11] bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#FB3B11]" />
              <p className="font-medium text-gray-800">Saved Cards</p>
              <p className="text-sm text-gray-500">Use your saved cards</p>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("stripe")}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "stripe" ? "border-[#FB3B11] bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <p className="font-medium text-gray-800">Stripe</p>
              <p className="text-sm text-gray-500">Secure card processing</p>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("paypal")}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "paypal" ? "border-[#FB3B11] bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="h-8 w-8 mx-auto mb-2 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <p className="font-medium text-gray-800">PayPal</p>
              <p className="text-sm text-gray-500">Pay with PayPal</p>
            </motion.button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Method Content */}
          <div>
            {paymentMethod === "card" && (
              <div className="bg-white rounded-3xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Cards</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse bg-gray-100 rounded-xl p-5">
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                      </div>
                    ))}
                  </div>
                ) : cardsData?.data?.length === 0 ? (
                  <div className="text-center py-1">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No cards added yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-6">
                      Add a payment card to make deposits and withdrawals from your wallet.
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddCard(true)}
                      className="cursor-pointer bg-[#FB3B11] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add Your First Card
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cardsData?.data?.map((card) => (
                        <motion.div
                          key={card?.paymentMethodId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`cursor-pointer border ${activeId === card?.paymentMethodId ? "border-[#FB3B11]" : "border-gray-200"} rounded-xl p-5 relative ${activeId === card?.paymentMethodId ? "bg-orange-50" : "bg-white"}`}
                        >
                          <div
                            className="flex justify-between items-start"
                            onClick={() => setActiveId(card?.paymentMethodId)}
                          >
                            <div>
                              <div className="flex items-center mb-2">
                                {getCardTypeIcon(card?.cardType)}
                                <span className="ml-2 text-lg font-medium">•••• {card?.lastFourDigits}</span>
                                {activeId === card?.paymentMethodId && (
                                  <span className="ml-2 bg-[#FB3B11] text-white text-xs px-2 py-0.5 rounded-full">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{card?.cardHolderName}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                Expires {card?.expiryMonth.toString().padStart(2, "0")}/{card?.expiryYear}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {activeId !== card?.paymentMethodId && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setActiveId(card?.paymentMethodId)}
                                  disabled={activeId === card?.paymentMethodId}
                                  className="cursor-pointer text-[#FB3B11] hover:bg-orange-50 p-2 rounded-full transition-colors"
                                  title="Select For Payment"
                                >
                                  <Check className="h-5 w-5" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCardPayments()}
                      disabled={isPaymentLoading || Loading || !activeId}
                      className="cursor-pointer w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isPaymentLoading || Loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay with Selected Card
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {paymentMethod === "stripe" && (
              <div className="bg-white rounded-3xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Pay with Stripe</h2>
                <button
                  disabled={isPocessing || stripeLoading}
                  onClick={() => handleStripePayments()}
                  className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isPocessing || stripeLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay with Stripe
                    </>
                  )}
                </button>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="bg-white rounded-3xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Pay with PayPal</h2>
                <PayPalButton
                  type={type}
                  id={getPayPalId()}
                  amount={amount}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                />
              </div>
            )}
          </div>

          {/* Right Column - Fee Details */}
          <div>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Summary</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {type === "missed_appointment_payment"
                          ? "Appointment Missed Fee"
                          : type === "auction_payment"
                            ? "Auction Won Payment"
                            : type === "penalized_product_payment"
                              ? "Penalized Product Penalty"
                              : "Store Creation Fee"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {type === "store_payment"
                          ? `${product}`
                            :`${product} ,${sku}`
                           }
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <span className="text-2xl font-bold text-gray-800">${amount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-[#FB3B11]">${amount}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-700">
                        <strong>Secure Payment:</strong> All payments are processed securely. Your payment information
                        is encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddCard && <StripeCardForm onClose={() => setShowAddCard(false)} onSuccess={handleAddCardSuccess} />}
      </AnimatePresence>
    </div>
  )
}
export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeeCindirmation />
    </Suspense>
  );
}

