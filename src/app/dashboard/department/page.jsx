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
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { tableWrap, thClass, theadRow, trHover } from "@/app/_Components/ui/saas/DataTable";

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
      <PageLoader
        title="Loading departments"
        subtitle="Fetching department records..."
      />
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

        <motion.div variants={itemVariants} className="rounded-xl">
          {data?.data?.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No departments yet"
              description="Create a department to start organizing employees and CRM records."
            />
          ) : (
            <div className={`-mx-1 md:mx-0 ${tableWrap}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="sticky top-0">
                    <tr className={theadRow}>
                      {["Name", "Created", "Actions"].map((h) => (
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={trHover}
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
