"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChartBar, Link, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  useBrandLeadQuery,
} from "@/app/_Services/lead/page";

import { useAllBrandsQuery } from "@/app/_Services/brand/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import { PAYMENTLINKHEADERS } from "@/app/_Components/table/tableRow/tableHeader/paymentlinkHeader";
import { useAllPaymentLinksQuery, useDeletePaymentLinkMutation } from "@/app/_Services/paymentLink/page";
import { useRouter } from "next/navigation";
import { LinkRow } from "@/app/_Components/table/tableRow/LinkRow";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MemoPagination = React.memo(Pagination);

export default function Paymentlink() {
  
  const [activeFilter, setActiveFilter] = useState("all"); // stores brandId or "all"
  const [confirmDelete, setConfirmDelete] = useState(null);
  const router = useRouter();
  
  const [deletePaymentLink, { isLoading: isDeleting }] = useDeletePaymentLinkMutation();

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const { data: brandsResp, isLoading: isBrandLoading } = useAllBrandsQuery();
  const brandList = brandsResp?.data ?? [];

  const {
    data: allResp,
    isLoading: isAllLoading,
    refetch: refetchAll,
  } = useAllPaymentLinksQuery(
    { page, limit },
    { skip: activeFilter !== "all" } // ✅ only fetch when "all"
  );

  const {
    data: brandResp,
    isLoading: isBrandLeadLoading,
    refetch: refetchBrand,
  } = useBrandLeadQuery(
    { id: activeFilter, page, limit },
    { skip: activeFilter === "all" } 
  );

  const activeResp = activeFilter === "all" ? allResp : brandResp;
  const items = activeResp?.data?.items ?? [];
  const meta  = activeResp?.data?.meta;

  const isLoading = activeFilter === "all" ? isAllLoading : isBrandLeadLoading;

  const onPageChange = useCallback((p) => setPage(p), []);

  const handleDelete = useCallback(async () => {
    try {
      await deletePaymentLink(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Paymentlink deleted successfully");
      if (activeFilter === "all") refetchAll();
      else refetchBrand();
    } catch (error) {
      
      toast.error(error?.data?.message || "Failed to delete Paymentlink");
    }
  }, [confirmDelete, deletePaymentLink, refetchAll, refetchBrand, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-gray-800 font-semibold">
          Loading your Payment links... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Link className="h-5 w-5 text-gray-800" />
            <h3 className="text-[#242424] text-xl font-bold">All Payment Link</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard/paymentLink/createPaymentLink")}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-normal hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4 text--white" />
              Create Payment Link
            </motion.button>
        
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className=" md:mx-0 rounded-2xl shadow-xl "
        >
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <ChartBar className="h-16 w-16 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700">No Payment links</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Payment links yet."
                  : "No Payment links for this brand."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {PAYMENTLINKHEADERS?.map((h) => (
                        <th
                          key={h}
                          className="sticky top-0 p-3 text-[10px] font-bold text-zinc-300 uppercase bg-zinc-800"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items?.map((emp) => (
                      <LinkRow key={emp?._id} emp={emp} setConfirmDelete={setConfirmDelete} />
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
            message="Payment link"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}


      </div>
    </div>
  );
}
