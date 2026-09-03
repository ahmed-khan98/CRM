"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { ChartBar, Plus, Download, LayoutGrid, Table2 } from "lucide-react";
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
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { tableWrap, thClass, theadRow } from "@/app/_Components/ui/saas/DataTable";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import LeadKanban from "./_components/LeadKanban";
import { exportRowsToExcel } from "@/app/utilities/exportListToExcel";

const LEAD_ACTION_FILTER_OPTIONS = [
  { value: "all", label: "All actions" },
  { value: "interested", label: "Interested" },
  { value: "no answer", label: "No answer" },
  { value: "not interested", label: "Not interested" },
  { value: "schedule", label: "Scheduled" },
  { value: "in loop", label: "In loop" },
];

const LEAD_PAID_FILTER_OPTIONS = [
  { value: "all", label: "All payment status" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "failed", label: "Failed" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MemoPagination = React.memo(Pagination);
function Leads() {
  // const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lastActionFilter, setLastActionFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("filter") || "all";
  const page = Number(searchParams.get("page")) || 1;
  // const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const queryArgs = {
    page,
    limit,
    search: debouncedSearch,
    lastAction: lastActionFilter,
    paidStatus: paidFilter,
  };

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
  } = useAllLeadsQuery(queryArgs, { skip: activeFilter !== "all" });

  const {
    data: brandResp,
    isLoading: isBrandLoading,
    isFetching: isBrandFetching,
    refetch: refetchBrand,
  } = useBrandLeadQuery(
    { ...queryArgs, id: activeFilter },
    { skip: activeFilter === "all" },
  );

  const activeResp = activeFilter === "all" ? allResp : brandResp;
  const items = activeResp?.data?.items ?? [];
  const meta = activeResp?.data?.meta;

  const isInitialLoading = isAllLoading || isBrandLoading;

  const isPaginationLoading = isAllFetching || isBrandFetching;

  // const isLoading = activeFilter === "all" ? isAllLoading : isBrandLeadLoading;

  const handleEdit = useCallback(() => {
    setEditLead(null);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditLead(null);
  }, []);
  const closeImportModal = useCallback(() => setIsImportOpen(false), []);

  const closeActionModal = useCallback(() => {
    setIsActionOpen(false);
    setEditingAppointment(null);
  }, []);

  const handleAction = useCallback((emp) => {
    setEditingAppointment(emp);
    setIsActionOpen(true);
  }, []);

  const handleEditLead = useCallback((emp) => {
    setEditLead(emp);
    setIsModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    try {
      if (!items.length) {
        toast.error("No leads to export");
        return;
      }
      exportRowsToExcel({
        sheetName: "Leads",
        fileName: `leads-${new Date().toISOString().slice(0, 10)}.xlsx`,
        rows: items.map((lead) => ({
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phoneNo,
          "Serial No": lead.serialNo,
          "Brand Mark": lead.brandMark,
          Brand: lead.brandId?.name || "",
          Department: lead.departmentId?.name || "",
          "Last Action": lead.lastAction || "",
          Comment: lead.lastComment || "",
          "Paid Status": lead.paidStatus || "",
          "Signup Date": lead.signupDate || "",
        })),
      });
      toast.success("Leads exported");
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  }, [items]);

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
      <PageLoader title="Loading leads" subtitle="Fetching pipeline data..." />
    );
  }

  return (
    <div className=" mx-1">
      <div className="max-full mx-auto  flex flex-col space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm shadow-slate-200/60 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                <ChartBar className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-zinc-900">All Leads</h1>
                <p className="text-[11px] font-medium text-zinc-500">Pipeline records for your brands</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleEdit}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Add New Lead
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleExport}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsImportOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Import
              </motion.button>
            </div>
          </div>
        </div>

        {/* Brand filter chips */}

        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => onFilterChange("all")}
            className={`cursor-pointer rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
              activeFilter === "all"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
            }`}
          >
            All
          </button>

          {brandList?.map((b) => (
            <button
              key={b?._id}
              onClick={() => onFilterChange(b?._id)}
              className={`cursor-pointer rounded-xl px-3 py-1.5 text-[11px] font-bold capitalize transition ${
                activeFilter === b?._id
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              }`}
            >
              {b?.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <SearchFilterBar
            searchTerm={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search name, email, phone, serial..."
            debouncedSearchTerm={debouncedSearch}
            tabItems={[]}
          />

          <div className="flex flex-wrap items-center gap-2">
            <CrmSelect
              className="w-[9.5rem]"
              variant="pill"
              options={LEAD_ACTION_FILTER_OPTIONS}
              value={lastActionFilter}
              onChange={setLastActionFilter}
            />

            <CrmSelect
              className="w-[11rem]"
              variant="pill"
              options={LEAD_PAID_FILTER_OPTIONS}
              value={paidFilter}
              onChange={setPaidFilter}
            />

            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                  viewMode === "table" ? "bg-zinc-900 text-white" : "text-zinc-500"
                }`}
              >
                <Table2 className="h-3.5 w-3.5" /> Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                  viewMode === "kanban" ? "bg-zinc-900 text-white" : "text-zinc-500"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
              </button>
            </div>
          </div>
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
            <EmptyState
              icon={ChartBar}
              title="No leads found"
              description={
                activeFilter === "all"
                  ? "Add a lead or import a list to start your pipeline."
                  : "No leads for this brand yet."
              }
            />
          ) : viewMode === "kanban" ? (
            <LeadKanban
              items={items}
              onEdit={handleAction}
              setConfirmDelete={setConfirmDelete}
            />
          ) : (
            <div className={tableWrap}>
              <div
                className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-260px)]"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#52525b transparent",
                }}
              >
                <table className="min-w-full">
                  <thead className={`sticky top-0 z-20 ${theadRow}`}>
                    <tr>
                      {LEADHEADERS?.map((h) => (
                        <th key={h} className={thClass}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {items?.map((emp, i) => (
                      <LeadRow
                        index={i + 1}
                        emp={emp}
                        onEdit={handleAction}
                        onEditLead={handleEditLead}
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
          data={editLead}
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
