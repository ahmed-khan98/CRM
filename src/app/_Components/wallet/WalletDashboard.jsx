"use client"

import { useEffect, useState,  } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, Plus, Clock, Filter, ChevronDown, AlertCircle, CheckCircle, ExternalLink,DollarSign  } from "lucide-react"
import WalletCard from "../../_Components/wallet/WalletCard"
import TransactionItem from "../../_Components/wallet/TransactionItem"
import AddCardModal from "../../_Components/wallet/AddCardModal"
import { useCreateConnectAccountMutation, useGetConnectAccountQuery, useGetTransactionsQuery, useGetWalletQuery } from "@/app/_Services/wallet/page"
import StripeCardForm from "./StripeCardForm"
import toast from "react-hot-toast"

const WalletDashboard = () => {
  const [showAddCard, setShowAddCard] = useState(false)
  const [showStripeForm, setShowStripeForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)
  const {
    data: connectAccountData,
    isLoading: isConnectLoading,
    refetch: refetchConnectAccount,
  } = useGetConnectAccountQuery()
  const [createConnectAccount, { isLoading: isCreatingConnect }] = useCreateConnectAccountMutation()  

  const { data: walletData, isLoading: isWalletLoading, refetch: refetchWallet } = useGetWalletQuery()
  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useGetTransactionsQuery({
    type: activeFilter === "ALL" ? undefined : activeFilter,
  })
console.log(connectAccountData,'connectAccountData')


  // Check connect account status on component mount
  useEffect(() => {
    refetchConnectAccount()
  }, [refetchConnectAccount])

  const handleCardSuccess = (paymentMethod) => {
    console.log("Card added successfully:", paymentMethod)
    setShowStripeForm(false)
    setShowAddCard(false)
  }
  const onClose=()=>{
    setShowStripeForm(false)

  }

  const filterOptions = [
    { value: "ALL", label: "All Transactions" },
    { value: "DEPOSIT", label: "Deposits" },
    { value: "WITHDRAWAL", label: "Withdrawals" },
    { value: "PAYMENT", label: "Payments" },
    { value: "REFUND", label: "Refunds" },
  ]


  const handleConnect = async () => {
    try {
      const response = await createConnectAccount().unwrap()
      console.log(response, "response")
      if (response.success) {
        if (response?.data?.url) {
          window.location.href = response.data.url
        } else {
          toast.success("Connect account created successfully!")
          refetchConnectAccount()
        }
      } else {
        toast.error(response.message || "Failed to process Connect account")
      }
    } catch (error) {
      console.log("Error creating connect account:", error)
      toast.error(error.data?.message || "An error occurred")
    }
  }

  const handleRequestPayout = () => {
    // Navigate to payout request page or open payout modal
    toast.success("Payout request feature coming soon!")
  }

  const getConnectAccountStatus = () => {
    if (isConnectLoading) {
      return {
        status: "loading",
        message: "Checking account status...",
        showButton: false,
        showPayoutButton: false,
        buttonText: "",
        buttonAction: null,
      }
    }

    if (!connectAccountData?.data) {
      return {
        status: "no-account",
        message: "No Connect account found. Create one to receive payouts.",
        showButton: true,
        showPayoutButton: false,
        buttonText: "Create Connect Account",
        buttonAction: handleConnect,
      }
    }

    const account = connectAccountData.data
    const payoutsEnabled = account.payouts_enabled
    const chargesEnabled = account.charges_enabled
    const detailsSubmitted = account.details_submitted

    if (!payoutsEnabled) {
      return {
        status: "disabled",
        message: "Your Connect account needs to be completed to enable payouts.",
        showButton: true,
        showPayoutButton: false,
        buttonText: "Complete Account Setup",
        buttonAction: handleConnect,
      }
    }

    if (payoutsEnabled && chargesEnabled && detailsSubmitted) {
      return {
        status: "enabled",
        message: "Your Connect account is active and ready for payouts.",
        showButton: false,
        showPayoutButton: true,
        buttonText: "",
        buttonAction: null,
      }
    }

    return {
      status: "pending",
      message: "Your account is being reviewed. Payouts will be enabled soon.",
      showButton: false,
      showPayoutButton: false,
      buttonText: "",
      buttonAction: null,
    }
  }

  const connectStatus = getConnectAccountStatus()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-10 md:my-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Wallet className="mr-2 h-6 w-6 text-[#FB3B11]" />
            My Wallet
          </h1>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStripeForm(true)}
              className="flex items-center gap-2 cursor-pointer bg-[#FB3B11] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Card
            </motion.button>
          </div>
        </div>

        {/* Connect Account Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md p-6 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  connectStatus.status === "enabled"
                    ? "bg-green-100"
                    : connectStatus.status === "loading"
                      ? "bg-gray-100"
                      : connectStatus.status === "pending"
                        ? "bg-blue-100"
                        : "bg-orange-100"
                }`}
              >
                {connectStatus.status === "enabled" ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : connectStatus.status === "loading" ? (
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : connectStatus.status === "pending" ? (
                  <Clock className="h-6 w-6 text-blue-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Stripe Connect Account</h3>
                <p className="text-gray-600 text-sm mb-2">{connectStatus.message}</p>
                {connectAccountData?.data && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Account ID: {connectAccountData.data.id}</div>
                    <div className="flex gap-4 text-xs">
                      <span
                        className={`${connectAccountData.data.charges_enabled ? "text-green-600" : "text-red-600"}`}
                      >
                        Charges: {connectAccountData.data.charges_enabled ? "Enabled" : "Disabled"}
                      </span>
                      <span
                        className={`${connectAccountData.data.payouts_enabled ? "text-green-600" : "text-red-600"}`}
                      >
                        Payouts: {connectAccountData.data.payouts_enabled ? "Enabled" : "Disabled"}
                      </span>
                      <span
                        className={`${connectAccountData.data.details_submitted ? "text-green-600" : "text-orange-600"}`}
                      >
                        Details: {connectAccountData.data.details_submitted ? "Submitted" : "Pending"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {connectStatus.showButton && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={connectStatus.buttonAction}
                  disabled={isCreatingConnect}
                  className="flex items-center gap-2 cursor-pointer bg-[#FB3B11] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingConnect ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      {connectStatus.buttonText}
                    </>
                  )}
                </motion.button>
              )}
              {connectStatus.showPayoutButton && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRequestPayout}
                  className="flex items-center gap-2 cursor-pointer bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <DollarSign className="h-4 w-4" />
                  Request Payout
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Wallet Card */}
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

        {/* Transaction History */}
        <div className="bg-white rounded-3xl shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#FB3B11]" />
              Transaction History
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-600" />
                {filterOptions.find((option) => option.value === activeFilter)?.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-45 bg-white rounded-xl shadow-lg z-10 py-1 border border-gray-100"
                  >
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveFilter(option.value)
                          setShowFilters(false)
                        }}
                        className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          activeFilter === option.value ? "font-medium text-[#FB3B11] bg-orange-50" : "text-gray-700"
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
                  <button className="text-[#FB3B11] text-sm font-medium hover:underline">View More Transactions</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} onSuccess={handleCardSuccess} />}
      </AnimatePresence>

      <AnimatePresence>
        {showStripeForm && <StripeCardForm onSuccess={handleCardSuccess} onClose={onClose} />}
      </AnimatePresence>
    </div>
  )
}

export default WalletDashboard
