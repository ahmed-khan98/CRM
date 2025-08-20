"use client"

import { useState } from "react"

import { BoxIcon, Calendar, Clock, Edit, Plus, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate, formatTime12Hour } from "@/app/utilities/date"
import { useAllBoxProductQuery } from "@/app/_Services/Box/page"
import BoxModal from "@/app/_Components/Modal/BoxModal"
import Tab from "@/app/_Components/Tab/page"

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
    const [editingBox, setEditingBox] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data, error: isError, isLoading, refetch } = useAllBoxProductQuery()
    console.log(data, 'allBox')

    const handleEdit = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingBox(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled":
                return "text-blue-600 bg-blue-100"
            case "completed":
                return "text-green-600 bg-green-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const filteredNotifications = () => {
        if (!data?.data) return []
        if (activeFilter === "scheduled") {
            return data.data.filter((item) => item?.status === "scheduled")
        } else if (activeFilter === "completed") {
            return data.data.filter((item) => item?.status === "completed")
        } else if (activeFilter === "draft") {
            return data.data.filter((item) => item?.status === "draft")
        } else {
            return data.data
        }
    }
    const filterData = [
        'all',
        'draft',
        'scheduled',
        'completed',
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
                />
                <span className="ml-4 text-[#F33E0A] font-semibold">Loading your Product Box... 🚀</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 sm:px-1 md:px-2">
            <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-6">
                <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
                    <div className="flex items-center gap-3">
                        <BoxIcon className="h-7 w-7 text-red-600" />
                        <h3 className="text-[#242424] text-[24px] font-bold">Product Boxes</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 cursor-pointer bg-[#FB3B11] text-white px-4 rounded-full text-sm font-medium hover:bg-[#e03610] transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Box
                        </motion.button>
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
                </div>

                <motion.div variants={itemVariants} className="bg-white rounded-3xl mx-1 md:mx-0 p-4 md:p-8 shadow-xl border border-red-100">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-2xl">
                            <BoxIcon className="w-6 h-6 text-[#F33E0A]" />
                        </div>
                        All Box
                    </h3>

                    {filteredNotifications()?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
                            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No Box</h3>
                            <p className="text-gray-500 mt-2">
                                {activeFilter === "all"
                                    ? "You don't have any Product box yet."
                                    : activeFilter === "scheduled"
                                        ? "You don't have any scheduled Product box."
                                        : activeFilter === "completed"
                                            ? "You don't have any completed Product box."
                                            : "You don't have any draft Product box."}
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
                                                Note
                                            </th>

                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Product SKU | Title
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Product Count
                                            </th>
                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Status
                                            </th>

                                            <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredNotifications().map((e, index) => {
                                            // const lastFour = e.auctionWin?.product?._id.toString().slice(-4);
                                            return (<motion.tr
                                                key={e._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-red-50 transition-colors"
                                            >
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-4 w-4 text-red-600" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {formatDate(e.createdAt)}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{`${e.notes}`}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                    {!e?.products?.length
                                                        ? "Empty Box"
                                                        : e?.products?.map((p, i) => (
                                                            <span key={i}>
                                                                {`${p?.sku} | ${p?.name}`}
                                                                {i < e.products.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{e?.products?.length}</td>
                                                {/* <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${e.auctionWin?.product?.skuLocation},${e.auctionWin?.product?.skuRoom},${e.auctionWin?.product?.skuDetail}`}</td> */}
                                                {/* <td className="px-3 py-4 whitespace-nowrap text-md text-blue-600 capitalize"><Link href={`/detailproduct/${e.auctionWin?.product?._id}`}>{e.auctionWin?.product?.name}</Link></td> */}
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(e.status)}`}
                                                    >
                                                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setEditingBox(e)
                                                            handleEdit()
                                                        }}
                                                        className="inline-flex items-center cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </motion.button>

                                                </td>


                                            </motion.tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Edit Appointment Modal */}
                <BoxModal isModalOpen={isModalOpen} editingBox={editingBox} closeModal={closeModal} refetch={refetch} />
            </div>
        </div>
    )
}
