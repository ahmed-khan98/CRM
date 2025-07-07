"use client"

import { useState } from "react"

import { Calendar, Clock, Edit,Truck } from "lucide-react"
import { motion } from "framer-motion"
import { useAllAppointmentQuery } from "@/app/_Services/appointment/page"
import { formatDate, formatTime12Hour } from "@/app/utilities/date"
import EditAppointmentModal from "@/app/_Components/Modal/EditAppointmentModal"
import Tab from "@/app/_Components/Tab/page"
import { appointmentTabs } from "@/app/utilities/tabs/page"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function AppointmentBooking() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, error: isError, isLoading, refetch } = useAllAppointmentQuery()

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAppointment(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100"
      case "completed":
        return "text-green-600 bg-green-100"
      case "missed":
        return "text-red-600 bg-red-100"
      case "cancelled":
        return "text-gray-600 bg-gray-100"
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
    } else if (activeFilter === "missed") {
      return data.data.filter((item) => item?.status === "missed")
    } else if (activeFilter === "cancelled") {
      return data.data.filter((item) => item?.status === "cancelled")
    } else {
      return data.data
    }
  }
  const filterData=[
    'all',
    'scheduled',
    'completed',
    'missed',
    'cancelled',
  ]


  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#F33E0A] font-semibold">Loading your pick up appointment... 🚀</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-6">
      <Tab tabs={appointmentTabs}/>
      <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-red-600" />
            <h3 className="text-[#242424] text-[24px] font-bold">Appointments</h3>
          </div>

          <div className="flex bg-white rounded-full shadow-sm p-1">
            {filterData?.map(e=>   <button
              onClick={() => setActiveFilter(e)}
              className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${
                activeFilter === e ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {e}
            </button>)}
       
          </div>
        </div>

        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Calendar className="w-6 h-6 text-[#F33E0A]" />
            </div>
            Your Won Product Pick Up Appointments
          </h3>

          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No appointments</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any appointments yet."
                  : activeFilter === "scheduled"
                    ? "You don't have any scheduled appointments."
                    : activeFilter === "missed"
                      ? "You don't have any missed appointments."
                      : "You don't have any cancelled appointments."}
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
                        Time
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Product SKU
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        SKU Location
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Product Title
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Penalty Fee
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((appointment, index) => {
                        const lastFour = appointment.auctionWin?.product?._id.toString().slice(-4).toUpperCase();
                      return(<motion.tr
                        key={appointment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatDate(appointment.appointmentDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-gray-600">
                              {formatTime12Hour(appointment.appointmentTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${lastFour}`}</td>
                        <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${appointment.auctionWin?.product?.skuLocation},${appointment.auctionWin?.product?.skuRoom},${appointment.auctionWin?.product?.skuDetail}`}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize"><Link href={`/detailproduct/${appointment.auctionWin?.product?._id}`}>{appointment.auctionWin?.product?.name}</Link></td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {appointment.penaltyApplied ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                              💰 $5.00
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm items-center">N/A</span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {appointment.status === "scheduled" ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(appointment)}
                              className="inline-flex items-center cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </motion.button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </motion.tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Appointment Modal */}
        <EditAppointmentModal isModalOpen={isModalOpen} editingAppointment={editingAppointment} closeModal={closeModal} refetch={refetch}/>
      </div>
    </div>
  )
}
