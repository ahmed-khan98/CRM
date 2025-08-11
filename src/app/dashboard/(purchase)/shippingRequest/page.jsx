"use client"

import { useState } from "react"

import { Calendar, Clock, Edit, Phone, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate, formatTime12Hour } from "@/app/utilities/date"
import Tab from "@/app/_Components/Tab/page"
import { appointmentTabs } from "@/app/utilities/tabs/page"
import { useAllShippingRequestQuery } from "@/app/_Services/shippingRequest/page"
import Link from "next/link"

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

export default function page() {

    const [activeFilter, setActiveFilter] = useState("request")

    const { data, error: isError, isLoading } = useAllShippingRequestQuery()



    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "processing":
                return "text-gray-600 bg-gray-100";
            case "accept":
                return "text-blue-600 bg-blue-100";
            case "shipped":
                return "text-orange-600 bg-orange-100";
            case "delivered":
                return "text-green-600 bg-green-100";
            case "denied":
                return "text-red-600 bg-red-100";
            case "cancelled":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };


    const filteredNotifications = () => {
        if (!data?.data) return []
        if (activeFilter === "processing") {
            return data.data.filter((item) => item?.shippingStatus === "processing")
        } else if (activeFilter === "accept") {
            return data.data.filter((item) => item?.shippingStatus === "accept")
        } else if (activeFilter === "denied") {
            return data.data.filter((item) => item?.shippingStatus === "denied")
        } else if (activeFilter === "delivered") {
            return data.data.filter((item) => item?.shippingStatus === "delivered")
        } else if (activeFilter === "shipped") {
            return data.data.filter((item) => item?.shippingStatus === "shipped")
        } else {
            return data.data
        }
    }
    const filterData = ['request', 'accept', 'processing', 'shipped', 'delivered', 'denied']



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
                />
                <span className="ml-4 text-[#F33E0A] font-semibold">Loading your Shipping request... 🚀</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 sm:px-1 md:px-2">
            <div className="max-w-6xl mx-auto p-5 flex flex-col space-y-6">
                <Tab tabs={appointmentTabs} />
                <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
                    <div className="flex items-center gap-3">
                        <Truck className="h-7 w-7 text-red-600" />
                        <h3 className="text-[#242424] text-[24px] font-bold">Shipping Request</h3>
                    </div>

                    {/* <div className="flex bg-white rounded-full shadow-sm p-1">
                        {filterData?.map(e => <button
                            onClick={() => setActiveFilter(e)}
                            className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {e}
                        </button>)}

                    </div> */}
                </div>

                <motion.div variants={itemVariants} className="bg-white rounded-3xl mx-1 md:mx-0 p-4 md:p-8 shadow-xl border border-red-100">

                    {filteredNotifications()?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
                            <Truck className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No request</h3>
                            <p className="text-gray-500 mt-2">
                                {activeFilter === "all"
                                    ? "You don't have any request yet."
                                    : activeFilter === "processing"
                                        ? "You don't have any processing request."
                                        : activeFilter === "delivered"
                                            ? "You don't have any delivered request."
                                            : activeFilter === "denied"
                                                ? "You don't have any denied request."
                                                : activeFilter === "shipped"
                                                    ? "You don't have any shipped request."
                                                    : activeFilter === "accept"
                                                        ? "You don't have any accept request."
                                                        : "You don't have any request yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-200" >
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Product SKU
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Product Title
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Shpping Address
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Contact NO.
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Status
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredNotifications().map((shipping, index) => {
                                            // const lastFour = shipping.auctionWin?.product?._id.toString().slice(-4);
                                            return (
                                                <motion.tr
                                                    key={shipping._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="hover:bg-red-50 transition-colors"
                                                >
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="h-4 w-4 text-red-600" />
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {formatDate(shipping.createdAt)}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`${appointment.auctionWin?.product?.skuLocation}`}</td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-md  text-blue-600 capitalize"><Link href={`/detailproduct/${shipping.auctionWin?.product?._id}`}>{shipping.auctionWin?.product?.name}</Link></td>
                                                    <td className="px-3 py-4 whitespace-pre-line text-sm  text-gray-600">
                                                        {`${shipping.shippingAddress.street},${shipping.shippingAddress.zipCode},${shipping.shippingAddress.city},${shipping.shippingAddress.state},${shipping.shippingAddress.country}`} </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-4 w-4 text-red-600" />
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {shipping?.contactPhone}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${getStatusColor(shipping.shippingStatus)}`}
                                                        >
                                                            {shipping.shippingStatus.charAt(0).toUpperCase() + shipping.shippingStatus.slice(1)}
                                                        </span>
                                                    </td>

                                                    {/* <td className="px-3 py-4 whitespace-nowrap">
                                                    {shipping.status === "scheduled" ? (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleEdit(shipping)}
                                                            className="inline-flex items-center cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </motion.button>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td> */}
                                                </motion.tr>
                                            )
                                        })}
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
