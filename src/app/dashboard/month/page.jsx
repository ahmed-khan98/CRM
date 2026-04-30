"use client";

import { useState } from "react";
import {
  Plus,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllMonthsQuery,
  useCloseMonthMutation,
} from "@/app/_Services/month/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { formatDate } from "@/app/utilities/date";
import MonthCard from "@/app/_Components/Month/MonthCard";
import MonthModal from "@/app/_Components/Modal/MonthModal";


export default function Announcement() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const {
    data,
    error: isError,
    isLoading: isMonthsLoading,
    refetch,
  } = useAllMonthsQuery();


  const [closeMonth, { isLoading: isUpdatingStatus, originalArgs }] =
    useCloseMonthMutation();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMonthClose = async (id) => {
    try {
      const response = await closeMonth({ id }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to close month");
      }
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to close month";
      toast.error(msg);
    }
  };

  if (isMonthsLoading) {
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
          Loading your months... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  px-4 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-1">
              Finance
            </p>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Month Cycles
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-white text-sm font-semibold border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 hover:scale-[1.03] transition-all duration-200 shadow-lg shadow-black/30"
          >
            <Plus
              size={15}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            Create Month
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

        {/* Empty State */}
        {data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-zinc-600" />
            </div>
            <p className="text-zinc-800 font-semibold mb-1">No months yet</p>
            <p className="text-zinc-800 text-sm">
              Create your first month cycle to get started
            </p>
          </div>
        ) : (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
  {data?.data?.map((month, index) => (
    <MonthCard
      key={month?._id}
      month={month}
      index={index}
      formatDate={formatDate}
      closeMonth={handleMonthClose}
      isUpdatingStatus={isUpdatingStatus}
      originalArgs={originalArgs}
    />
  ))}
</div>

        )}

        {confirmDelete && (
          <WarningModal
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            message="department"
            handleDelete={handleDelete}
          />
        )}

        <MonthModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
