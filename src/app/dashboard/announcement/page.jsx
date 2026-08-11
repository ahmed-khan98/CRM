"use client";

import { useState } from "react";
import { MegaphoneIcon, Edit, DeleteIcon, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementStatusMutation,
} from "@/app/_Services/announcement/page";
import AnnouncementModal from "@/app/_Components/Modal/AnnouncementModal";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { formatDate } from "@/app/utilities/date";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import Tooltip from "@/app/_Components/ui/Tooltip";

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
  const [
    updateAnnouncementStatus,
    { isLoading: isUpdatingStatus, originalArgs },
  ] = useUpdateAnnouncementStatusMutation();

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
      <PageLoader
        title="Loading announcements"
        subtitle="Fetching company updates..."
      />
    );
  }

  return (
    <div className="mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-3">
        <PageHeader
          icon={MegaphoneIcon}
          length={"Management"}
          name=" All Announcements"
          btnName="Create Announcement"
          handleEdit={handleEdit}
        />

        {data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] bg-zinc-900 border border-white/[0.06] p-16 text-center shadow-xl shadow-zinc-400/10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.07] border border-white/10 mb-4">
              <Megaphone className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="text-base font-black text-zinc-200 mb-1">
              No Announcements Yet
            </h3>
            <p className="text-zinc-500 text-sm">
              Create your first announcement to get started.
            </p>
          </div>
        ) : (
          <div className="-mx-1 overflow-hidden rounded-[20px] shadow-xl shadow-zinc-400/15 md:mx-0 md:border md:border-zinc-200">
            {/* Dark top accent */}
            <div className="h-[2px] w-full bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900" />

            <div className="overflow-x-auto">
              <table className="min-w-full">
                {/* Dark Header */}
                <thead>
                  <tr className="bg-zinc-900 border-b border-white/[0.07]">
                    {[
                      "Title",
                      "Message",
                      "Status",
                      "Created At",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-3 text-left text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-300"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Light Rows */}
                <tbody className="bg-white divide-y divide-zinc-100">
                  {data?.data.map((depart, index) => (
                    <motion.tr
                      key={depart?._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, ease: "easeOut" }}
                      className="hover:bg-zinc-50 transition-colors group"
                    >
                      {/* Title */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-zinc-800 capitalize">
                          {depart?.title}
                        </span>
                      </td>

                      {/* Message */}
                      <td className="px-4 py-3 w-[320px] min-w-[180px]">
                        <Tooltip label={depart.message} side="top" className="max-w-full" delay>
                          <p className="text-[12px] text-zinc-500 leading-snug line-clamp-2">
                            {depart.message}
                          </p>
                        </Tooltip>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() =>
                            updateAnnouncementStatus({ id: depart?._id })
                          }
                          className={`relative min-w-[76px] flex items-center justify-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wide transition-all border ${
                            depart?.isActive
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                          } ${isUpdatingStatus && originalArgs?.id === depart?._id ? "opacity-60" : ""}`}
                        >
                          {isUpdatingStatus &&
                          originalArgs?.id === depart?._id ? (
                            <>
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
                              Wait...
                            </>
                          ) : (
                            <>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${depart?.isActive ? "bg-emerald-500" : "bg-red-400"}`}
                              />
                              {depart?.isActive ? "Active" : "Inactive"}
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[12px] text-zinc-400 font-medium">
                          {formatDate(depart.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => handleEdit(depart)}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setConfirmDelete(depart._id)}
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

            {/* Dark Footer */}
            <div className="bg-zinc-900 border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
              <p className="text-[11px] text-zinc-600 font-semibold">
                {data?.data?.length} announcement
                {data?.data?.length !== 1 ? "s" : ""}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <WarningModal
          setConfirmDelete={setConfirmDelete}
          isDeleting={isDeleting}
          message="announcement"
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
  );
}
