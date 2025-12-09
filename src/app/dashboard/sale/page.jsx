"use client";

import { useState } from "react";
import { Users, Edit, Plus, DeleteIcon, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  useAllSalesQuery,
  useDeleteSaleMutation,
} from "@/app/_Services/sale/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import Image from "next/image";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import SaleModal from "@/app/_Components/Modal/SaleModal";

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

  const { data, error: isError, isLoading, refetch } = useAllSalesQuery();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

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
      case "paid":
        return "text-green-700 bg-green-200";
      case "charge back":
        return "text-red-700 bg-red-200";
      case "refund":
        return "text-red-700 bg-red-200";
      case "FRESH":
        return "text-blue-700 bg-blue-200";
      case "UP SELL":
        return "text-blue-700 bg-blue-200";
      default:
        return "text-gray-700 bg-gray-100";
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
      await deleteSale(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Sale deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete sale");
    }
  };

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
          Loading your Sales... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-4 mx-1">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#5f2781]" />
            <h3 className="text-[#242424] text-xl font-bold">All Sales</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#4f1f6d] transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Add New Sale
            </motion.button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {/* <div className="flex bg-white rounded-full shadow-sm p-1">
            {filterData?.map((e) => (
              <button
                onClick={() => setActiveFilter(e)}
                className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${
                  activeFilter === e
                    ? "bg-[#5f2781] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div> */}
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl mx-1 md:mx-0 p-2 shadow-xl border border-purple-100"
        >
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-[#5f2781]" />
              <h3 className="text-xl font-semibold text-gray-700">No Sale</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Sales yet."
                  : `You don't have any ${activeFilter} Sales.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Name{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Email{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Phone No.{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Serial No.{" "}
                      </th>

                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Brand Name{" "}
                      </th>

                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Brand Mark
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Department
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Agent
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Type{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Fronter{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Amount{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Status{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Date{" "}
                      </th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-800 capitalize tracking-wider">
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
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {emp?.name || "-"}
                        </td>

                        <td className="px-2 py-3 whitespace-nowrap text-[13px] text-gray-600 ">
                          {emp?.email || "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[13px] text-gray-600 capitalize">
                          {emp?.phoneNo || "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[13px] text-gray-600 capitalize">
                          {emp?.serialNo || "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[13px] text-gray-600 capitalize">
                          {emp?.brandName || "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[13px] text-gray-600 capitalize">
                          {emp?.brandMark || "-"}
                        </td>

                        <td className="px-2 py-3 whitespace-nowrap capitalize">
                          {emp?.departmentId?.name ? (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
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
                          {emp?.agent ? (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium `}
                            >
                              {emp.agent.fullName
                                ? `${emp.agent.fullName}`
                                : "-"}
                            </span>
                          ) : (
                            "-" // if no handleBy
                          )}
                        </td>
                         <td className="px-2 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                emp?.type
                              )}`}>
                              {emp?.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap capitalize">
                          {emp?.fronter ? (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium`}
                            >
                              {emp.fronter.fullName
                                ? `${emp.fronter.fullName}`
                                : "-"}
                            </span>
                          ) : (
                            "-" // if no handleBy
                          )}
                        </td>
                        

                        <td className="px-2 py-3 whitespace-nowrap">
                          {/* <div className="flex items-center gap-3"> */}
                            <span className="text-sm  text-gray-600">
                              {emp?.amount}
                            </span>
                          {/* </div> */}
                        </td>

                       

                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              emp.status
                            )}`}
                          >
                            {emp.status.charAt(0).toUpperCase() +
                              emp.status.slice(1)}
                          </span>
                        </td>

                        <td className="px-2 py-3 whitespace-nowrap">
                          {/* <div className="flex items-center gap-3"> */}
                          <span className="text-[12px]  text-gray-600 ">
                            {emp?.createdAt ? formatDate(emp.createdAt) : "-"}
                          </span>
                          {/* </div> */}
                        </td>

                        <td className="pr-2 py-3 whitespace-nowrap">
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
                            className="inline-flex items-center cursor-pointer p-2  bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <DeleteIcon className="h-4 w-4" />

                            {/* Edit */}
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
            message="sale"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <SaleModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
