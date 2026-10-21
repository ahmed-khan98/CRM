"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import EmployeeModal from "@/app/_Components/Modal/EmployeeModal";
import { useLazyGetHirePrefillQuery } from "@/app/_Services/recruitment/page";

/**
 * Create Employee / View Employee for an accepted offer.
 * Opens existing Add Employee modal with recruitment prefill.
 */
export default function CreateEmployeeFromOffer({
  offerId,
  joiningStatus,
  className = "",
  onHired,
}) {
  const [fetchPrefill, { isFetching }] = useLazyGetHirePrefillQuery();
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [hireMeta, setHireMeta] = useState(null);
  const [warning, setWarning] = useState(null);
  const [existing, setExisting] = useState(null);

  const start = async () => {
    if (!offerId) return;
    try {
      const res = await fetchPrefill(offerId).unwrap();
      const payload = res?.data;
      if (payload?.existingEmployee?._id) {
        setExisting(payload.existingEmployee);
        toast("Employee already linked — use View Employee");
        return;
      }
      if (payload?.duplicates?.email?._id || payload?.duplicates?.cnic?._id) {
        const dup = payload.duplicates.email || payload.duplicates.cnic;
        setExisting(dup);
        toast.error(
          `Duplicate ${payload.duplicates.email ? "email" : "CNIC"} — view existing employee`
        );
        return;
      }
      if (!payload?.joiningApproved && payload?.warning) {
        const ok = window.confirm(
          `${payload.warning}\n\nContinue to Create Employee?`
        );
        if (!ok) return;
      }
      setPrefill(payload.prefill || null);
      setHireMeta(payload.meta || null);
      setWarning(payload.warning || null);
      setExisting(null);
      setOpen(true);
    } catch (e) {
      toast.error(e?.data?.message || "Could not load hire prefill");
    }
  };

  if (existing?._id) {
    return (
      <Link
        href={`/dashboard/employee/${existing._id}`}
        className={`${fleet.secondaryBtn} ${className}`}
      >
        View Employee
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`${fleet.primaryBtn} ${className}`}
        disabled={isFetching}
        onClick={start}
        title={
          joiningStatus && joiningStatus !== "approved"
            ? "Joining not approved — you can still create with a warning"
            : "Create employee from offer"
        }
      >
        {isFetching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </>
        ) : (
          "Create Employee"
        )}
      </button>

      <EmployeeModal
        isOpen={open}
        closeModal={() => {
          setOpen(false);
          setPrefill(null);
          setHireMeta(null);
          setWarning(null);
        }}
        prefill={prefill}
        hireMeta={hireMeta}
        warning={warning}
        onCreated={(emp) => {
          if (emp?._id) setExisting(emp);
          if (typeof onHired === "function") onHired(emp);
        }}
      />
    </>
  );
}
