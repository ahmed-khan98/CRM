"use client"

import { motion } from "framer-motion"
import { CreditCard, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation';

const WalletCard = ({ balance, currency, isActive,defaultCard,storeCredit,isStore }) => {
console.log( balance, currency, isActive,' balance, currency, isActive')
  const router =useRouter()

console.log(defaultCard,'defaultCard')
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#FB3B11] to-[#FF6B3D] rounded-3xl shadow-lg p-6 text-white overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 -mt-10 -mr-10 opacity-10">
          <div className="w-full h-full rounded-full border-8 border-white"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 -mt-20 -ml-20 rounded-full border-8 border-white"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-orange-100 text-sm mb-1">Wallet Balance</p>
              <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
            </div> 
            {isStore &&
            <div>
              <p className="text-orange-100 text-sm mb-1">Store Credit</p>
              <h2 className="text-3xl font-bold">{formatCurrency(storeCredit)}</h2>
            </div>}
            
            {isActive ? (
              <div className="flex items-center bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                <span className="text-xs font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center b-[#5f2781]0 bg-opacity-20 px-3 py-1 rounded-full">
                <AlertCircle className="h-4 w-4 mr-1 text-red-300" />
                <span className="text-xs font-medium">Inactive</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end">
            <div>
              {defaultCard ? (
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-orange-100" />
                  <div>
                    <p className="text-xs text-orange-100">Default Card</p>
                    <p className="text-sm font-medium">
                      {defaultCard.cardType} •••• {defaultCard.lastFourDigits}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-orange-100">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="text-sm">No default card</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 bg-opacity-20 hover:bg-opacity-30 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Deposit
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-white bg-opacity-20 text-gray-700 hover:bg-opacity-30 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Withdraw
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="flex justify-center -mt-5">
        <div className="bg-white rounded-full shadow-md flex divide-x divide-gray-100">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 flex items-center text-sm font-medium text-gray-700 hover:text-[#FB3B11] transition-colors"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Add Funds
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>router.push('/dashboard/wallet/ManageCard')}
            className="cursor-pointer px-5 py-3 flex items-center text-sm font-medium text-gray-700 hover:text-[#FB3B11] transition-colors"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Manage Cards
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default WalletCard