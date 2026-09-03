"use client";

import { useCallback, useMemo, useState } from "react";
import { Users, Download } from "lucide-react";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import { motion } from "framer-motion";
import {
  useAllClientsQuery,
  useDeleteClientMutation,
} from "@/app/_Services/Client/page";
import ClientModal from "@/app/_Components/Modal/ClientModal";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import toast from "react-hot-toast";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import ClientTable from "./_components/ClientTable";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { exportRowsToExcel } from "@/app/utilities/exportListToExcel";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Client() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: loggedUser } = useGetLoggedUserQuery();
  const userRole = loggedUser?.data?.role?.toUpperCase();
  const userDeptName = loggedUser?.data?.departmentId?.name;
  const canFilterDept = userRole === "ADMIN" || userRole === "SUBADMIN";

  const { data, isLoading, refetch } = useAllClientsQuery();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const { data: departments } = useAllDepartmentsQuery({
    skip: !canFilterDept,
  });

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const filteredClients = useMemo(() => {
    if (!data?.data) return [];
    const q = search.trim().toLowerCase();
    return data.data.filter((item) => {
      // DEP_ADMIN / USER: restrict to their own department only
      const deptName = canFilterDept
        ? activeFilter === "all"
          ? null
          : activeFilter
        : userDeptName;
      const matchesDept = !deptName || item?.departmentId?.name === deptName;
      const matchesSearch =
        !q ||
        item?.name?.toLowerCase().includes(q) ||
        item?.email?.toLowerCase().includes(q) ||
        item?.companyName?.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }, [data, activeFilter, search, canFilterDept, userDeptName]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteClient(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Client deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Client");
    }
  }, [confirmDelete, deleteClient, refetch]);

  const filterData = ["all", ...(departments?.data?.map((e) => e?.name) || [])];
  const deptTabItems = canFilterDept
    ? filterData.map((name) => ({ label: name, value: name }))
    : [];

  const handleExport = () => {
    try {
      if (!filteredClients.length) {
        toast.error("No clients to export");
        return;
      }
      exportRowsToExcel({
        sheetName: "Clients",
        fileName: `clients-${new Date().toISOString().slice(0, 10)}.xlsx`,
        rows: filteredClients.map((c) => ({
          Name: c.name,
          Email: c.email,
          Phone: c.phoneNo,
          Company: c.companyName,
          Brand: c.brandId?.name,
          Department: c.departmentId?.name,
          "Handled By": c.handleBy?.fullName,
        })),
      });
      toast.success("Clients exported");
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        title="Loading clients"
        subtitle="Fetching your customer records..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-1 flex flex-col space-y-3">
        <PageHeader
          icon={Users}
          length={data?.data?.length}
          name="All Clients"
          btnName="Create Client"
          handleEdit={handleEdit}
        >
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </PageHeader>

        <SearchFilterBar
          tabItems={deptTabItems}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          searchTerm={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, business..."
        />

        <motion.div variants={itemVariants}>
          {filteredClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients found"
              description={
                search
                  ? `No results for "${search}"`
                  : activeFilter === "all"
                    ? "Add a client to start tracking accounts and payment links."
                    : `No clients in ${activeFilter} yet.`
              }
            />
          ) : (
            <ClientTable
              clients={filteredClients}
              handleEdit={handleEdit}
              onDelete={setConfirmDelete}
            />
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
