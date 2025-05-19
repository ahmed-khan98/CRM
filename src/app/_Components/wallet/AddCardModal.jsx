"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, CreditCard, Check } from 'lucide-react'
import { toast } from "react-hot-toast"
import { useAddCardMutation } from "@/app/_Services/wallet/page"


const AddCardModal = ({ onClose, onSuccess }) => {
  const [addCard, { isLoading }] = useAddCardMutation()
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "VISA",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim()
      setFormData({ ...formData, [name]: formatted })
      return
    }
    
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const newErrors= {}
    
    if (!formData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number format"
    }
    
    if (!formData.cardHolderName) {
      newErrors.cardHolderName = "Cardholder name is required"
    }
    
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Month is required"
    }
    
    if (!formData.expiryYear) {
      newErrors.expiryYear = "Year is required"
    } else {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1
      
      if (parseInt(formData.expiryYear) < currentYear) {
        newErrors.expiryYear = "Card is expired"
      } else if (
        parseInt(formData.expiryYear) === currentYear && 
        parseInt(formData.expiryMonth) < currentMonth
      ) {
        newErrors.expiryMonth = "Card is expired"
      }
    }
    
    if (!formData.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      // Remove spaces from card number before sending
      const cardData = {
        ...formData,
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
      }
      
      await addCard(cardData).unwrap()
      toast.success("Card added successfully")
      onSuccess()
    } catch (error) {
      toast.error(error.data?.message || "Failed to add card")
    }
  }

  const detectCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, "")
    
    if (/^4/.test(number)) return "VISA"
    if (/^5[1-5]/.test(number)) return "MASTERCARD"
    if (/^3[47]/.test(number)) return "AMEX"
    if (/^6(?:011|5)/.test(number)) return "DISCOVER"
    
    return "OTHER"
  }

  // Update card type when card number changes
  const cardType = detectCardType(formData.cardNumber)
  if (cardType !== formData.cardType) {
    setFormData({ ...formData, cardType })
  }

  // Generate years for dropdown (current year + 10 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
     
      className=" fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className={`relative border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} rounded-xl focus-within:ring-2 focus-within:ring-[#FB3B11] focus-within:border-[#FB3B11]`}>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {cardType === "VISA" && <span className="font-bold text-blue-600">VISA</span>}
                  {cardType === "MASTERCARD" && <span className="font-bold text-red-600">MC</span>}
                  {cardType === "AMEX" && <span className="font-bold text-blue-500">AMEX</span>}
                  {cardType === "DISCOVER" && <span className="font-bold text-orange-500">DISC</span>}
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border ${errors.cardHolderName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]`}
              />
              {errors.cardHolderName && <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border ${errors.expiryMonth ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]`}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                  </div>
                  <div>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border ${errors.expiryYear ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]`}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB3B11] focus:border-[#FB3B11]`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#FB3B11] text-white py-3 rounded-xl font-medium hover:bg-[#e03610] transition-colors flex items-center justify-center disabled:opacity-70"
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
            Your card information is securely stored and processed according to PCI DSS standards.
          </p>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AddCardModal