import React, { useEffect, useState } from "react";
import { Calendar, Save } from "lucide-react";
import moment from "moment";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

export default function AttendanceModal({ isOpen, onClose, selectedData, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    timeIn: "",
    timeOut: "",
    // status: "present",
    shiftDate: ""
  });

  // Jab modal khule, data populate karein
  useEffect(() => {
    if (selectedData) {
      setFormData({
        shiftDate: selectedData.record?.shiftDate || selectedData.date,
        timeIn: selectedData.record?.timeIn ? moment(selectedData.record.timeIn).format("HH:mm") : "",
        timeOut: selectedData.record?.timeOut ? moment(selectedData.record.timeOut).format("HH:mm") : "",
        // status: selectedData.record?.status || "present",
      });
    }
  }, [selectedData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      employeeId: selectedData.emp._id,
      attendanceId: selectedData.record?._id // Agar ye null hai toh naya banega
    });
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={selectedData.record ? "Update Attendance" : "Mark Attendance"}
      maxWidthClass="max-w-md"
    >
      <p className="text-zinc-400 text-xs -mt-2 capitalize">{selectedData.emp.fullName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shift Date (Read Only) */}
        <div className="space-y-1">
          <label className={fleet.modalLabel}>Shift Date</label>
          <div className="flex items-center gap-3 bg-[#161b22] border border-white/10 p-3 rounded-xl">
            <Calendar size={18} className="text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-200">
              {moment(formData.shiftDate).format("DD MMMM, YYYY (dddd)")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Time In */}
          <div>
            <label className={fleet.modalLabel}>Time In</label>
            <input
              type="time"
              required
              value={formData.timeIn}
              onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
              className={fleet.modalInput}
            />
          </div>

          {/* Time Out */}
          <div>
            <label className={fleet.modalLabel}>Time Out</label>
            <input
              type="time"
              value={formData.timeOut}
              onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
              className={fleet.modalInput}
            />
          </div>
        </div>

        {/* Status Selection */}
        {/* <div className="space-y-1">
          <label className={fleet.modalLabel}>Attendance Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={`${fleet.modalSelect} capitalize`}
          >
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half-day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div> */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className={fleet.modalCancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${fleet.modalPrimaryBtn} flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-zinc-950"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Save size={18} />
            )}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
