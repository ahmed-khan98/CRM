"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment-timezone";
import {
  ArrowLeft,
  Car,
  Cog,
  Gauge,
  ImageIcon,
  Pencil,
  StickyNote,
  Wrench,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import VehicleModal from "@/app/_Components/Modal/VehicleModal";
import { fleet, fleetStatusClass } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetVehicleByIdQuery,
  useAddVehicleMileageMutation,
  useAddVehicleMaintenanceMutation,
} from "@/app/_Services/vehicle/page";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 break-words capitalize">
        {value || "—"}
      </p>
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

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [showMileageForm, setShowMileageForm] = useState(false);
  const [showMaintForm, setShowMaintForm] = useState(false);

  const { data, isLoading } = useGetVehicleByIdQuery(id, { skip: !id });
  const vehicle = data?.data;

  const [addMileage, { isLoading: addingMileage }] = useAddVehicleMileageMutation();
  const [addMaintenance, { isLoading: addingMaint }] =
    useAddVehicleMaintenanceMutation();

  const [mileageForm, setMileageForm] = useState({
    date: moment().format("YYYY-MM-DD"),
    mileage: "",
    notes: "",
  });
  const [maintForm, setMaintForm] = useState({
    date: moment().format("YYYY-MM-DD"),
    mileage: "",
    notes: "",
    setStatus: true,
  });

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

  const submitMileage = async (e) => {
    e.preventDefault();
    try {
      await addMileage({
        id,
        body: {
          date: mileageForm.date,
          mileage: Number(mileageForm.mileage),
          notes: mileageForm.notes,
        },
      }).unwrap();
      toast.success("Mileage logged");
      setMileageForm((f) => ({ ...f, mileage: "", notes: "" }));
      setShowMileageForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to log mileage");
    }
  };

  const submitMaintenance = async (e) => {
    e.preventDefault();
    try {
      await addMaintenance({
        id,
        body: {
          date: maintForm.date,
          mileage: Number(maintForm.mileage),
          notes: maintForm.notes,
          setStatus: maintForm.setStatus,
        },
      }).unwrap();
      toast.success("Maintenance logged");
      setMaintForm((f) => ({ ...f, mileage: "", notes: "" }));
      setShowMaintForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to log maintenance");
    }
  };

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
            onClick={() => router.push("/dashboard/fleet/vehicles")}
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
          <button type="button" onClick={() => setEditOpen(true)} className={fleet.primaryBtn}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${fleet.card} overflow-hidden`}>
          <div className="h-44 bg-zinc-100 flex items-center justify-center">
            {vehicle.images?.[0]?.url ? (
              <img
                src={vehicle.images[0].url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Car className="w-16 h-16 text-zinc-300" />
            )}
          </div>
          <div className="p-4 space-y-3">
            {vehicle.color && (
              <div className="flex items-center gap-2 text-sm text-zinc-700 capitalize">
                <span className="h-4 w-4 rounded-full border border-zinc-200 bg-zinc-200" />
                {vehicle.color}
              </div>
            )}
            <div>
              <p className="text-[11px] text-zinc-500">Vendor</p>
              {vehicle.vendor?._id ? (
                <Link
                  href={`/dashboard/fleet/vendors/${vehicle.vendor._id}`}
                  className="text-sm font-semibold text-zinc-900 hover:underline"
                >
                  {vehicle.vendor.companyName}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-zinc-800">—</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <SectionCard icon={Car} title="Vehicle Info">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Make" value={vehicle.make} />
              <InfoItem label="Model" value={vehicle.model} />
              <InfoItem label="Year" value={vehicle.year} />
              <InfoItem label="Registration" value={vehicle.registrationNumber} />
              <InfoItem label="VIN" value={vehicle.chassisNumber} />
              <InfoItem label="Engine No." value={vehicle.engineNumber} />
            </div>
          </SectionCard>

          <SectionCard icon={Cog} title="Specifications">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Fuel Type" value={vehicle.fuelType} />
              <InfoItem label="Transmission" value={vehicle.transmission} />
              <InfoItem label="Seats" value={vehicle.seatingCapacity} />
              <InfoItem
                label="Base Mileage"
                value={
                  vehicle.mileage != null
                    ? `${Number(vehicle.mileage).toLocaleString()} km`
                    : null
                }
              />
              <InfoItem
                label="Rent Amount"
                value={
                  vehicle.rentAmount != null ? `Rs ${vehicle.rentAmount}` : null
                }
              />
            </div>
          </SectionCard>

          {vehicle.notes && (
            <SectionCard icon={StickyNote} title="Notes">
              <p className="text-sm text-zinc-600 leading-relaxed">{vehicle.notes}</p>
            </SectionCard>
          )}
        </div>
      </div>

      {(vehicle.images?.length > 0 || vehicle.videos?.length > 0) && (
        <div className="mt-4">
          <SectionCard icon={ImageIcon} title="Media">
            {vehicle.images?.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
                  Images ({vehicle.images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {vehicle.images.map((img, i) => (
                    <a
                      key={`img-${i}`}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100"
                    >
                      <img
                        src={img.url}
                        alt={img.originalName || `Vehicle image ${i + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {vehicle.videos?.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
                  Videos ({vehicle.videos.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.videos.map((vid, i) => (
                    <div
                      key={`vid-${i}`}
                      className="rounded-xl overflow-hidden border border-zinc-200 bg-black"
                    >
                      <video
                        src={vid.url}
                        controls
                        className="w-full max-h-56 object-contain bg-black"
                      >
                        Your browser does not support the video tag.
                      </video>
                      {vid.originalName && (
                        <p className="px-3 py-1.5 text-[11px] text-zinc-400 bg-zinc-900 truncate">
                          {vid.originalName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-4">
        <SectionCard
          icon={Gauge}
          title="Daily Mileage Log"
          action={
            <button
              type="button"
              onClick={() => setShowMileageForm((v) => !v)}
              className={fleet.primaryBtn}
            >
              <Plus className="w-3.5 h-3.5" /> Add Entry
            </button>
          }
        >
          {showMileageForm && (
            <form onSubmit={submitMileage} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <input type="date" required value={mileageForm.date} onChange={(e) => setMileageForm((f) => ({ ...f, date: e.target.value }))} className={fleet.input} />
              <input type="number" required min={0} placeholder="Mileage" value={mileageForm.mileage} onChange={(e) => setMileageForm((f) => ({ ...f, mileage: e.target.value }))} className={fleet.input} />
              <input type="text" placeholder="Notes" value={mileageForm.notes} onChange={(e) => setMileageForm((f) => ({ ...f, notes: e.target.value }))} className={fleet.input} />
              <button type="submit" disabled={addingMileage} className={`${fleet.primaryBtn} sm:col-span-3 justify-center`}>
                {addingMileage ? "Saving..." : "Save Mileage"}
              </button>
            </form>
          )}
          {mileageHistory.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 text-center">
              No mileage logs yet. Add the first entry.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {mileageHistory.map((h) => (
                <li key={h._id} className="py-2.5 flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-zinc-900">{h.mileage} km</p>
                    {h.notes && <p className="text-xs text-zinc-500">{h.notes}</p>}
                  </div>
                  <p className="text-xs text-zinc-500 shrink-0">
                    {moment(h.date).format("DD MMM YYYY")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          icon={Wrench}
          title="Maintenance History"
          action={
            <button
              type="button"
              onClick={() => setShowMaintForm((v) => !v)}
              className={fleet.primaryBtn}
            >
              <Plus className="w-3.5 h-3.5" /> Log Maintenance
            </button>
          }
        >
          {showMaintForm && (
            <form onSubmit={submitMaintenance} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <input type="date" required value={maintForm.date} onChange={(e) => setMaintForm((f) => ({ ...f, date: e.target.value }))} className={fleet.input} />
              <input type="number" required min={0} placeholder="Mileage at service" value={maintForm.mileage} onChange={(e) => setMaintForm((f) => ({ ...f, mileage: e.target.value }))} className={fleet.input} />
              <input type="text" placeholder="Notes" value={maintForm.notes} onChange={(e) => setMaintForm((f) => ({ ...f, notes: e.target.value }))} className={fleet.input} />
              <label className="sm:col-span-3 flex items-center gap-2 text-xs text-zinc-600">
                <input type="checkbox" checked={maintForm.setStatus} onChange={(e) => setMaintForm((f) => ({ ...f, setStatus: e.target.checked }))} />
                Set status to Maintenance
              </label>
              <button type="submit" disabled={addingMaint} className={`${fleet.primaryBtn} sm:col-span-3 justify-center`}>
                {addingMaint ? "Saving..." : "Save Maintenance"}
              </button>
            </form>
          )}
          {maintenanceHistory.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 text-center">
              No maintenance records yet.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {maintenanceHistory.map((h) => (
                <li key={h._id} className="py-2.5 flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-zinc-900">{h.mileage} km</p>
                    {h.notes && <p className="text-xs text-zinc-500">{h.notes}</p>}
                  </div>
                  <p className="text-xs text-zinc-500 shrink-0">
                    {moment(h.date).format("DD MMM YYYY")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {editOpen && (
        <VehicleModal isOpen={editOpen} closeModal={() => setEditOpen(false)} data={vehicle} />
      )}
    </div>
  );
}
