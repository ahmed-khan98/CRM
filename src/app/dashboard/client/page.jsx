"use client";

import { useCallback, useState } from "react";
import { Users} from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllClientsQuery,
  useDeleteClientMutation,
} from "@/app/_Services/Client/page";
import ClientModal from "@/app/_Components/Modal/ClientModal";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import Image from "next/image";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import toast from "react-hot-toast";
import SignupTypeBadge from "@/app/_Components/table/SignupTypeBadge";
import PageHeader from "@/app/_Components/PageHeader/page";
import ClientRowMenu from "@/app/_Components/table/tableRow/tableHeader/ClientRowMenu";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Client() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllClientsQuery();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const filteredNotifications = () => {
    if (!data?.data) return [];
    if (activeFilter !== "all") {
      return data.data.filter(
        (item) => item?.departmentId?.name === activeFilter,
      );
    } else {
      return data.data;
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteClient(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Client deleted successfully");
      refetch();
    } catch (error) {
      console.log(error?.data?.message, "clienterror");
      toast.error(error.data?.message || "Failed to delete Client");
    }
  }, [confirmDelete, deleteClient, refetch, activeFilter]);

  const {
    data: departments,
    error: isDepartError,
    isLoading: isDeaprtLoading,
  } = useAllDepartmentsQuery();

  const filterData = ["all", ...(departments?.data?.map((e) => e?.name) || [])];

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
          Loading your Clients... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Container: Bari screen pe max-w-full aur 1600px tak jayega */}
      <div className="w-full mx-auto px-1  flex flex-col space-y-3">
        {/* 1. Header Section */}
        <PageHeader
          icon={Users}
          length={data?.data?.length}
          name=" All Clients"
          btnName="Create Client"
          handleEdit={handleEdit}
        />

        {/* 2. Smart Filters: Laptop pe fit, Mobile pe scrollable */}
        <div className="relative w-fit max-w-full overflow-hidden group">
          {/* Mobile-only Indicator (Fade) */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8F9FC] to-transparent z-10 pointer-events-none md:hidden" />

          <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 pr-6 md:pr-1">
              {filterData?.map((e) => (
                <button
                  key={e}
                  onClick={() => setActiveFilter(e)}
                  className={`px-2.5 py-2 text-[11px] font-medium rounded-xl cursor-pointer transition-all capitalize whitespace-nowrap ${
                    activeFilter === e
                      ? "bg-zinc-800 text-white shadow-md shadow-purple-100"
                      : "text-gray-500 hover:bg-zinc-100 hover:text-gray-800"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div variants={itemVariants} className=" md:mx-0">
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">No Client</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Client yet."
                  : `You don't have any ${activeFilter} Client.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden bg-zinc-900 rounded-2xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead className="">
                    <tr>
                      {/* Sticky Name Column */}
                      <th className=" p-3 text-left text-[12px] font-bold text-zinc-300">
                        Client Info
                      </th>
                      <th className="p-3 text-left text-[12px] font-bold text-zinc-300">
                        Business/Brand Name
                      </th>
                      <th className="p-3 text-left text-[12px] font-bold text-zinc-300">
                        Contact
                      </th>
                      <th className="p-3 text-center text-[12px] font-bold text-zinc-300">
                        Signup Type
                      </th>
                      <th className="p-3 text-center text-[12px] font-bold text-zinc-300">
                        Tags
                      </th>
                      <th className="p-3 text-left text-[12px] font-bold text-zinc-300">
                        Handled By
                      </th>
                      {/* Sticky Action Column */}
                      <th className="p-3 text-center text-[12px] font-bold text-zinc-300 ">
                        
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {filteredNotifications().map((emp, index) => (
                          <tr className={`group border-b border-zinc-100 transition-colors hover:brightness-95`}>

                        {/* Sticky Client Info (Image + Name + Email) */}
                        <td className="border-b border-zinc-100 px-4 py-2.5  ">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                              <Image
                                src={emp?.image || "/placeholder.svg"}
                                alt="Client"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-gray-800 leading-none capitalize">
                                {emp?.name || "Unknown"}
                              </span>
                              <span className="text-[12px] text-gray-500 mt-1">
                                {emp?.email || "-"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="border-b border-zinc-100 px-4 py-2.5  whitespace-nowrap">
                          <span className="text-[11px] text-gray-600 ">
                            {emp?.companyName || "No Company"}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="border-b border-zinc-100 text-[11px] px-4 py-2.5  whitespace-nowrap text-xs text-gray-500 font-medium">
                          {emp?.phoneNo || "-"}
                        </td>
                        <td className="border-b border-zinc-100  whitespace-nowrap ">
                          {<SignupTypeBadge type={emp?.signupType} /> || "-"}
                        </td>

                        {/* Combined Tags (Brand + Department) */}
                        <td className="border-b border-zinc-100 px-4 py-2.5 ">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {emp?.brandId?.name && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 border border-blue-100">
                                {emp.brandId.name}
                              </span>
                            )}
                            {emp?.departmentId?.name && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-purple-50 text-purple-600 border border-purple-100">
                                {emp.departmentId.name}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Handle By */}
                        <td className="border-b border-zinc-100 px-4 py-2.5 ">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-600 font-medium capitalize">
                              {emp?.handleBy?.fullName || "-"}
                            </span>
                          </div>
                        </td>

                        <td
                          className={`border-b border-zinc-100 px-2 sticky right-0 transition-colors  w-10`}
                        >
                          <ClientRowMenu
                            emp={emp}
                            handleEdit={() => handleEdit(emp)}
                            onDelete={() => setConfirmDelete(emp._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {confirmDelete && (
          <WarningModal
            message="client"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <ClientModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
