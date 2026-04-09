"use client";

import { useState } from "react";
import { Building, Edit, Plus, DeleteIcon, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementStatusMutation,
} from "@/app/_Services/announcement/page";
import AnnouncementModal from "@/app/_Components/Modal/AnnouncementModal";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { formatDate } from "@/app/utilities/date";
import { getStatusColor } from "@/app/utilities/color";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Announcement() {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const {
    data,
    error: isError,
    isLoading: isAnnoucementLoading,
    refetch,
  } = useAllAnnouncementsQuery();
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();
  const [updateAnnouncementStatus, { isLoading: isUpdatingStatus, originalArgs }] =
    useUpdateAnnouncementStatusMutation();

  const handleEdit = (depart) => {
    setEditingAppointment(depart);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleStatus = async (id) => {
    try {
      const response = await updateAnnouncementStatus({ id }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to changed status");
      }
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to update announcement status";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("announcement deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete announcement");
    }
  };

  if (isAnnoucementLoading) {
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
          Loading your announcement... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-1">
      <div className="max-w-6xl mx-auto p-1 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Building className="h-7 w-7 text-gray-800" />
            <h3 className="text-[#242424] text-[24px] font-bold">
              All Announcements
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

        <motion.div variants={itemVariants} className="shadow-lg rounded-2xl">
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Megaphone className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Announcement
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any Announcement yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl ">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        Title{" "}
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        Message{" "}
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        status{" "}
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-zinc-300 capitalize tracking-wider">
                        Create At{" "}
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
                          {depart?.title}
                        </td>
                        <td className="px-2 py-1 w-[360px] min-w-[200px] ">
                          <div
                            title={depart.message}
                            className="text-[12px] text-gray-700 leading-snug"
                          >
                            {depart.message}
                          </div>
                        </td>
                        <td className="px-1 whitespace-normal">
                          <button
                            disabled={isUpdatingStatus} // Loading ke waqt click disable kar do
                            onClick={() =>
                              updateAnnouncementStatus({ id: depart?._id })
                            }
                            className={`relative min-w-[70px] flex items-center justify-center cursor-pointer px-2 py-1 shadow-sm rounded text-xs font-medium transition-all ${getStatusColor(
                              depart?.isActive ? "active" : "deactive",
                            )} ${isUpdatingStatus && originalArgs?.id === depart?._id ? "opacity-70" : ""}`}
                          >
                            {/* Agar ye specific ID load ho rahi hai, to loader dikhao */}
                            {isUpdatingStatus && originalArgs?.id === depart?._id ? (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="animate-spin h-3 w-3 text-current"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <span>Wait...</span>
                              </div>
                            ) : /* Normal Text */
                            depart?.isActive ? (
                              "Active"
                            ) : (
                              "Deactive"
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-1.5 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {formatDate(depart.createdAt)}
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
            message="department"
            handleDelete={handleDelete}
          />
        )}

        <AnnouncementModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
