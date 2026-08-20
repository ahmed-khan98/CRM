"use client";

import { useCallback } from "react";
import { Truck } from "lucide-react";
import FleetRowMenu from "./FleetRowMenu";
import { fleet, fleetStatusClass } from "./fleetTheme";
import { withRowMemo } from "@/app/_utils/withRowMemo";

const VEHICLE_ROW_FIELDS = [
  "vehicle._id",
  "vehicle.vehicleName",
  "vehicle.make",
  "vehicle.model",
  "vehicle.year",
  "vehicle.fuelType",
  "vehicle.rentAmount",
  "vehicle.registrationNumber",
  "vehicle.status",
  "vehicle.vendor.companyName",
  "vehicle.images.0.url",
];

function FleetVehicleRow({ vehicle: v, onView, onEdit, onDelete }) {
  const handleView = useCallback(() => onView(v._id), [onView, v._id]);
  const handleEdit = useCallback(() => onEdit(v), [onEdit, v]);
  const handleDelete = useCallback(() => onDelete(v._id), [onDelete, v._id]);

  return (
    <tr className={fleet.tableRow}>
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
            <p className="font-semibold text-zinc-900 truncate">{v.vehicleName}</p>
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
        <FleetRowMenu onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </td>
    </tr>
  );
}

export default withRowMemo(FleetVehicleRow, VEHICLE_ROW_FIELDS);
