"use client"

import { useState } from "react"
import { Calendar, Clock, CreditCard, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useAllAppointmentQuery } from "@/app/_Services/appointment/page"
import { formatDate, formatTime12Hour } from "@/app/utilities/date"
import Link from "next/link"
import { useAddPaymentMutation } from "@/app/_Services/payment/page"
import toast from "react-hot-toast"
import FeeTab from "@/app/_Components/Tab/FeeTab"
import { useRouter } from 'next/navigation'
import { truncateWords } from "@/app/utilities/ProductTitle"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function AppointmentBooking() {

  const router = useRouter()
  const [processingId, setProcessingId] = useState(null);
  const { data, error: isError, isLoading, refetch } = useAllAppointmentQuery()
  const [addPayment, { isLoading: isPocessing }] = useAddPaymentMutation()


  const filteredNotifications = () => {
    return data.data.filter((item) => (item?.status === "missed" && item?.paymentStatus === 'unpaid'))
  }

  const handlePayments = async (id) => {
    try {
      const response = await addPayment({
        appointmentId: id,
        type: "missed_appointment_payment",
      }).unwrap()
      if (response?.data?.url) {
        window.location.href = response?.data?.url
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#F33E0A] font-semibold">Loading your fees... 🚀</span>
      </div>
    )
  }


  return (
    <div className="min-h-screen  py-4 sm:px-1 md:px-2">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-6">
        {/* <Tab tabs={appointmentTabs} /> */}
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <DollarSign className="h-7 w-7 text-red-600" />
            <h3 className="text-[#242424] text-[24px] font-bold">Fees Due</h3>
          </div>
         <FeeTab/>
        </div>

        <motion.div variants={itemVariants} className="bg-white rounded-3xl mx-1 md:mx-0 p-4 md:p-8 shadow-xl border border-red-100">
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Calendar className="w-6 h-6 text-[#F33E0A]" />
            </div>
            Missed Appointments 
          </h3>

          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">No Missed appointments</h3>
              <p className="text-gray-500 mt-2">
                You don't have any missed appointments.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200" >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="b-[#5f2781]">
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
                      {/* <th className="px-3 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        SKU Location
                      </th> */}
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

                    const truncatedName = truncateWords(appointment.auctionWin?.product?.name, 8);
                      return (<motion.tr
                        key={appointment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:b-[#5f2781] transition-colors"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-semibold bg-zinc-800">
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
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`${appointment.auctionWin?.product?.sku}`}</td>
                        {/* <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${appointment.auctionWin?.product?.skuLocation},${appointment.auctionWin?.product?.skuRoom},${appointment.auctionWin?.product?.skuDetail}`}</td> */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 capitalize"><Link href={`/detailproduct/${appointment.auctionWin?.product?._id}`}>{truncatedName}</Link></td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100`}
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
                          <button
                            onClick={()=>router.push(`/dashboard/feeConfirmation?type=missed_appointment_payment&id=${appointment?._id}&amount=${5.00}&product=${appointment.auctionWin?.product?.name}&sku=${appointment.auctionWin?.product?.sku}`)}
                              // setProcessingId(appointment?._id)
                              // handlePayments(appointment?._id)}
                              
                            // disabled={processingId === appointment?._id && isPocessing}
                            className="cursor-pointer w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            {/* {(processingId === appointment?._id && isPocessing) ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <> */}
                                <CreditCard className="h-4 w-4" />
                                Pay $5.00
                              {/* </>
                            )} */}
                          </button>
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
      </div>
    </div>
  )
}
