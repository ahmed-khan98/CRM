"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
import { useGetVendorByIdQuery } from "@/app/_Services/vendor/page";
import { useGetVehiclesQuery } from "@/app/_Services/vehicle/page";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 break-words">{value || "—"}</p>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, action }) {
  return (
    <div className={`${fleet.card} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-zinc-700" />}
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

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

  if (isLoading || !vendor) {
    return <PageLoader title="Loading vendor" subtitle="Fetching details..." />;
  }

  return (
    <div className={fleet.page}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/fleet/vendors")}
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
          <button type="button" onClick={() => setEditOpen(true)} className={fleet.primaryBtn}>
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
          <button type="button" onClick={() => setAddVehicleOpen(true)} className={fleet.primaryBtn}>
            <Car className="w-3.5 h-3.5" /> Add Vehicle
          </button>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-sm text-zinc-500 py-6 text-center">No vehicles for this vendor yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <Link
                key={v._id}
                href={`/dashboard/fleet/vehicles/${v._id}`}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">{v.vehicleName}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {[v.make, v.model, v.year].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2 font-medium">
                      {v.registrationNumber}
                    </p>
                  </div>
                  <span className={fleetStatusClass(v.status)}>{v.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <VendorModal isOpen={editOpen} closeModal={() => setEditOpen(false)} data={vendor} />
      )}
      {addVehicleOpen && (
        <VehicleModal
          isOpen={addVehicleOpen}
          closeModal={() => setAddVehicleOpen(false)}
          defaultVendorId={id}
        />
      )}
    </div>
  );
}
