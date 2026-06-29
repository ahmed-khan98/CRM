"use client";

import { useState } from "react";
import { Building, Edit, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllDepartmentsQuery,
  useDeleteDepartmentMutation,
} from "@/app/_Services/department/page";
import DepartmentModal from "@/app/_Components/Modal/DepartmentModal";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { formatDate } from "@/app/utilities/date";
import PageHeader from "@/app/_Components/PageHeader/page";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AppointmentBooking() {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllDepartmentsQuery();
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();

  const handleEdit = (depart) => {
    setEditingAppointment(depart);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("department deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete department");
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
          className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-gray-800 font-semibold">
          Loading your departments... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mx-1">
      <div className="mx-auto p-1 flex flex-col space-y-3">
        <PageHeader
          icon={Building}
          length={data?.data?.length}
          name="All Departments"
          btnName="Create Department"
          handleEdit={handleEdit}
        />

        <motion.div variants={itemVariants} className="shadow-lg rounded-2xl">
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Building className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Department
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any Department yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl ">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-white/[0.07]">
                      {["Department Name", "createdAt", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[10px] font-black tracking-[0.14em] uppercase text-zinc-300"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data.map((depart, index) => (
                      <motion.tr
                        key={depart?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-zinc-100 transition-colors"
                      >
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-600 capitalize">
                          <span className="text-[12px] font-semibold text-zinc-800 capitalize">
                            {depart?.name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="text-[11px] text-zinc-600">
                            {formatDate(depart.createdAt)}
                          </span>
                        </td>

                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => handleEdit(depart)}
                              className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => setConfirmDelete(depart._id)}
                              className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                            >
                              <DeleteIcon className="h-3.5 w-3.5" />
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
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            message="department"
            handleDelete={handleDelete}
          />
        )}

        <DepartmentModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
