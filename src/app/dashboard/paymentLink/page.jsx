"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChartBar,
  Link,
  CheckCheck,
  Copy,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";
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
  const departmentOptions = useMemo(
    () => [
      { value: "", label: "All Departments" },
      ...(departments?.data?.map((department) => ({
        value: department?._id,
        label: department?.name,
      })) ?? []),
    ],
    [departments],
  );
  const selectedDepartmentOption =
    departmentOptions.find((option) => option.value === selectedDepartment) ||
    departmentOptions[0];

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
          Loading your Payment links... 🚀
        </span>
      </div>
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

        <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
                  Filters
                </p>
                <p className="text-sm font-black text-zinc-900">
                  Search payment links
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 md:flex-row lg:max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by client, seller, or agent..."
                  className="h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-9 pr-10 text-sm font-medium text-zinc-800 outline-none transition focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />
                {searchTerm && searchTerm !== debouncedSearchTerm ? (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">
                    typing...
                  </span>
                ) : null}
              </div>

              {canFilterDepartment && (
                <div className="w-full md:w-72">
                  <Select
                    instanceId="payment-department-filter"
                    options={departmentOptions}
                    value={selectedDepartmentOption}
                    isLoading={isDepartmentLoading}
                    isSearchable
                    onChange={(option) =>
                      setSelectedDepartment(option?.value || "")
                    }
                    classNamePrefix="payment-filter"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "2.75rem",
                        borderRadius: "1rem",
                        backgroundColor: "#fafafa",
                        borderColor: state.isFocused ? "#18181b" : "#e4e4e7",
                        boxShadow: state.isFocused
                          ? "0 0 0 4px #f4f4f5"
                          : "none",
                        cursor: "pointer",
                        fontSize: "0.775rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        ":hover": { borderColor: "#18181b" },
                      }),
                      option: (base, state) => ({
                        ...base,
                        cursor: "pointer",
                        
                        fontSize: "0.675rem",
                        fontWeight: 500,
                        textTransform: "capitalize",
                        backgroundColor: state.isSelected
                          ? "#18181b"
                          : state.isFocused
                            ? "#f4f4f5"
                            : "white",
                        color: state.isSelected ? "white" : "#27272a",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 50,
                        borderRadius: "1rem",
                        overflow: "hidden",
                        border: "1px solid #e4e4e7",
                        boxShadow: "0 18px 35px rgba(0,0,0,0.12)",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#18181b",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#a1a1aa",
                      }),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

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
            <div
              className="w-full rounded-2xl border border-zinc-200 bg-white shadow-sm"
              style={{ overflow: "hidden" }}
            >
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
