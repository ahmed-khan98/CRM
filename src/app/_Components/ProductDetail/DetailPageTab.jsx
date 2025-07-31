"use client"

import { useState } from "react"
import { Check, Copy, Package, Truck, Info } from "lucide-react"
import { motion } from "framer-motion"

const DetailPageTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("item_spec")
  // const [copiedIndex, setCopiedIndex] = useState(null)

  // const handleCopy = (value, index) => {
  //   navigator.clipboard.writeText(value || "").then(() => {
  //     setCopiedIndex(index)
  //     setTimeout(() => setCopiedIndex(null), 1500)
  //   })
  // }

  // Transform object data to array format for display
  const transformDataToArray = (obj) => {
    if (!obj || typeof obj !== "object") return []

    return Object.entries(obj).map(([key, value]) => ({
      name: key.replace(/_/g, " ").toUpperCase(),
      value: value?.toString() || "",
    }))
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

  const getTabData = (tabKey) => {
    const tabData = data?.[tabKey]

    if (Array.isArray(tabData)) {
      return tabData
    }

    if (tabData && typeof tabData === "object") {
      return transformDataToArray(tabData)
    }

    return []
  }

  const getCustomTabData = (tabKey) => {
    const customKey = `custom${tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}`
    const customData = data?.[customKey]
    console.log(customData, 'customData')
    console.log(customKey, 'customKey')
    if (Array.isArray(customData)) {
      return customData.map((item) => ({
        name: item.name?.toUpperCase() || "",
        value: item.value || "",
      }))
    }

    return []
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex bg-gray-200 rounded-full p-1 shadow-md">
          {tabs?.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${tab.key === activeTab ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-900"
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
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        {activeTab === 'item_spec' && <div className="flex gap-2 hover:bg-gray-100 transition-colors">

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide bg-gray-300 p-3 rounded-lg">
              ITEM CONDITION
            </p>
          </div>
          <div className="flex-2 min-w-0 flex items-center gap-2">
            <p className="font-medium text-gray-700 break-words p-3 bg-gray-200 rounded-lg flex-1">
              {data?.condition}
            </p>

          </div></div>}
        {(() => {
          const tabData = getTabData(activeTab)
          const customTabData = getCustomTabData(activeTab)
          const allData = [...tabData, ...customTabData]

          return allData.length > 0 ? (
            allData.map((item, index) => {
              // const isASIN = item?.name === "ASIN"

              return (
                <div key={index} className="flex gap-2 hover:bg-gray-100 transition-colors">

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide bg-gray-300 p-3 rounded-lg">
                      {item?.name}
                    </p>
                  </div>
                  <div className="flex-2 min-w-0 flex items-center gap-2">
                    <p className="font-medium text-gray-700 break-words p-3 bg-gray-200 rounded-lg flex-1">
                      {item?.value}
                    </p>
                    {/* {isASIN && (
                      <button
                        onClick={() => handleCopy(item?.value, index)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                    )} */}
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
          )
        })()}
      </motion.div>
    </div>
  )
}

export default DetailPageTab
