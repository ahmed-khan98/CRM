"use client";

import { memo, useCallback, useMemo, useState } from "react";
import moment from "moment-timezone";
import { Plus, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import { fleet } from "./fleetTheme";
import SectionCard from "./SectionCard";
import { useAddVehicleMaintenanceMutation } from "@/app/_Services/vehicle/page";

const INITIAL_FORM = {
  date: moment().format("YYYY-MM-DD"),
  mileage: "",
  notes: "",
  setStatus: true,
};

/**
 * Self-contained: owns its own form state and mutation, so typing in the
 * "Log Maintenance" form only re-renders this section, not the whole
 * vehicle detail page (info card, media grid, mileage section, etc.).
 */
function MaintenanceHistorySection({ vehicleId, maintenanceHistory }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [addMaintenance, { isLoading: adding }] = useAddVehicleMaintenanceMutation();

  const toggleForm = useCallback(() => setShowForm((v) => !v), []);
  const onDateChange = useCallback(
    (e) => setForm((f) => ({ ...f, date: e.target.value })),
    []
  );
  const onMileageChange = useCallback(
    (e) => setForm((f) => ({ ...f, mileage: e.target.value })),
    []
  );
  const onNotesChange = useCallback(
    (e) => setForm((f) => ({ ...f, notes: e.target.value })),
    []
  );
  const onSetStatusChange = useCallback(
    (e) => setForm((f) => ({ ...f, setStatus: e.target.checked })),
    []
  );

  const submitMaintenance = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await addMaintenance({
          id: vehicleId,
          body: {
            date: form.date,
            mileage: Number(form.mileage),
            notes: form.notes,
            setStatus: form.setStatus,
          },
        }).unwrap();
        toast.success("Maintenance logged");
        setForm((f) => ({ ...f, mileage: "", notes: "" }));
        setShowForm(false);
      } catch (err) {
        toast.error(err?.data?.message || "Failed to log maintenance");
      }
    },
    [addMaintenance, vehicleId, form.date, form.mileage, form.notes, form.setStatus]
  );

  const action = useMemo(
    () => (
      <button type="button" onClick={toggleForm} className={fleet.primaryBtn}>
        <Plus className="w-3.5 h-3.5" /> Log Maintenance
      </button>
    ),
    [toggleForm]
  );

  return (
    <SectionCard icon={Wrench} title="Maintenance History" action={action}>
      {showForm && (
        <form
          onSubmit={submitMaintenance}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
        >
          <input
            type="date"
            required
            value={form.date}
            onChange={onDateChange}
            className={fleet.input}
          />
          <input
            type="number"
            required
            min={0}
            placeholder="Mileage at service"
            value={form.mileage}
            onChange={onMileageChange}
            className={fleet.input}
          />
          <input
            type="text"
            placeholder="Notes"
            value={form.notes}
            onChange={onNotesChange}
            className={fleet.input}
          />
          <label className="sm:col-span-3 flex items-center gap-2 text-xs text-zinc-600">
            <input type="checkbox" checked={form.setStatus} onChange={onSetStatusChange} />
            Set status to Maintenance
          </label>
          <button
            type="submit"
            disabled={adding}
            className={`${fleet.primaryBtn} sm:col-span-3 justify-center`}
          >
            {adding ? "Saving..." : "Save Maintenance"}
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
  );
}

export default memo(MaintenanceHistorySection);
