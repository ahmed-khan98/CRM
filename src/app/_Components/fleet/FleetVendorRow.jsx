"use client";

import { useCallback } from "react";
import FleetRowMenu from "./FleetRowMenu";
import { fleet, fleetStatusClass } from "./fleetTheme";
import { withRowMemo } from "@/app/_utils/withRowMemo";

const VENDOR_ROW_FIELDS = [
  "vendor._id",
  "vendor.companyName",
  "vendor.vendorName",
  "vendor.email",
  "vendor.phone",
  "vendor.city",
  "vendor.status",
];

function FleetVendorRow({ vendor: v, onView, onEdit, onDelete }) {
  const handleView = useCallback(() => onView(v._id), [onView, v._id]);
  const handleEdit = useCallback(() => onEdit(v), [onEdit, v]);
  const handleDelete = useCallback(() => onDelete(v._id), [onDelete, v._id]);

  return (
    <tr className={fleet.tableRow}>
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
        <FleetRowMenu onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </td>
    </tr>
  );
}

export default withRowMemo(FleetVendorRow, VENDOR_ROW_FIELDS);
