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
      <div className="mx-auto p-1 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Building className="h-7 w-7 text-gray-800" />
            <h3 className="text-[#242424] text-[24px] font-bold">
              All Department
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create
            </motion.button>
          
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="shadow-lg rounded-2xl"
        >
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
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        Name{" "}
                      </th>
                      <th className="-p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        Action
                      </th>
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
                        <td className="px-4 py-1.5 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {depart?.name}
                        </td>

                        <td className="px-4 py-1.5 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(depart)}
                            className="inline-flex items-center cursor-pointer mx-1 px-3 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            {/* Edit */}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDelete(depart._id)}
                            className="inline-flex items-center cursor-pointer px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            message='department'
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
