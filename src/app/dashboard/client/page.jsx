"use client";

import { useCallback, useState } from "react";
import {
  Users,
  Edit,
  Plus,
  DeleteIcon,
  MoreVertical,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  useAllClientsQuery,
  useDeleteClientMutation,
} from "@/app/_Services/Client/page";
import ClientModal from "@/app/_Components/Modal/ClientModal";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import Image from "next/image";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import toast from "react-hot-toast";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Client() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllClientsQuery();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-300";
      case "completed":
        return "text-green-600 bg-green-300";
      case "missed":
        return "text-red-600 bg-red-300";
      case "cancelled":
        return "text-gray-800 bg-gray-300";
      default:
        return "text-[#5f2760] bg-purple-300";
    }
  };

  const filteredNotifications = () => {
    if (!data?.data) return [];
    if (activeFilter !== "all") {
      return data.data.filter(
        (item) => item?.departmentId?.name === activeFilter,
      );
    } else {
      return data.data;
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteClient(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Client deleted successfully");
      refetch();
    } catch (error) {
      console.log(error?.data?.message, "clienterror");
      toast.error(error.data?.message || "Failed to delete Client");
    }
  }, [confirmDelete, deleteClient, refetch, activeFilter]);

  const {
    data: departments,
    error: isDepartError,
    isLoading: isDeaprtLoading,
  } = useAllDepartmentsQuery();

  const filterData = ["all", ...(departments?.data?.map((e) => e?.name) || [])];

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
          className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#5f2781] font-semibold">
          Loading your Clients... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-2 bg-[#F8F9FC]">
      {/* Container: Bari screen pe max-w-full aur 1600px tak jayega */}
      <div className="w-full max-w-[1600px] mx-auto px-2  flex flex-col space-y-4">
        {/* 1. Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-2xl">
              <Users className="h-6 w-6 text-[#5f2781]" />
            </div>
            <div>
              <h3 className="text-[#242424] text-lg font-black tracking-tight leading-none">
                All Clients
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Management Hub
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEdit()}
            className="flex items-center justify-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 py-3 rounded-2xl text-[13px] font-bold shadow-lg shadow-purple-100 hover:bg-[#4f1f6d] transition-all"
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </motion.button>
        </div>

        {/* 2. Smart Filters: Laptop pe fit, Mobile pe scrollable */}
        <div className="relative w-fit max-w-full overflow-hidden group">
          {/* Mobile-only Indicator (Fade) */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8F9FC] to-transparent z-10 pointer-events-none md:hidden" />

          <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 pr-6 md:pr-1">
              {filterData?.map((e) => (
                <button
                  key={e}
                  onClick={() => setActiveFilter(e)}
                  className={`px-5 py-2 text-[12px] font-bold rounded-xl cursor-pointer transition-all capitalize whitespace-nowrap ${
                    activeFilter === e
                      ? "bg-[#5f2781] text-white shadow-md shadow-purple-100"
                      : "text-gray-500 hover:bg-white hover:text-[#5f2781]"
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
          className="bg-white rounded-3xl mx-1 md:mx-0 p-4 shadow-xl border border-purple-100"
        >
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-[#5f2781]" />
              <h3 className="text-xl font-semibold text-gray-700">No Client</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Client yet."
                  : `You don't have any ${activeFilter} Client.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      {/* Sticky Name Column */}
                      <th className=" px-4 py-4 text-left text-[13px] font-bold text-gray-600 border-b border-gray-100">
                        Client Info
                      </th>
                      <th className="px-4 py-4 text-left text-[13px] font-bold text-gray-600 border-b border-gray-100">
                        Company
                      </th>
                      <th className="px-4 py-4 text-left text-[13px] font-bold text-gray-600 border-b border-gray-100">
                        Contact Details
                      </th>
                      <th className="px-4 py-4 text-center text-[13px] font-bold text-gray-600 border-b border-gray-100">
                        Tags
                      </th>
                      <th className="px-4 py-4 text-left text-[13px] font-bold text-gray-600 border-b border-gray-100">
                        Handled By
                      </th>
                      {/* Sticky Action Column */}
                      <th className="px-4 py-4 text-center text-[13px] font-bold text-gray-600 border-b border-gray-100 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {filteredNotifications().map((emp, index) => (
                      <motion.tr
                        key={emp?._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-purple-50/30 transition-all duration-200"
                      >
                        {/* Sticky Client Info (Image + Name + Email) */}
                        <td className="px-4 py-3 border-b border-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                              <Image
                                src={emp?.image || "/placeholder.svg"}
                                alt="Client"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800 leading-none capitalize">
                                {emp?.name || "Unknown"}
                              </span>
                              <span className="text-[12px] text-gray-500 mt-1">
                                {emp?.email || "-"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-4 py-3 border-b border-gray-50 whitespace-nowrap">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            {emp?.companyName || "No Company"}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 border-b border-gray-50 whitespace-nowrap text-xs text-gray-500 font-medium">
                          {emp?.phoneNo || "-"}
                        </td>

                        {/* Combined Tags (Brand + Department) */}
                        <td className="px-4 py-3 border-b border-gray-50">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {emp?.brandId?.name && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 border border-blue-100">
                                {emp.brandId.name}
                              </span>
                            )}
                            {emp?.departmentId?.name && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-purple-50 text-purple-600 border border-purple-100">
                                {emp.departmentId.name}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Handle By */}
                        <td className="px-4 py-3 border-b border-gray-50">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-medium capitalize">
                              {emp?.handleBy?.fullName || "-"}
                            </span>
                          </div>
                        </td>

                        {/* Sticky Actions */}
                        <td className=" px-4 py-3 border-b border-gray-50 ">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(emp)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setConfirmDelete(emp._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {confirmDelete && (
          <WarningModal
            message="client"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <ClientModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
