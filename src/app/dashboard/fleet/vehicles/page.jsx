"use client";

import { useCallback, useMemo, useState, memo } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Truck } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import VehicleModal from "@/app/_Components/Modal/VehicleModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import FleetVehicleRow from "@/app/_Components/fleet/FleetVehicleRow";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetVehiclesQuery,
  useDeleteVehicleMutation,
} from "@/app/_Services/vehicle/page";
import { useGetVendorsQuery } from "@/app/_Services/vendor/page";

const MemoPagination = memo(Pagination);

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Rented", value: "rented" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Inactive", value: "inactive" },
];

export default function FleetVehiclesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [vendorId, setVendorId] = useState(null);
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

  const onVendorFilterChange = useCallback((opt) => {
    setVendorId(opt?.value || null);
    setPage(1);
  }, []);

  const openAddModal = useCallback(() => {
    setEditing(null);
    setIsModalOpen(true);
  }, []);

  const closeVehicleModal = useCallback(() => {
    setIsModalOpen(false);
    setEditing(null);
  }, []);

  const handleViewVehicle = useCallback(
    (vehicleId) => router.push(`/dashboard/fleet/vehicles/${vehicleId}`),
    [router]
  );
  const handleEditVehicle = useCallback((vehicle) => {
    setEditing(vehicle);
    setIsModalOpen(true);
  }, []);
  const handleDeleteRequest = useCallback((vehicleId) => setConfirmDelete(vehicleId), []);

  const { data: vendorsData } = useGetVendorsQuery({ page: 1, limit: 100 });
  const vendorOptions = useMemo(
    () =>
      (vendorsData?.data?.items || []).map((v) => ({
        value: v._id,
        label: v.companyName,
      })),
    [vendorsData]
  );

  const { data, isLoading, isFetching } = useGetVehiclesQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    vendor: vendorId || undefined,
  });

  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();
  const items = data?.data?.items || [];
  const meta = data?.data?.meta;

  const handleDelete = useCallback(async () => {
    try {
      await deleteVehicle(confirmDelete).unwrap();
      toast.success("Vehicle deleted");
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  }, [confirmDelete, deleteVehicle]);

  if (isLoading) {
    return <PageLoader title="Loading vehicles" subtitle="Fetching fleet vehicles..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-1 flex flex-col space-y-3">
        <PageHeader
          icon={Truck}
          length={meta?.total || 0}
          name="Vehicles"
          btnName="Add Vehicle"
          handleEdit={openAddModal}
        >
          <div className="w-full max-w-xs">
            <Select
              options={vendorOptions}
              value={vendorOptions.find((o) => o.value === vendorId) || null}
              onChange={onVendorFilterChange}
              isClearable
              placeholder="All Vendors"
              classNamePrefix="fleet-select"
            />
          </div>
        </PageHeader>

        <SearchFilterBar
          tabItems={STATUS_TABS}
          activeTab={status}
          onTabChange={onTabChange}
          searchTerm={search}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search by name, make, model or registration..."
          debouncedSearchTerm={debouncedSearch}
        />

        <div className={`${fleet.card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={fleet.tableHead}>Vehicle</th>
                  <th className={fleet.tableHead}>Vendor</th>
                  <th className={fleet.tableHead}>Registration</th>
                  <th className={fleet.tableHead}>Year</th>
                  <th className={fleet.tableHead}>Fuel</th>
                  <th className={fleet.tableHead}>Rent</th>
                  <th className={fleet.tableHead}>Status</th>
                  <th className={`${fleet.tableHead} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                      {isFetching ? "Loading..." : "No vehicles found"}
                    </td>
                  </tr>
                ) : (
                  items.map((v) => (
                    <FleetVehicleRow
                      key={v._id}
                      vehicle={v}
                      onView={handleViewVehicle}
                      onEdit={handleEditVehicle}
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
        <VehicleModal
          isOpen={isModalOpen}
          closeModal={closeVehicleModal}
          data={editing}
        />
      )}

      {confirmDelete && (
        <WarningModal
          message="vehicle"
          setConfirmDelete={setConfirmDelete}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
