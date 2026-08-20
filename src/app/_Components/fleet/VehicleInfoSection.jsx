"use client";

import { memo } from "react";
import Link from "next/link";
import { Car, Cog, ImageIcon, StickyNote } from "lucide-react";
import { fleet } from "./fleetTheme";
import InfoItem from "./InfoItem";
import SectionCard from "./SectionCard";

function VehicleInfoSection({ vehicle }) {
  return (
    <>
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
              <InfoItem label="Make" value={vehicle.make} capitalize />
              <InfoItem label="Model" value={vehicle.model} capitalize />
              <InfoItem label="Year" value={vehicle.year} capitalize />
              <InfoItem label="Registration" value={vehicle.registrationNumber} capitalize />
              <InfoItem label="VIN" value={vehicle.chassisNumber} capitalize />
              <InfoItem label="Engine No." value={vehicle.engineNumber} capitalize />
            </div>
          </SectionCard>

          <SectionCard icon={Cog} title="Specifications">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Fuel Type" value={vehicle.fuelType} capitalize />
              <InfoItem label="Transmission" value={vehicle.transmission} capitalize />
              <InfoItem label="Seats" value={vehicle.seatingCapacity} capitalize />
              <InfoItem
                label="Base Mileage"
                value={
                  vehicle.mileage != null
                    ? `${Number(vehicle.mileage).toLocaleString()} km`
                    : null
                }
                capitalize
              />
              <InfoItem
                label="Rent Amount"
                value={
                  vehicle.rentAmount != null ? `Rs ${vehicle.rentAmount}` : null
                }
                capitalize
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
    </>
  );
}

export default memo(VehicleInfoSection);
