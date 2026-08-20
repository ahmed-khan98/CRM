"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import VehicleModal from "@/app/_Components/Modal/VehicleModal";
import VehicleInfoSection from "@/app/_Components/fleet/VehicleInfoSection";
import MileageHistorySection from "@/app/_Components/fleet/MileageHistorySection";
import MaintenanceHistorySection from "@/app/_Components/fleet/MaintenanceHistorySection";
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
import { useGetVehicleByIdQuery } from "@/app/_Services/vehicle/page";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useGetVehicleByIdQuery(id, { skip: !id });
  const vehicle = data?.data;

  const mileageHistory = useMemo(
    () =>
      [...(vehicle?.mileageHistory || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    [vehicle]
  );
  const maintenanceHistory = useMemo(
    () =>
      [...(vehicle?.maintenanceHistory || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    [vehicle]
  );

  const handleBack = useCallback(
    () => router.push("/dashboard/fleet/vehicles"),
    [router]
  );
  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);

  if (isLoading || !vehicle) {
    return <PageLoader title="Loading vehicle" subtitle="Fetching details..." />;
  }

  const subtitle = [vehicle.make, vehicle.model, vehicle.year]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={fleet.page}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="mt-1 p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={fleet.title}>{vehicle.vehicleName}</h1>
            <p className={fleet.subtitle}>{subtitle || "Vehicle details"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={fleetStatusClass(vehicle.status)}>{vehicle.status}</span>
          <button type="button" onClick={openEdit} className={fleet.primaryBtn}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      <VehicleInfoSection vehicle={vehicle} />

      <div className="grid grid-cols-1 gap-4 mt-4">
        <MileageHistorySection vehicleId={id} mileageHistory={mileageHistory} />
        <MaintenanceHistorySection vehicleId={id} maintenanceHistory={maintenanceHistory} />
      </div>

      {editOpen && (
        <VehicleModal isOpen={editOpen} closeModal={closeEdit} data={vehicle} />
      )}
    </div>
  );
}
