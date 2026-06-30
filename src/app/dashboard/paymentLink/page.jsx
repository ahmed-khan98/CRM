"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { ChartBar, Link, CheckCheck, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import { PAYMENTLINKHEADERS } from "@/app/_Components/table/tableRow/tableHeader/paymentlinkHeader";
import {
  useAllPaymentLinksQuery,
  useDeletePaymentLinkMutation,
} from "@/app/_Services/paymentLink/page";
import { useRouter } from "next/navigation";
import { LinkRow } from "@/app/_Components/table/tableRow/LinkRow";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import PageHeader from "@/app/_Components/PageHeader/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";

const paymentPageUrl = process.env.NEXT_PUBLIC_PAYMENT_PAGE_URL;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MemoPagination = React.memo(Pagination);

const useDebouncedValue = (value, delay = 450) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export default function Paymentlink() {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const router = useRouter();
  const [copiedButton, setCopiedButton] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const {
    data: loggedUser,
    error: isloggedError,
    isLoading: isLoggedLoading,
    refetch: isLoggedRefetch,
  } = useGetLoggedUserQuery();
  
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const canFilterDepartment = userRole === "ADMIN" || userRole === "SUBADMIN";
  const { data: departments, isLoading: isDepartmentLoading } =
    useAllDepartmentsQuery(undefined, { skip: !canFilterDepartment });

  const deptTabItems = useMemo(
    () => [
      { label: "All", value: "" },
      ...(departments?.data?.map((d) => ({
        label: d?.name,
        value: d?._id,
      })) ?? []),
    ],
    [departments],
  );

  const [deletePaymentLink, { isLoading: isDeleting }] =
    useDeletePaymentLinkMutation();

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedDepartment]);

  const {
    data: allLink,
    isLoading: isAllLoading,
    refetch: refetchAll,
  } = useAllPaymentLinksQuery({
    page,
    limit,
    search: debouncedSearchTerm.trim(),
    departmentId: selectedDepartment,
  });

  const items = allLink?.data?.items ?? [];
  const meta = allLink?.data?.meta;

  const isLoading = isAllLoading;

  const onPageChange = useCallback((p) => setPage(p), []);

  const handleDelete = useCallback(async () => {
    try {
      await deletePaymentLink(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Paymentlink deleted successfully");
      refetchAll();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Paymentlink");
    }
  }, [confirmDelete, deletePaymentLink, refetchAll]);

  const copyLink = async (type, url) => {
    console.log(url, "url");
    try {
      await navigator.clipboard.writeText(url);

      setCopiedButton(type);

      setTimeout(() => {
        setCopiedButton("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        title="Loading payment links"
        subtitle="Syncing payment records..."
      />
    );
  }

  return (
    <div className="min-h-screen mx-1">
      <div className="w-full mx-auto px-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-1 justify-between items-center md:flex-row">
          <div className="flex flex-wrap gap-2">
            {loggedUser?.data?.departmentId === "68c0775f7461c6fef325f17c" && (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-all duration-300"
                  onClick={() =>
                    copyLink(
                      "writerz",
                      `${paymentPageUrl}69398800611751901050927d?brand=${encodeURIComponent("writerz paradise")}`,
                    )
                  }
                >
                  {copiedButton === "writerz" ? (
                    <CheckCheck className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}

                  {"99 with Writerz Paradise"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-all duration-300"
                  onClick={() =>
                    copyLink(
                      "boston",
                      `${paymentPageUrl}6a0f4cdc1f5d8879c0b173a6?brand=${encodeURIComponent("boston publishers")}`,
                    )
                  }
                >
                  {copiedButton === "boston" ? (
                    <CheckCheck className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}

                  {"110 with Boston Publishers"}
                </motion.button>
              </>
            )}
          </div>
        </div>
        <PageHeader
          icon={Link}
          length={meta?.total || 0}
          name=" All Payment Links"
          btnName="Create Payment Link"
          handleEdit={() =>
            router.push("/dashboard/paymentLink/createPaymentLink")
          }
        />

        <SearchFilterBar
          tabItems={canFilterDepartment ? deptTabItems : []}
          activeTab={selectedDepartment}
          onTabChange={setSelectedDepartment}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by client, seller, or agent..."
          debouncedSearchTerm={debouncedSearchTerm}
        />

        <motion.div
          variants={itemVariants}
          className=" md:mx-0 rounded-2xl shadow-xl "
        >
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <ChartBar className="h-16 w-16 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Payment links
              </h3>
              <p className="text-gray-500 mt-2">
                No payment links matched your filters.
              </p>
            </div>
          ) : (
            <div className="-mx-1 overflow-hidden rounded-2xl bg-white shadow-sm md:mx-0 md:border md:border-zinc-200">
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "90vh",
                }}
              >
                <table
                  className="text-left border-collapse"
                  style={{ minWidth: "1100px", width: "100%" }}
                >
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {PAYMENTLINKHEADERS?.map((h) => (
                        <th
                          key={h}
                          className="sticky top-0 p-3 text-[10px] font-bold text-zinc-300 uppercase bg-zinc-900"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items?.map((emp) => (
                      <LinkRow
                        key={emp?._id}
                        emp={emp}
                        setConfirmDelete={setConfirmDelete}
                        refetchAll={refetchAll}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isAllLoading && (
            <MemoPagination meta={meta} onPageChange={onPageChange} />
          )}
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
