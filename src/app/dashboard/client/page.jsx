"use client";

import { useState } from "react";
import { Users, Edit, Plus, DeleteIcon, MoreVertical } from "lucide-react";
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
        (item) => item?.departmentId?.name === activeFilter
      );
    } else {
      return data.data;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Client deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete Client");
    }
  };

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
    <div className="min-h-screen  py-4 mx-1">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#5f2781]" />
            <h3 className="text-[#242424] text-xl font-bold">
              All Clients
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#4f1f6d] transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Add
            </motion.button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="flex bg-white rounded-full shadow-sm p-1">
            {filterData?.map((e) => (
              <button
                onClick={() => setActiveFilter(e)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-full cursor-pointer transition-all capitalize ${
                  activeFilter === e
                    ? "bg-[#5f2781] text-white shadow-md"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
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
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Img
                      </th>

                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Name{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Email{" "}
                      </th>
                      {/* <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Company{" "}
                      </th> */}

                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Phone No.{" "}
                      </th>

                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Brand
                      </th>

                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Department
                      </th>
                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Handle By
                      </th>
                      <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((emp, index) => (
                      <motion.tr
                        key={emp?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800">
                          <div className="relative w-10 h-10">
                            {" "}
                            <Image
                              src={emp?.image || "/placeholder.svg"}
                              alt="Client-img"
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800 capitalize">
                          {emp?.name ? `${emp.name}` : "-"}
                        </td>

                        {/* Email */}
                        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800">
                          {emp?.email || "-"}
                        </td>

                        {/* companyName */}
                        {/* <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800 capitalize">
                          {emp?.companyName || "-"}
                        </td> */}

                        {/* Phone */}
                        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800">
                          {emp?.phoneNo || "-"}
                        </td>

                        {/* Department */}
                        <td className="px-2 py-3 capitalize">
                          {emp?.brandId?.name ? (
                            <span
                              className={`px-2 py-1 text-center rounded-full text-[12px] font-medium ${getStatusColor(
                                emp?.brandId?.name
                              )}`}
                            >
                              {emp?.brandId?.name.charAt(0).toUpperCase() +
                                emp?.brandId?.name.slice(1)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap capitalize">
                          {emp?.departmentId?.name ? (
                            <span
                              className={`px-2 py-1 text-center rounded-full text-[12px] font-medium ${getStatusColor(
                                emp?.departmentId?.name
                              )}`}
                            >
                              {emp?.departmentId?.name.charAt(0).toUpperCase() +
                                emp?.departmentId?.name.slice(1)}
                            </span>
                          ) : (
                            "-" // if no department
                          )}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap capitalize">
                          {emp?.handleBy ? (
                            <span
                              className={`px-2 py-1 text-center rounded-full text-[12px] font-medium ${getStatusColor(
                                emp?.handleBy?.fullName
                              )}`}
                            >
                              {emp.handleBy.fullName
                                ? `${emp.handleBy.fullName}`
                                : "-"}
                            </span>
                          ) : (
                            "-" // if no handleBy
                          )}
                        </td>

                        <td className="pl-2 py-3 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center cursor-pointer mx-1 p-2 bg-[#5f2781] text-white rounded-lg hover:bg-[#4f1f6d] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDelete(emp._id)}
                            className="inline-flex items-center cursor-pointer p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </motion.button>
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
