"use client";

import { useCallback, useState } from "react";
import { Users, Edit, Plus, DeleteIcon, MoreVertical, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  useAllSalesQuery,
  useDeleteSaleMutation,
} from "@/app/_Services/sale/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import SaleModal from "@/app/_Components/Modal/SaleModal";
import toast from "react-hot-toast";
import { SALEHEADERS } from "@/app/_Components/table/tableRow/tableHeader/saleHeader";

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
        (item) => item?.departmentId?.name === activeFilter,
      );
    } else {
      return data.data;
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteSale(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Sale deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete sale");
    }
  }, [confirmDelete, deleteSale, refetch]);

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
        <span className="ml-4 text-zinc-700 font-semibold">
          Loading your Sales... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mx-1">
      <div className="mx-auto p-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-zinc-700" />
            <h3 className="text-[#242424] text-xl font-bold">All Sales</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 shadow-xl cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
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
                    ? "bg-zinc-800 text-white shadow-md"
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
          className=" rounded-2xl  md:mx-0 shadow-xl border border-gray-100"
        >
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">No Sale</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Sales yet."
                  : `You don't have any ${activeFilter} Sales.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-100"
             style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
          }} >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {SALEHEADERS.map((col, index) => (
                        <th
                          key={index}
                          className={`sticky top-0 p-3 text-[10px] font-bold text-zinc-300 uppercase bg-zinc-800 ${
                            col === "Status" || col === "Action"
                              ? "text-center"
                              : ""
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((emp, index) => (
                      <motion.tr
                        key={emp?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-4 py-3 transition-colors">
                          <div className="flex items-center gap-3">
                           
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800 leading-none capitalize">
                                {emp?.name || "-"}
                              </span>
                              <span className="text-[12px] text-gray-500 ">
                                {emp?.email || "-"}
                              </span>
                              <span className="text-[12px] text-gray-500 ">
                               {emp?.phoneNo || "-"}
                              </span>
                            </div>
                          </div>
                        </td>

                       
                        
                        {/* <td className="p-4 whitespace-nowrap text-[13px] text-gray-600 capitalize">
                          {emp?.brandName || "-"}
                        </td> */}
                           <td className="px-4 py-3 ">
                           
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800 leading-none capitalize">
                              {emp?.serialNo || "-"}
                              </span>
                              <span className="text-[12px] text-gray-500 mt-1">
                                {emp?.brandMark || "-"}
                              </span>
                          </div>
                        </td>
                     

                        <td className="p-4 whitespace-nowrap capitalize">
                          {emp?.departmentId?.name ? (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                emp?.departmentId?.name,
                              )}`}
                            >
                              {emp?.departmentId?.name.charAt(0).toUpperCase() +
                                emp?.departmentId?.name.slice(1)}
                            </span>
                          ) : (
                            "-" // if no department
                          )}
                        </td>

                        <td className="p-4 whitespace-nowrap capitalize">
                          {emp?.agent ? (
                            <span className={` text-xs font-medium `}>
                              {emp.agent.fullName
                                ? `${emp.agent.fullName}`
                                : "-"}
                            </span>
                          ) : (
                            "-" // if no handleBy
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                emp?.type,
                              )}`}
                            >
                              {emp?.type}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap capitalize">
                          {emp?.fronter ? (
                            <span className={` text-xs font-medium`}>
                              {emp.fronter.fullName
                                ? `${emp.fronter.fullName}`
                                : "-"}
                            </span>
                          ) : (
                            "-" // if no handleBy
                          )}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-zinc-200 text-zinc-800">
            <DollarSign className="text-amber-500 h-5 w-5" /> {emp?.amount}
          </span>
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              emp.status,
                            )}`}
                          >
                            {emp.status.charAt(0).toUpperCase() +
                              emp.status.slice(1)}
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {/* <div className="flex items-center gap-3"> */}
                          <span className="text-[12px]  text-gray-600 ">
                            {emp?.saleDate ? formatDate(emp.saleDate) : "-"}
                          </span>
                          {/* </div> */}
                        </td>
 <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleEdit(emp)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => setConfirmDelete(emp._id)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                        >
                          <DeleteIcon className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </td>
                        {/* <td className="pr-2 py-1.5 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center cursor-pointer mx-1 p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors"
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

                          </motion.button>
                        </td> */}
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
