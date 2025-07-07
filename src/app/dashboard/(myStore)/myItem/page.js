"use client"

import { useState } from "react"

import { Calendar, Clock, Edit, Store, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { useAllAppointmentQuery } from "@/app/_Services/appointment/page"
import { formatDate, formatTime12Hour } from "@/app/utilities/date"
import EditAppointmentModal from "@/app/_Components/Modal/EditAppointmentModal"
import Tab from "@/app/_Components/Tab/page"
import { appointmentTabs } from "@/app/utilities/tabs/page"
import { useMyStoreItemsQuery } from "@/app/_Services/store/page"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("all")

  const { data, error: isError, isLoading } = useMyStoreItemsQuery()

  const getStatusColor = (status) => {
    console.log(status,'status')
    switch (status) {
      case "scheduled":
        return "text-gray-600 bg-gray-100"
      case true :
        return "text-green-600 bg-green-100"
      case 'ended' :
        return "text-green-600 bg-green-100"
      case 'active' :
        return "text-blue-600 bg-blue-100"
      case false :
        return "text-yellow-600 bg-yellow-100"
      case false :
        return "text-yellow-600 bg-yellow-100"
      case "discarded":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const filteredNotifications = () => {
    if (!data?.data) return []
    if (activeFilter === "sold") {
      return data.data.filter((item) => item?.isSold)
    } else if (activeFilter === "unsold") {
      return data.data.filter((item) => !item?.isSold)
    } else if (activeFilter === "discarded") {
      return data.data.filter((item) => item?.status === "discarded")
    } else {
      return data.data
    }
  }
  const filterData = [
    'all',
    'sold',
    'unsold',
    'discarded',
  ]



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#F33E0A] font-semibold">Loading your Store Items... 🚀</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Store className="h-7 w-7 text-red-600" />
            <h3 className="text-[#242424] text-[24px] font-bold">My Items</h3>
          </div>

          <div className="flex bg-white rounded-full shadow-sm p-1">
            {filterData?.map(e => <button
              onClick={() => setActiveFilter(e)}
              className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {e}
            </button>)}

          </div>
        </div>

        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-xl border border-red-100">


          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Store className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Item</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any item yet."
                  : activeFilter === "sold"
                    ? "You don't have any sold item."
                    : activeFilter === "unsold"
                      ? "You don't have any unsold item."
                      : "You don't have any discarded item."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200" >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-red-50">
                    <tr>
                    <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        SKU Location
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Current Bid
                      </th>
                    
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Sold Status
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Auction Status                      </th>
                      {/* <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((product, index) => {
                       const lastFour = product?._id.toString().slice(-4).toUpperCase();
                      return(
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600"> <img
                          src={product?.images?.[0]}
                          alt="Product-img"
                          onClick={() => router.push(`/detailproduct/${item._id}`)}
                          className="w-20 h-15 rounded-lg"
                        /></td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${lastFour}`}</td>
                        <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${product?.skuLocation},${product?.skuRoom},${product?.skuDetail}`}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{product?.name}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{product?.price}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{product?.highestBid}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.isSold)}`}
                          >
                            {product.isSold? 'Sold ':'Un Sold'}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                          >
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </span>
                        </td>
                        {/* <td className="px-3 py-4 whitespace-nowrap">
                          {product.status ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                              💰 $5.00
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm items-center">N/A</span>
                          )}
                        </td> */}
                      
                      </motion.tr>
                  )  })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
