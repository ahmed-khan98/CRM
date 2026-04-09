"use client";

import { useState } from "react";

import { Users, Clock, Edit, Plus, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useAllAppointmentQuery } from "@/app/_Services/appointment/page";
import { formatDate, formatTime12Hour } from "@/app/utilities/date";
import Link from "next/link";
import { truncateWords } from "@/app/utilities/ProductTitle";
import PickupDropOffModal from "@/app/_Components/Modal/PickupDropOffModal";
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AppointmentBooking() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error: isError, isLoading, refetch } = useAllAppointmentQuery();

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "missed":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredNotifications = () => {
    if (!data?.data) return [];
    if (activeFilter === "scheduled") {
      return data.data.filter((item) => item?.status === "scheduled");
    } else if (activeFilter === "completed") {
      return data.data.filter((item) => item?.status === "completed");
    } else if (activeFilter === "missed") {
      return data.data.filter((item) => item?.status === "missed");
    } else if (activeFilter === "cancelled") {
      return data.data.filter((item) => item?.status === "cancelled");
    } else {
      return data.data;
    }
  };

  const filterData = ["all", "scheduled", "completed", "missed", "cancelled"];

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-gray-800 font-semibold">
          Loading your Employees... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-4 sm:px-1 md:px-2">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-gray-800" />
            <h3 className="text-[#242424] text-[24px] font-bold">
              All Employees
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Employee
            </motion.button>
            <div className="flex bg-white rounded-full shadow-sm p-1">
              {filterData?.map((e) => (
                <button
                  onClick={() => setActiveFilter(e)}
                  className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${
                    activeFilter === e
                      ? "bg-zinc-800 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl mx-1 md:mx-0 p-4 md:p-4 shadow-xl border border-red-100"
        >
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Employee
              </h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Employee yet."
                  : activeFilter === "scheduled"
                  ? "You don't have any scheduled Employee."
                  : activeFilter === "completed"
                  ? "You don't have any completed Employee."
                  : activeFilter === "missed"
                  ? "You don't have any missed Employee."
                  : "You don't have any cancelled Employee."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-100">
                    <tr>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        Product SKU
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        SKU Location
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        Product Title
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      {(activeFilter === "all" ||
                        activeFilter === "missed") && (
                        <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                          Penalty Fee
                        </th>
                      )}
                      {activeFilter === "missed" && (
                        <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                          Payment Status
                        </th>
                      )}
                      {activeFilter === "scheduled" && (
                        <th className="px-3 py-4 text-left text-sm font-semiboldtext-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((appointment, index) => {
                      const truncatedName = truncateWords(
                        appointment.auctionWin?.product?.name,
                        4
                      );
                      return (
                        <motion.tr
                          key={appointment._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-zinc-200 transition-colors"
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-gray-800" />
                              <span className="text-sm font-semibold bg-zinc-800">
                                {formatDate(appointment.appointmentDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-800" />
                              <span className="text-sm text-gray-600">
                                {formatTime12Hour(appointment.appointmentTime)}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`${appointment.auctionWin?.product?.sku}`}</td>
                          <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${appointment.auctionWin?.product?.skuLocation},${appointment.auctionWin?.product?.skuRoom},${appointment.auctionWin?.product?.skuDetail}`}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-md text-blue-600 capitalize">
                            <Link
                              href={`/detailproduct/${appointment.auctionWin?.product?._id}`}
                            >
                              {truncatedName}
                            </Link>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          </td>
                          {(activeFilter === "all" ||
                            activeFilter === "missed") && (
                            <td className="px-3 py-4 whitespace-nowrap">
                              {appointment.penaltyApplied ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                                  💰 $5.00
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm items-center">
                                  N/A
                                </span>
                              )}
                            </td>
                          )}
                          {activeFilter === "missed" && (
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  appointment.paymentStatus === "unpaid"
                                    ? "text-gray-800 bg-red-100"
                                    : "text-green-600 bg-green-100"
                                }`}
                              >
                                {appointment?.paymentStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  appointment?.paymentStatus.slice(1)}
                              </span>
                            </td>
                          )}
                            <td className="px-3 py-4 whitespace-nowrap">
                              {appointment.status === "scheduled" ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEdit(appointment)}
                                  className="inline-flex items-center cursor-pointer px-3 py-2 bg-zinc-800 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </motion.button>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Appointment Modal */}
        <PickupDropOffModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
