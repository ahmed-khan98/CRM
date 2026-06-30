"use client";

import { useState } from "react";
import { AtSign, Edit, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import BrandEmailModal from "@/app/_Components/Modal/BrandEmailModal";
import {
  useAllBrandEmailsQuery,
  useDeleteBrandEmailMutation,
} from "@/app/_Services/domain/page";
import toast from "react-hot-toast";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Client() {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllBrandEmailsQuery();
  const [deleteBrandEmail, { isLoading: isDeleting }] =
    useDeleteBrandEmailMutation();

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleDelete = async () => {
    try {
      await deleteBrandEmail(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("domain deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete domain");
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        title="Loading brand emails"
        subtitle="Fetching sender domains..."
      />
    );
  }

  return (
    <div className="min-h-screen  py-1 mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-gray-800" />
            <h3 className="text-[#242424] text-xl font-medium">
              All Brand Email
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Add Brand Email
            </motion.button>
          </div>
        </div>

        <motion.div variants={itemVariants} className="shadow-lg rounded-2xl">
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <AtSign className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Brand Email
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any brand email yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        Brand{" "}
                      </th>
                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        Name{" "}
                      </th>
                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        Email ID{" "}
                      </th>

                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data?.map((emp, index) => (
                      <motion.tr
                        key={emp?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-2 py-3 whitespace-nowrap text-[14px] font-medium text-gray-800 capitalize">
                          {emp?.brandId ? `${emp.brandId?.name}` : "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[14px] font-medium text-gray-800 capitalize">
                          {emp?.name ? `${emp.name}` : "-"}
                        </td>

                        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800">
                          {emp?.email ? `${emp.email}` : "-"}
                        </td>

                        <td className="pl-2 py-3 whitespace-nowrap">
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
                            className="inline-flex items-center cursor-pointer p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
            message="Domain"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <BrandEmailModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
