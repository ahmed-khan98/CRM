"use client";

import { useState } from "react";
import { Home, Edit, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllBrandsQuery,
  useDeleteBrandMutation,
} from "@/app/_Services/brand/page";
import BrandModal from "@/app/_Components/Modal/brandModal";
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
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllBrandsQuery();

  const [deleteBrand, { isLoading: isDeleting }] =
    useDeleteBrandMutation();

  const handleEdit = (br) => {
    setEditingBrand(br);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };


  const handleDelete = async () => {
    try {
      await deleteBrand(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("brand deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete brand");
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
          Loading your departments... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-4 mx-1">
      <div className="max-w-6xl mx-auto p-3 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Home className="h-7 w-7 text-[#5f2781]" />
            <h3 className="text-[#242424] text-[24px] font-bold">
              All Brand
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#4f1f6d] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create
            </motion.button>
          
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl mx-1 md:mx-0 p-4 shadow-xl border border-purple-100"
        >
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Home className="h-16 w-16 text-gray-300 mbg-[#5f2781]" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Brand
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any Brand yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-800 capitalize tracking-wider">
                       Brand Name{" "}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-800 capitalize tracking-wider">
                       Department Name{" "}
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-800 capitalize tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data.map((br, index) => (
                      <motion.tr
                        key={br?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {br?.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {br?.departmentId?.name}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(br)}
                            className="inline-flex items-center cursor-pointer mx-1 px-3 py-2 bg-[#5f2781] text-white rounded-lg hover:bg-[#4f1f6d] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            {/* Edit */}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDelete(br._id)}
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
            message='brand'
            handleDelete={handleDelete}
          />
        )}

        <BrandModal
          isOpen={isModalOpen}
          data={editingBrand}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
