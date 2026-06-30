"use client";

import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import {
  useAllMonthsQuery,
  useCloseMonthMutation,
} from "@/app/_Services/month/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { formatDate } from "@/app/utilities/date";
import MonthCard from "@/app/_Components/Month/MonthCard";
import MonthModal from "@/app/_Components/Modal/MonthModal";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

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
      <PageLoader title="Loading months" subtitle="Preparing month cycles..." />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-1  flex flex-col space-y-3">
        <PageHeader
          icon={Calendar}
          length={data?.data?.length}
          name="Month Cycles"
          btnName="Create Month"
          handleEdit={() => setIsModalOpen(true)}
        />
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
