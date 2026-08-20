"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment-timezone";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  FileText,
  Car,
  Pencil,
  StickyNote,
} from "lucide-react";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import VendorModal from "@/app/_Components/Modal/VendorModal";
import VehicleModal from "@/app/_Components/Modal/VehicleModal";
import VehicleCard from "@/app/_Components/fleet/VehicleCard";
import InfoItem from "@/app/_Components/fleet/InfoItem";
import SectionCard from "@/app/_Components/fleet/SectionCard";
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
import { useGetVendorByIdQuery } from "@/app/_Services/vendor/page";
import { useGetVehiclesQuery } from "@/app/_Services/vehicle/page";

export default function VendorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  const { data, isLoading } = useGetVendorByIdQuery(id, { skip: !id });
  const vendor = data?.data;

  const { data: vehiclesData } = useGetVehiclesQuery(
    { page: 1, limit: 50, vendor: id },
    { skip: !id }
  );
  const vehicles = vehiclesData?.data?.items || [];

  const handleBack = useCallback(() => router.push("/dashboard/fleet/vendors"), [router]);
  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);
  const openAddVehicle = useCallback(() => setAddVehicleOpen(true), []);
  const closeAddVehicle = useCallback(() => setAddVehicleOpen(false), []);

  if (isLoading || !vendor) {
    return <PageLoader title="Loading vendor" subtitle="Fetching details..." />;
  }

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
            <h1 className={fleet.title}>{vendor.companyName}</h1>
            <p className={fleet.subtitle}>{vendor.vendorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:pr-1">
          <span className={fleetStatusClass(vendor.status)}>{vendor.status}</span>
          <button type="button" onClick={openEdit} className={fleet.primaryBtn}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${fleet.card} p-6 flex flex-col items-center text-center`}>
          <div className="h-24 w-24 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden mb-4">
            {vendor.profilePicture?.url ? (
              <img src={vendor.profilePicture.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-zinc-500" />
            )}
          </div>
          <p className="text-lg font-bold text-zinc-900">{vendor.vendorName}</p>
          <p className="text-sm text-zinc-500 mt-0.5">{vendor.companyName}</p>
          <p className="text-[11px] text-zinc-400 mt-3">
            Created by {vendor.createdBy?.fullName || "—"}
          </p>
          <p className="text-[11px] text-zinc-400">
            Created: {moment(vendor.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <SectionCard icon={Mail} title="Contact">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Email" value={vendor.email} />
              <InfoItem label="Phone" value={vendor.phone} />
              <InfoItem label="Alternate Phone" value={vendor.emergencyPhone} />
            </div>
          </SectionCard>

          <SectionCard icon={MapPin} title="Address">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Street" value={vendor.address} />
              <InfoItem label="City" value={vendor.city} />
              <InfoItem label="State" value={vendor.state} />
              <InfoItem label="Country" value={vendor.country} />
              <InfoItem label="Postal Code" value={vendor.postalCode} />
            </div>
          </SectionCard>

          <SectionCard icon={FileText} title="Business Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Tax Number" value={vendor.taxNumber} />
              <InfoItem label="Registration" value={vendor.registrationNumber} />
            </div>
          </SectionCard>

          {vendor.notes && (
            <SectionCard icon={StickyNote} title="Notes">
              <p className="text-sm text-zinc-600 leading-relaxed">{vendor.notes}</p>
            </SectionCard>
          )}
        </div>
      </div>

      <div className={`${fleet.card} p-5 mt-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900">
              Vehicles ({vehicles.length || vendor.vehicleCount || 0})
            </h3>
          </div>
          <button type="button" onClick={openAddVehicle} className={fleet.primaryBtn}>
            <Car className="w-3.5 h-3.5" /> Add Vehicle
          </button>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-sm text-zinc-500 py-6 text-center">No vehicles for this vendor yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <VendorModal isOpen={editOpen} closeModal={closeEdit} data={vendor} />
      )}
      {addVehicleOpen && (
        <VehicleModal
          isOpen={addVehicleOpen}
          closeModal={closeAddVehicle}
          defaultVendorId={id}
        />
      )}
    </div>
  );
}
