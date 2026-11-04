"use client";

import { useState } from "react";
import { AtSign, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import BrandEmailModal from "@/app/_Components/Modal/BrandEmailModal";
import {
  useAllBrandEmailsQuery,
  useDeleteBrandEmailMutation,
} from "@/app/_Services/domain/page";
import toast from "react-hot-toast";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { fleet } from "@/app/_Components/fleet/fleetTheme";

export default function Client() {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, refetch } = useAllBrandEmailsQuery();
  const [deleteBrandEmail, { isLoading: isDeleting }] =
    useDeleteBrandEmailMutation();

  const rows = data?.data || [];

  const handleEdit = (emp) => {
    setEditingAppointment(emp || null);
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
      toast.success("Brand email deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete brand email");
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
    <div className="min-h-screen py-1 mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-3">
        <div className="flex flex-col gap-2 pb-2 justify-between items-start md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-zinc-200" />
            <h3 className="text-zinc-100 text-xl font-medium">
              All Brand Email
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleEdit()}
            className={fleet.primaryBtn}
          >
            <Plus className="h-4 w-4" />
            Add Brand Email
          </button>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={AtSign}
            title="No brand emails yet"
            description="Add a sending address for each brand."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-zinc-900/80 text-zinc-400 text-left text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Brand</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email ID</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((emp, index) => (
                    <motion.tr
                      key={emp?._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      className="border-t border-zinc-800/80 hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-zinc-100 capitalize whitespace-nowrap">
                        {emp?.brandId?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-200 capitalize whitespace-nowrap">
                        {emp?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap">
                        {emp?.email || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(emp._id)}
                            className="inline-flex items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {confirmDelete && (
          <WarningModal
            message="Brand Email"
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
