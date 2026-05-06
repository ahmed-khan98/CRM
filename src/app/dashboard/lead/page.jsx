"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { ChartBar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  useAllLeadsQuery,
  useBrandLeadQuery,
  useDeleteLeadMutation,
} from "@/app/_Services/lead/page";

import { useAllBrandsQuery } from "@/app/_Services/brand/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import ExportLeadModal from "@/app/_Components/Modal/ExportLeadModal";
import LeadModal from "@/app/_Components/Modal/LeadModel";
import LeadActionModal from "@/app/_Components/Modal/LeadActionModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import { LeadRow } from "@/app/_Components/table/tableRow/LeadRow";
import { LEADHEADERS } from "@/app/_Components/table/tableRow/tableHeader/leadHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MemoPagination = React.memo(Pagination);
function Leads() {
  // const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("filter") || "all";
  const page = Number(searchParams.get("page")) || 1;
  // const [page, setPage] = useState(1);
  const limit = 10;

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (value === 1) {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const onFilterChange = useCallback(
    (newFilterValue) => {
      const params = new URLSearchParams();

      if (newFilterValue !== "all") {
        params.set("filter", newFilterValue);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const onPageChange = useCallback(
    (newPage) => {
      router.push(`${pathname}?${createQueryString("page", newPage)}`);
    },
    [router, pathname, createQueryString],
  );

  const { data: brandsResp } = useAllBrandsQuery();
  const brandList = brandsResp?.data ?? [];

  const {
    data: allResp,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
    refetch: refetchAll,
  } = useAllLeadsQuery({ page, limit }, { skip: activeFilter !== "all" });

  const {
    data: brandResp,
    isLoading: isBrandLoading,
    isFetching: isBrandFetching,
    refetch: refetchBrand,
  } = useBrandLeadQuery(
    { id: activeFilter, page, limit },
    { skip: activeFilter === "all" },
  );

  const activeResp = activeFilter === "all" ? allResp : brandResp;
  const items = activeResp?.data?.items ?? [];
  const meta = activeResp?.data?.meta;

  const isInitialLoading = isAllLoading || isBrandLoading;

  const isPaginationLoading = isAllFetching || isBrandFetching;

  // const isLoading = activeFilter === "all" ? isAllLoading : isBrandLeadLoading;

  const handleEdit = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const closeImportModal = useCallback(() => setIsImportOpen(false), []);

  const closeActionModal = useCallback(() => {
    setIsActionOpen(false);
    setEditingAppointment(null);
  }, []);

  const handleAction = useCallback((emp) => {
    setEditingAppointment(emp);
    setIsActionOpen(true);
  }, []);

  // const onPageChange = useCallback((p) => setPage(p), []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteLead(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Lead deleted successfully");
      if (activeFilter === "all") refetchAll();
      else refetchBrand();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Lead");
    }
  }, [confirmDelete, deleteLead, refetchAll, refetchBrand, activeFilter]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          Loading your Leads... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className=" mx-1">
      <div className="max-full mx-auto  flex flex-col space-y-2">
        <div className="flex flex-col gap-2 py-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-gray-800" />

            <h3 className="text-[#242424] text-xl font-bold">All Leads</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-1 cursor-pointer bg-zinc-800 text-white px-2.5 py-2 shadow-lg rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4 text-white" />
              Add New Lead
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-1 cursor-pointer bg-zinc-800 text-white px-2.5 shadow-lg py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4 text-white" />
              Import
            </motion.button>
          </div>
        </div>

        {/* Brand filter chips */}

        <div className="flex flex-wrap gap-1 items-center">
          <button
            onClick={() => onFilterChange("all")}
            className={`cursor-pointer px-3 py-1 text-xs rounded-full border transition ${
              activeFilter === "all"
                ? "bg-zinc-800 text-white border-zinc-800"
                : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
            }`}
          >
            All
          </button>

          {brandList?.map((b) => (
            <button
              key={b?._id}
              onClick={() => onFilterChange(b?._id)}
              className={`cursor-pointer px-2 md:px-3 py-1 text-xs rounded-full border transition capitalize ${
                activeFilter === b?._id
                  ? "bg-zinc-800 text-white border-zinc-800"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-zinc-200 hover:border-gray-300"
              }`}
            >
              {b?.name}
            </button>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className=" md:mx-0 rounded-2xl shadow-lg border border-zinc-100 relative"
        >
          {isPaginationLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl border border-gray-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,

                  repeat: Infinity,

                  ease: "linear",
                }}
                className="w-8 h-8 border-3 border-zinc-800 border-t-transparent rounded-full"
              />
            </div>
          )}

          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <ChartBar className="h-16 w-16 text-gray-300" />

              <h3 className="text-xl font-semibold text-gray-700">No Lead</h3>

              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Leads yet."
                  : "No leads for this brand."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl">
             <div 
  className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-260px)]"
  style={{
    scrollbarWidth: "thin",
    scrollbarColor: "#52525b transparent",
  }}
>

                <table className="min-w-full">
                  <thead className="sticky top-0 z-20 bg-zinc-800">
                    <tr className="">
                      {LEADHEADERS?.map((h) => (
                        <th
                          key={h}
                          className="p-3 py-4 text-start text-xs font-medium text-zinc-300 capitalize  "
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {items?.map((emp, i) => (
                      <LeadRow
                        index={i + 1}
                        emp={emp}
                        onEdit={handleAction}
                        setConfirmDelete={setConfirmDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <MemoPagination meta={meta} onPageChange={onPageChange} />
        </motion.div>

        {confirmDelete && (
          <WarningModal
            message="lead"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <LeadModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          refetch={activeFilter === "all" ? refetchAll : refetchBrand}
        />

        <LeadActionModal
          isOpen={isActionOpen}
          data={editingAppointment}
          closeModal={closeActionModal}
          refetch={activeFilter === "all" ? refetchAll : refetchBrand}
        />

        <ExportLeadModal
          isOpen={isImportOpen}
          closeModal={closeImportModal}
          refetch={activeFilter === "all" ? refetchAll : refetchBrand}
        />
      </div>
    </div>
  );
}

export default function Lead() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Leads />
    </Suspense>
  );
}
