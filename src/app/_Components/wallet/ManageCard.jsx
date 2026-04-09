"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Trash2, Check, Plus, AlertCircle } from 'lucide-react'
// import AddCardModal from "../../_Components/wallet/AddCardModal"
import { toast } from "react-hot-toast"
import { useDeleteCardMutation, useGetCardsQuery, useSetDefaultCardMutation } from "@/app/_Services/wallet/page"
import StripeCardForm from "./StripeCardForm"

const ManageCards = () => {
  const [showAddCard, setShowAddCard] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data: cardsData, isLoading, refetch } = useGetCardsQuery()
  const [setDefaultCard, { isLoading: isSettingDefault }] = useSetDefaultCardMutation()
  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation()

  const handleAddCardSuccess = () => {
    setShowAddCard(false)
    refetch()
  }

  const handleSetDefault = async (cardId) => {
    try {
      await setDefaultCard(cardId).unwrap()
      toast.success("Default card updated")
      refetch()
    } catch (error) {
      toast.error(error.data?.message || "Failed to update default card")
    }
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId).unwrap()
      toast.success("Card removed successfully")
      setConfirmDelete(null)
      refetch()
    } catch (error) {
      toast.error(error.data?.message || "Failed to remove card")
    }
  }

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

  return (
    <div className="min-h-screen  py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between  my-10 md:my-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-[#FB3B11]" />
            My Cards
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddCard(true)}
            className="cursor-pointer flex items-center gap-2 bg-[#FB3B11] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Card
          </motion.button>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Cards</h2>

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
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mbg-zinc-800">
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
            <div className="space-y-4">
              {cardsData?.data?.map((card) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border ${card.isDefault ? 'border-[#FB3B11]' : 'border-gray-200'} rounded-xl p-5 relative ${card.isDefault ? 'bg-orange-50' : 'bg-white'}`}
                >
                  {confirmDelete === card._id ? (
                    <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
                      <div className="text-center p-4">
                        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Remove this card?</h3>
                        <p className="text-gray-600 mbg-zinc-800">This action cannot be undone.</p>
                        <div className="flex justify-center space-x-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDelete(null)}
                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm font-medium"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCard(card._id)}
                            disabled={isDeleting}
                            className="cursor-pointer px-4 py-2 b-[#5f2781]0 text-white rounded-full text-sm font-medium flex items-center"
                          >
                            {isDeleting ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                Removing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        {getCardTypeIcon(card.cardType)}
                        <span className="ml-2 text-lg font-medium">•••• {card.lastFourDigits}</span>
                        {card.isDefault && (
                          <span className="ml-2 bg-[#FB3B11] text-white text-xs px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{card.cardHolderName}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!card.isDefault && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSetDefault(card._id)}
                          disabled={isSettingDefault}
                          className="cursor-pointer text-[#FB3B11] hover:bg-orange-50 p-2 rounded-full transition-colors"
                          title="Set as Default"
                        >
                          <Check className="h-5 w-5" />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDelete(card._id)}
                        className="cursor-pointer text-gray-500 hover:text-red-500 hover:b-[#5f2781] p-2 rounded-full transition-colors"
                        title="Remove card"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* <div className="bg-white rounded-3xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mbg-zinc-800">Card Security</h2>
          <p className="text-gray-600 mb-6">
            Your card information is securely stored and processed according to PCI DSS standards. We never store your full card number or CVV.
          </p>
          
          <div className="space-y-4">
            <motion.div
              // whileHover={{ x: 5 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Manage Payment Limits</h3>
                  <p className="text-sm text-gray-500">Set daily and monthly limits for your cards</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>
            
            <motion.div
              // whileHover={{ x: 5 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Transaction Notifications</h3>
                  <p className="text-sm text-gray-500">Get alerts for all card transactions</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
        </div> */}
      </div>

      <AnimatePresence>
        {showAddCard && (
          <StripeCardForm onClose={() => setShowAddCard(false)} onSuccess={handleAddCardSuccess} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageCards