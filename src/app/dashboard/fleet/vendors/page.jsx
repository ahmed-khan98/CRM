"use client";

import { useCallback, useMemo, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import VendorModal from "@/app/_Components/Modal/VendorModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import FleetVendorRow from "@/app/_Components/fleet/FleetVendorRow";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetVendorsQuery,
  useDeleteVendorMutation,
} from "@/app/_Services/vendor/page";

const MemoPagination = memo(Pagination);

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function FleetVendorsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const searchTimer = useMemo(() => ({ current: null }), []);

  const onSearchChange = useCallback((val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  }, [searchTimer]);

  const onTabChange = useCallback((v) => {
    setStatus(v);
    setPage(1);
  }, []);

  const openAddModal = useCallback(() => {
    setEditing(null);
    setIsModalOpen(true);
  }, []);

  const closeVendorModal = useCallback(() => {
    setIsModalOpen(false);
    setEditing(null);
  }, []);

  const handleViewVendor = useCallback(
    (vendorId) => router.push(`/dashboard/fleet/vendors/${vendorId}`),
    [router]
  );
  const handleEditVendor = useCallback((vendor) => {
    setEditing(vendor);
    setIsModalOpen(true);
  }, []);
  const handleDeleteRequest = useCallback((vendorId) => setConfirmDelete(vendorId), []);

  const { data, isLoading, isFetching } = useGetVendorsQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();
  const items = data?.data?.items || [];
  const meta = data?.data?.meta;

  const handleDelete = useCallback(async () => {
    try {
      await deleteVendor(confirmDelete).unwrap();
      toast.success("Vendor deleted");
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  }, [confirmDelete, deleteVendor]);

  if (isLoading) {
    return <PageLoader title="Loading vendors" subtitle="Fetching fleet vendors..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-1 flex flex-col space-y-3">
        <PageHeader
          icon={Building2}
          length={meta?.total || 0}
          name="Vendors"
          btnName="Add Vendor"
          handleEdit={openAddModal}
        />

        <SearchFilterBar
          tabItems={STATUS_TABS}
          activeTab={status}
          onTabChange={onTabChange}
          searchTerm={search}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search by company, vendor, email or phone..."
          debouncedSearchTerm={debouncedSearch}
        />

        <div className={`${fleet.card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={fleet.tableHead}>Company / Vendor</th>
                  <th className={fleet.tableHead}>Email</th>
                  <th className={fleet.tableHead}>Phone</th>
                  <th className={fleet.tableHead}>City</th>
                  <th className={fleet.tableHead}>Status</th>
                  <th className={`${fleet.tableHead} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500">
                      {isFetching ? "Loading..." : "No vendors found"}
                    </td>
                  </tr>
                ) : (
                  items.map((v) => (
                    <FleetVendorRow
                      key={v._id}
                      vendor={v}
                      onView={handleViewVendor}
                      onEdit={handleEditVendor}
                      onDelete={handleDeleteRequest}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-2 border-t border-zinc-100">
            <MemoPagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VendorModal
          isOpen={isModalOpen}
          closeModal={closeVendorModal}
          data={editing}
        />
      )}

      {confirmDelete && (
        <WarningModal
          message="vendor (and their vehicles)"
          setConfirmDelete={setConfirmDelete}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
