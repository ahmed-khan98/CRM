"use client";

import { useState } from "react";
import { LayoutPanelTop, Edit, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";

import WarningModal from "@/app/_Components/Modal/WarningModal";
import CreateTemplateModal from "@/app/_Components/Modal/CreateTemplateModal";
import { useAllEmailTemplatesQuery, useDeleteEmailTemplateMutation } from "@/app/_Services/emailTemplate/page";
import toast from "react-hot-toast";

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

  const { data, error: isError, isLoading, refetch } = useAllEmailTemplatesQuery();
  const [deleteEmailTemplate, { isLoading: isDeleting }] = useDeleteEmailTemplateMutation();

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
      await deleteEmailTemplate(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("template deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete template");
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
          Loading your Templates... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-4 mx-1">
      <div className="w-full mx-auto p-3 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-5 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5 text-[#5f2781]" />
            <h3 className="text-[#242424] text-xl font-bold">
              All Email Template
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#4f1f6d] transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Create Template
            </motion.button>
          </div>
        </div>
      
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl mx-1 md:mx-0 p-4 shadow-xl border border-purple-100"
        >
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <LayoutPanelTop className="h-16 w-16 text-gray-300 bg-[#5f2781]" />
              <h3 className="text-xl font-semibold text-gray-700">No Template</h3>
              <p className="text-gray-500 mt-2">
                  You don't have any Template yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th className="px-2 py-3 text-start text-[13px] font-medium capitalize tracking-wider">
                        Name{" "}
                      </th>
                      {/* <th className="px-2 py-3 text-center text-[13px] font-medium capitalize tracking-wider">
                        Content{" "}
                      </th> */}

                      <th className="px-2 py-3 text-start text-[13px] font-medium capitalize tracking-wider">
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
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <td className="px-2 py-3 whitespace-nowrap text-[14px] font-medium text-gray-800 capitalize">
                          {emp?.name ? `${emp.name}` : "-"}
                        </td>

                        {/* Email */}
                        {/* <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800">
                         
                         <div
                dangerouslySetInnerHTML={{ __html: emp?.content }}
              />
                        </td> */}

                        <td className="pl-2 py-3 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center cursor-pointer mx-1 p-2 bg-[#5f2781] text-white rounded-lg hover:bg-[#4f1f6d] transition-colors"
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
            message="Template"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <CreateTemplateModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
