"use client";

import Link from "next/link";
import { fleetStatusClass } from "./fleetTheme";
import { withRowMemo } from "@/app/_utils/withRowMemo";

const VEHICLE_CARD_FIELDS = [
  "vehicle._id",
  "vehicle.vehicleName",
  "vehicle.make",
  "vehicle.model",
  "vehicle.year",
  "vehicle.registrationNumber",
  "vehicle.status",
];

function VehicleCard({ vehicle: v }) {
  return (
    <Link
      href={`/dashboard/fleet/vehicles/${v._id}`}
      className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{v.vehicleName}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {[v.make, v.model, v.year].filter(Boolean).join(" · ") || "—"}
          </p>
          <p className="text-xs text-zinc-600 mt-2 font-medium">{v.registrationNumber}</p>
        </div>
        <span className={fleetStatusClass(v.status)}>{v.status}</span>
      </div>
    </Link>
  );
}

export default withRowMemo(VehicleCard, VEHICLE_CARD_FIELDS);
