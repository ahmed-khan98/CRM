"use client";

import { useState } from "react";
import { List, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import {
  useAllEmailListsQuery,
  useDeleteEmailListMutation,
} from "@/app/_Services/emaillist/page";
import EmailListModal from "@/app/_Components/Modal/EmaillistModal";
import toast from "react-hot-toast";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllEmailListsQuery();

  const [deleteEmailList, { isLoading: isDeleting }] =
    useDeleteEmailListMutation();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEmailList(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Email List deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete domain");
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
          Loading your Email List... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-1 mx-1">
      <div className="w-full mx-auto p-3 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-gray-800" />
            <h3 className="text-[#242424] text-xl font-bold">
              All Email List
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Import Email List
            </motion.button>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl shadow-lg"
        >
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <List className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Email List
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any email list yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden ">
              <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full">
                  <thead className="bg-zinc-800 ">
                    <tr>
                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        List Name{" "}
                      </th>
                      <th className="p-3 text-zinc-300 text-start text-[13px] font-medium capitalize tracking-wider">
                        No. of Email{" "}
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
                        className="hover:bg-zinc-100 transition-colors"
                      >
                        <td className="px-2 py-3 whitespace-nowrap text-[14px] font-medium text-gray-800 capitalize">
                          {emp?.listName ? `${emp.listName}` : "-"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[14px] font-medium text-gray-800 capitalize">
                          {emp?.emailCount}
                        </td>

                        <td className="pl-2 py-3 whitespace-nowrap">
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
            message="Email List"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <EmailListModal
          isOpen={isModalOpen}
        //   data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
