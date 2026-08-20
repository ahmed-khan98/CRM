"use client";

import { memo, useCallback, useMemo, useState } from "react";
import moment from "moment-timezone";
import { Gauge, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { fleet } from "./fleetTheme";
import SectionCard from "./SectionCard";
import { useAddVehicleMileageMutation } from "@/app/_Services/vehicle/page";

const INITIAL_FORM = {
  date: moment().format("YYYY-MM-DD"),
  mileage: "",
  notes: "",
};

/**
 * Self-contained: owns its own form state and mutation, so typing in the
 * "Add Entry" form only re-renders this section, not the whole vehicle
 * detail page (info card, media grid, maintenance section, etc.).
 */
function MileageHistorySection({ vehicleId, mileageHistory }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [addMileage, { isLoading: adding }] = useAddVehicleMileageMutation();

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

  const submitMileage = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await addMileage({
          id: vehicleId,
          body: {
            date: form.date,
            mileage: Number(form.mileage),
            notes: form.notes,
          },
        }).unwrap();
        toast.success("Mileage logged");
        setForm((f) => ({ ...f, mileage: "", notes: "" }));
        setShowForm(false);
      } catch (err) {
        toast.error(err?.data?.message || "Failed to log mileage");
      }
    },
    [addMileage, vehicleId, form.date, form.mileage, form.notes]
  );

  const action = useMemo(
    () => (
      <button type="button" onClick={toggleForm} className={fleet.primaryBtn}>
        <Plus className="w-3.5 h-3.5" /> Add Entry
      </button>
    ),
    [toggleForm]
  );

  return (
    <SectionCard icon={Gauge} title="Daily Mileage Log" action={action}>
      {showForm && (
        <form
          onSubmit={submitMileage}
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
            placeholder="Mileage"
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
          <button
            type="submit"
            disabled={adding}
            className={`${fleet.primaryBtn} sm:col-span-3 justify-center`}
          >
            {adding ? "Saving..." : "Save Mileage"}
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
  );
}

export default memo(MileageHistorySection);
