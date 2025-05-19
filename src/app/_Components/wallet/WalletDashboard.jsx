"use client"

import { useState,  } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, Plus,  Clock, Filter, ChevronDown } from 'lucide-react'
import WalletCard from "../../_Components/wallet/WalletCard"
import TransactionItem from "../../_Components/wallet/TransactionItem"
import AddCardModal from "../../_Components/wallet/AddCardModal"
import { useGetTransactionsQuery, useGetWalletQuery } from "@/app/_Services/wallet/page"

const WalletDashboard = () => {
  const [showAddCard, setShowAddCard] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)

  const { data: walletData, isLoading: isWalletLoading, refetch: refetchWallet } = useGetWalletQuery()
  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useGetTransactionsQuery({
    type: activeFilter === "ALL" ? undefined : activeFilter,
  })

  const handleAddCardSuccess = () => {
    setShowAddCard(false)
    refetchWallet()
  }

  const filterOptions = [
    { value: "ALL", label: "All Transactions" },
    { value: "DEPOSIT", label: "Deposits" },
    { value: "WITHDRAWAL", label: "Withdrawals" },
    { value: "PAYMENT", label: "Payments" },
    { value: "REFUND", label: "Refunds" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between  my-10 md:my-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Wallet className="mr-2 h-6 w-6 text-[#FB3B11]" />
            My Wallet
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-2 bg-[#FB3B11] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </motion.button>
        </div>

        {isWalletLoading ? (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-full w-1/2"></div>
          </div>
        ) : (
          <WalletCard
            balance={walletData?.data?.balance || 0}
            currency={walletData?.data?.currency || "USD"}
            isActive={walletData?.data?.isActive || false}
          />
        )}

        <div className="bg-white rounded-3xl shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#FB3B11]" />
              Transaction History
            </h2>
            
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-600" />
                {filterOptions.find(option => option.value === activeFilter)?.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-45 bg-white rounded-xl shadow-lg z-10 py-1 border border-gray-100"
                  >
                    {filterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveFilter(option.value)
                          setShowFilters(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          activeFilter === option.value ? 'font-medium text-[#FB3B11] bg-orange-50' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {isTransactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse flex items-center p-3 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : transactionsData?.data?.transactions?.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No transactions yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Your transaction history will appear here once you start using your wallet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactionsData?.data?.transactions?.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))}
              
              {transactionsData?.data?.pagination?.total > transactionsData?.data?.transactions?.length && (
                <div className="text-center pt-4">
                  <button className="text-[#FB3B11] text-sm font-medium hover:underline">
                    View More Transactions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddCard && (
          <AddCardModal onClose={() => setShowAddCard(false)} onSuccess={handleAddCardSuccess} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WalletDashboard