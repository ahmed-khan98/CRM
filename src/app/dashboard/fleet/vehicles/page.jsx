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
import FleetRowMenu from "@/app/_Components/fleet/FleetRowMenu";
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
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

  const onSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  };

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
          handleEdit={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
        >
          <div className="w-full max-w-xs">
            <Select
              options={vendorOptions}
              value={vendorOptions.find((o) => o.value === vendorId) || null}
              onChange={(opt) => {
                setVendorId(opt?.value || null);
                setPage(1);
              }}
              isClearable
              placeholder="All Vendors"
              classNamePrefix="fleet-select"
            />
          </div>
        </PageHeader>

        <SearchFilterBar
          tabItems={STATUS_TABS}
          activeTab={status}
          onTabChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
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
                    <tr key={v._id} className={fleet.tableRow}>
                      <td className={fleet.tableCell}>
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="h-11 w-14 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                            {v.images?.[0]?.url ? (
                              <img
                                src={v.images[0].url}
                                alt={v.vehicleName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Truck className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 truncate">
                              {v.vehicleName}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5 truncate">
                              {[v.make, v.model].filter(Boolean).join(" ") || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={fleet.tableCell}>{v.vendor?.companyName || "—"}</td>
                      <td className={fleet.tableCell}>{v.registrationNumber}</td>
                      <td className={fleet.tableCell}>{v.year || "—"}</td>
                      <td className={`${fleet.tableCell} capitalize`}>{v.fuelType || "—"}</td>
                      <td className={fleet.tableCell}>
                        {v.rentAmount != null && v.rentAmount !== ""
                          ? `Rs ${Number(v.rentAmount).toLocaleString()}`
                          : "—"}
                      </td>
                      <td className={fleet.tableCell}>
                        <span className={fleetStatusClass(v.status)}>{v.status}</span>
                      </td>
                      <td className={fleet.tableCell}>
                        <FleetRowMenu
                          onView={() => router.push(`/dashboard/fleet/vehicles/${v._id}`)}
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
        <VehicleModal
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
          message="vehicle"
          setConfirmDelete={setConfirmDelete}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
