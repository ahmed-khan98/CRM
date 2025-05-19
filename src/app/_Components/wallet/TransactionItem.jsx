"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, CreditCard, ShoppingCart, RefreshCw } from 'lucide-react'


const TransactionItem = ({ transaction }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "PAYMENT":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />
      case "REFUND":
        return <RefreshCw className="h-5 w-5 text-purple-500" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />
    }
  }

  const getTransactionColor = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return "text-green-600"
      case "WITHDRAWAL":
        return "text-red-600"
      case "PAYMENT":
        return "text-blue-600"
      case "REFUND":
        return "text-purple-600"
      default:
        return "text-gray-700"
    }
  }

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return "Deposit"
      case "WITHDRAWAL":
        return "Withdrawal"
      case "PAYMENT":
        return "Payment"
      case "REFUND":
        return "Refund"
      case "TRANSFER":
        return "Transfer"
      default:
        return transaction.type
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'never',
    }).format(Math.abs(amount))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors"
    >
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-3">
          {getTransactionIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800">{getTransactionTypeLabel()}</h4>
              <p className="text-xs text-gray-500">
                {transaction.description || "Transaction"} • {formatDate(transaction.createdAt)}
              </p>
            </div>
            
            <div className={`font-bold ${getTransactionColor()}`}>
              {transaction.amount >= 0 ? "+" : "-"}{formatAmount(transaction.amount)}
            </div>
          </div>
          
          {transaction.cardId && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <CreditCard className="h-3 w-3 mr-1" />
              {transaction.cardId.cardType} •••• {transaction.cardId.lastFourDigits}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionItem