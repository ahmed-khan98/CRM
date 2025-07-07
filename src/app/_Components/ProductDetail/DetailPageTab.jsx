"use client"

import { useState } from "react"
import { Check, Copy, Package, Truck, Info } from "lucide-react"
import { motion } from "framer-motion"

const DetailPageTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("item_spec")
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleCopy = (value, index) => {
    navigator.clipboard.writeText(value || "").then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    })
  }

  const tabs = [
    {
      key: "item_spec",
      label: "Item Spec",
      color: "#3B82F6",
      icon: Package,
    },
    {
      key: "shipping",
      label: "Shipping",
      color: "#10B981",
      icon: Truck,
    },
    {
      key: "details",
      label: "More Info",
      color: "#F33E0A",
      icon: Info,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex bg-gray-50 rounded-full p-2 shadow-md">
          {tabs?.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-200 ${
                  tab.key === activeTab ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.key === activeTab && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: tab.color }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        {data?.[activeTab]?.length > 0 ? (
          data[activeTab].map((item, index) => {
            const isASIN = item?.name === "ASIN"
            const displayValue = isASIN ? item?.code : item?.value

            return (
              <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{item?.name}</p>
                </div>
                <div className="flex-2 flex items-center justify-between min-w-0">
                  <p className="font-medium text-gray-700 break-words">{displayValue}</p>
                  {isASIN && (
                    <button
                      onClick={() => handleCopy(item?.value, index)}
                      className={`ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        copiedIndex === index
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={12} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No {tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} information available
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DetailPageTab
