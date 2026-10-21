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
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { tableWrap, thClass, theadRow, trHover } from "@/app/_Components/ui/saas/DataTable";

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
    <div className="section-stack">
        <PageHeader
          icon={MegaphoneIcon}
          length={data?.data?.length ?? 0}
          name="All Announcements"
          btnName="Create Announcement"
          handleEdit={handleEdit}
        />

        {data?.data?.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Create your first announcement to share updates with the team."
          />
        ) : (
          <div className={tableWrap}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={theadRow}>
                    {[
                      "Title",
                      "Message",
                      "Status",
                      "Created At",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className={thClass}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 bg-white">
                  {data?.data.map((depart, index) => (
                    <motion.tr
                      key={depart?._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, ease: "easeOut" }}
                      className={`${trHover} group`}
                    >
                      {/* Title */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-zinc-900 capitalize">
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
                          className={`relative inline-flex min-w-[88px] items-center justify-center gap-1.5 cursor-pointer rounded-full border px-2 py-1 text-xs font-medium uppercase tracking-wide transition-all ${
                            depart?.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/15"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/50 hover:bg-rose-500/15"
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
                                className={`h-1.5 w-1.5 rounded-full ${depart?.isActive ? "bg-emerald-400" : "bg-rose-400"}`}
                              />
                              {depart?.isActive ? "ACTIVE" : "DE ACTIVE"}
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
                            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-ink border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setConfirmDelete(depart._id)}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-red-100 transition-all"
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
            <div className="bg-ink border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
              <p className="text-[11px] text-zinc-500 font-semibold">
                {data?.data?.length} announcement
                {data?.data?.length !== 1 ? "s" : ""}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        )}

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
