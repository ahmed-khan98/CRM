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
import Image from "next/image";
import { formatDate, formatOnlyDate } from "@/app/utilities/date";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

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

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

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
      <PageLoader title="Loading brands" subtitle="Fetching brand records..." />
    );
  }

  return (
    <div className="mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-3">
        <PageHeader
          icon={Home}
          length={data?.data?.length}
          name=" All Brands"
          btnName="Create Brand"
          handleEdit={handleEdit}
        />

        <motion.div variants={itemVariants} className="shadow-lg rounded-2xl">
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Home className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">No Brand</h3>
              <p className="text-gray-500 mt-2">
                You don't have any Brand yet.
              </p>
            </div>
          ) : (
            <div className="-mx-1 overflow-hidden rounded-2xl md:mx-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-white/[0.07]">
                      {[
                        "Logo",
                        "Name",
                        "Department",
                        "createdAt",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-black tracking-[0.14em] uppercase text-zinc-300"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data.map((br, index) => (
                      <motion.tr
                        key={br?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-zinc-50 transition-colors group"
                      >
                        <td className="px-2 py-2.5 whitespace-nowrap text-sm text-gray-600">
                          <Image
                            src={br?.image || "/placeholder.svg"}
                            alt="brand-logo"
                            width="100"
                            height="0"
                            className="rounded object-contain w-24 h-8"
                          />
                          {/* </div> */}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-600 capitalize">
                          <span className="text-[12px] font-semibold text-zinc-800 capitalize">
                            {br?.name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-600 capitalize">
                          <span className="text-[12px] font-semibold text-zinc-600 capitalize">
                            {br?.departmentId?.name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {formatDate(br.createdAt)}
                          </span>
                        </td>

                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => handleEdit(br)}
                              className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => setConfirmDelete(br._id)}
                              className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
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
            message="brand"
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
