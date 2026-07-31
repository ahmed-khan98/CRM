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
import FleetRowMenu from "@/app/_Components/fleet/FleetRowMenu";
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
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

  const onSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  };

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
          handleEdit={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
        />

        <SearchFilterBar
          tabItems={STATUS_TABS}
          activeTab={status}
          onTabChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
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
                    <tr key={v._id} className={fleet.tableRow}>
                      <td className={fleet.tableCell}>
                        <p className="font-semibold text-zinc-900">{v.companyName}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{v.vendorName}</p>
                      </td>
                      <td className={fleet.tableCell}>{v.email}</td>
                      <td className={fleet.tableCell}>{v.phone}</td>
                      <td className={fleet.tableCell}>{v.city || "—"}</td>
                      <td className={fleet.tableCell}>
                        <span className={fleetStatusClass(v.status)}>{v.status}</span>
                      </td>
                      <td className={fleet.tableCell}>
                        <FleetRowMenu
                          onView={() => router.push(`/dashboard/fleet/vendors/${v._id}`)}
                          onEdit={() => {
                            setEditing(v);
                            setIsModalOpen(true);
                          }}
                          onDelete={() => setConfirmDelete(v._id)}
                        />
                      </td>
                    </tr>
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
          closeModal={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
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
