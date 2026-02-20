import React, { useEffect, useState } from "react";
import { X, Clock, Calendar, Save } from "lucide-react";
import moment from "moment";

export default function AttendanceModal({ isOpen, onClose, selectedData, onSave }) {
  console.log(selectedData,'selectedData')
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{selectedData.record?.status !== 'absent' ? "Update" : "Mark"} Attendance</h3>
            <p className="text-purple-100 text-xs mt-1 capitalize">{selectedData.emp.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Shift Date (Read Only) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Shift Date</label>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Calendar size={18} className="text-purple-500" />
              <span className="text-sm font-semibold text-gray-700">
                {moment(formData.shiftDate).format("DD MMMM, YYYY (dddd)")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Time In */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Time In</label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={formData.timeIn}
                  onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Time Out */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Time Out</label>
              <input
                type="time"
                value={formData.timeOut}
                onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Selection */}
          {/* <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Attendance Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all capitalize"
            >
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}