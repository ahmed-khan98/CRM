"use client";

import { useMemo, useState } from "react";
import Select from "react-select";
import {
  Users,
  UserCheck,
  UserX,
  BedDouble,
  XCircle,
  AlertCircle,
  Edit3,
} from "lucide-react";
import {
  useGetDepartEmployeeAttendanceQuery,
  useUpdateTeamAttendenceMutation,
} from "@/app/_Services/attendence/page";
import moment from "moment-timezone";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
import {
  calculateDuration,
  formatTimeOnly,
  getStatusClasses,
  onlyWorkingHours,
  Tooltip,
} from "@/app/utilities/attendence";
import AttendanceModal from "@/app/_Components/Modal/AttendanceModal";
import toast from "react-hot-toast";

export default function TeamAttendence() {
  const [viewType, setViewType] = useState("today");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, data: null });

  const queryParams = useMemo(() => {
    const params = {
      employeeId: selectedEmployee || undefined,
    };
    const now = moment().tz("Asia/Karachi");

    if (viewType === "today") {
      const shiftDate =
        now.hour() < 8
          ? now.subtract(1, "days").format("YYYY-MM-DD")
          : now.format("YYYY-MM-DD");
      params.startDate = shiftDate;
      params.endDate = shiftDate;
    } else if (viewType === "month") {
      params.month = now.format("MM");
      params.year = now.format("YYYY");
    } else if (viewType === "custom" && customRange.start) {
      params.startDate = customRange.start;
      params.endDate = customRange.end || customRange.start;
    }
    return params;
  }, [viewType, selectedEmployee, customRange]);

  const [updateTeamAttendence, { isLoading }] =
    useUpdateTeamAttendenceMutation();
  const { data: employees, isFetching } = useAllEmployeesQuery();

  const { data: attendanceData, refetch } =
    useGetDepartEmployeeAttendanceQuery(queryParams);

  const employeeOptions = useMemo(() => {
    const options =
      employees?.data?.map((emp) => ({
        value: emp._id,
        label: emp.fullName,
        designation: emp.designation, // Extra info for UI
      })) || [];

    return [{ value: "", label: "All Employees (Department)" }, ...options];
  }, [employees]);

  const customSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    }),
    control: (base, state) => ({
      ...base,
      background: "#f9fafb", // gray-50
      borderColor: state.isFocused ? "#a855f7" : "#f3f4f6",
      borderRadius: "0.75rem", // rounded-xl
      padding: "1px",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "none",
      "&:hover": { borderColor: "#a855f7" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#a855f7"
        : state.isFocused
          ? "#f3e8ff"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "12px",
      padding: "8px 12px",
      cursor: "pointer",
    }),
  };

  const handleClearFilters = () => {
    setViewType("today");
    setCustomRange({ start: "", end: "" });
    setSelectedEmployee("");
  };

  //   const finalDisplayData = useMemo(() => {
  //     const apiRecords = attendanceData?.data?.data || [];

  //     if (!selectedEmployee || viewType === "today") return apiRecords;

  //     const start =
  //       queryParams.startDate || moment().startOf("month").format("YYYY-MM-DD");
  //     const end =
  //       queryParams.endDate || moment().endOf("month").format("YYYY-MM-DD");

  //     const fullList = [];
  //     let current = moment(start);
  //     const last = moment(end);

  //     const empDetails = apiRecords[0]?.employeeId || {
  //       fullName: employeeOptions.find((o) => o.value === selectedEmployee)
  //         ?.label,
  //       designation: "Employee",
  //     };

  //     while (current <= last) {
  //       const dateStr = current.format("YYYY-MM-DD");
  //       const dayOfWeek = current.day(); // 0 = Sunday, 6 = Saturday
  //       const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Dono weekends hain

  //       const existingRecord = apiRecords.find(
  //         (r) => r.record?.shiftDate === dateStr,
  //       );

  //       if (existingRecord) {
  //         fullList.push({ ...existingRecord, isWeekend });
  //       } else {
  //         fullList.push({
  //           employeeId: empDetails,
  //           record: {
  //             shiftDate: dateStr,
  //             status: isWeekend ? "weekend" : "absent",
  //           },
  //           isAbsent: !isWeekend,
  //           isWeekend: isWeekend,
  //         });
  //       }
  //       current.add(1, "days");
  //     }

  //     return fullList.sort((a, b) =>
  //       moment(b.record.shiftDate).diff(moment(a.record.shiftDate)),
  //     );
  //   }, [attendanceData, selectedEmployee, viewType, queryParams]);

  const finalDisplayData = useMemo(() => {
    const apiRecords = attendanceData?.data?.data || [];

    if (!selectedEmployee || viewType === "today") return apiRecords;

    const start =
      queryParams.startDate || moment().startOf("month").format("YYYY-MM-DD");

    // --- FIX STARTS HERE ---
    const today = moment().startOf("day");
    const monthEnd = moment().endOf("month");

    // Agar queryParams mein endDate hai toh wo lo, warna mahine ka aakhir
    let endLimit = queryParams.endDate ? moment(queryParams.endDate) : monthEnd;

    // Agar endLimit aaj se aage ki hai, toh usey aaj (Today) par rok do
    if (endLimit.isAfter(today)) {
      endLimit = today;
    }
    // --- FIX ENDS HERE ---

    const fullList = [];
    let current = moment(start);
    const last = endLimit; // Ab ye 'last' kabhi aaj se aage nahi jayega

    const empDetails = apiRecords[0]?.employeeId || {
      fullName: employeeOptions.find((o) => o.value === selectedEmployee)
        ?.label,
      designation: "Employee",
    };

    while (current <= last) {
      const dateStr = current.format("YYYY-MM-DD");
      const dayOfWeek = current.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const existingRecord = apiRecords.find(
        (r) => r.record?.shiftDate === dateStr,
      );

      if (existingRecord) {
        fullList.push({ ...existingRecord, isWeekend });
      } else {
        fullList.push({
          employeeId: empDetails,
          record: {
            shiftDate: dateStr,
            status: isWeekend ? "weekend" : "absent",
          },
          isAbsent: !isWeekend,
          isWeekend: isWeekend,
        });
      }
      current.add(1, "days");
    }

    return fullList.sort((a, b) =>
      moment(b.record.shiftDate).diff(moment(a.record.shiftDate)),
    );
  }, [attendanceData, selectedEmployee, viewType, queryParams]);

  const stats = useMemo(() => {
    const total = finalDisplayData?.length || 0;
    const present =
      finalDisplayData?.filter((r) => !r.isAbsent && !r.isWeekend).length || 0;
    const weekend = finalDisplayData?.filter((r) => r.isWeekend).length || 0;
    return { total, present, absent: total - present - weekend, weekend };
  }, [attendanceData]);

  // 2. Handler function
  const handleOpenModal = (emp, record, date) => {
    console.log(emp, record, date, "modal data");
    setModalConfig({
      isOpen: true,
      data: { emp, record, date: record?.shiftDate || date },
    });
  };

  const handleSaveAttendance = async (data) => {
    console.log("Saving to Backend:", data);
    try {
      const res = await updateTeamAttendence(data).unwrap();
      if (res.success) {
        refetch();
        setModalConfig({ isOpen: false, data: null });
        toast.success(
          `Attendance ${data?.record ? "updated" : "marked"} successfully`,
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50/50 p-0 overflow-hidden">
      <div
        className={`grid ${viewType === "today" ? "grid-cols-3" : "grid-cols-4"} gap-2 md:gap-4 mb-4 shrink-0`}
      >
        <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              Total Records
            </span>
            <Users className="text-purple-500" size={18} />
          </div>
          <p className="text-2xl font-black text-gray-800">{stats.total}</p>
        </div>

        {/* Present Today Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              Present Today
            </span>
            <UserCheck className="text-green-500" size={18} />
          </div>
          <p className="text-2xl font-black text-gray-800">{stats.present}</p>
        </div>

        {/* Absent Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              Absent
            </span>
            <UserX className="text-red-500" size={18} />
          </div>
          <p className="text-2xl font-black text-gray-800">{stats.absent}</p>
        </div>
        {viewType !== "today" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-gray-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                Weekend
              </span>
              <BedDouble className="text-gray-500" size={18} />
            </div>
            <p className="text-2xl font-black text-gray-800">{stats.weekend}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 flex flex-wrap items-end gap-3 shrink-0">
        <div className="flex flex-col gap-1 w-full sm:w-auto grow sm:grow-0">
          <label className="text-[10px] font-bold text-purple-600 uppercase ml-1">
            Search Employee
          </label>
          <Select
            options={employeeOptions}
            styles={customSelectStyles}
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            placeholder="Type to search..."
            value={employeeOptions.find(
              (opt) => opt.value === selectedEmployee,
            )}
            onChange={(selected) => setSelectedEmployee(selected?.value || "")}
            className="min-w-[250px] w-full"
            isSearchable={true}
            isClearable={true}
          />
        </div>

        {/* 2. Time Period Buttons */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-purple-600 uppercase ml-1">
            Time Period
          </label>
          <div className="flex bg-gray-100 p-1 rounded-xl h-[38px] items-center">
            {["today", "month", "custom"].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`cursor-pointer px-4 py-1.5 h-full text-[10px] font-bold rounded-lg capitalize transition-all ${
                  viewType === type
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-gray-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Custom Range Inputs (Only shows if 'custom' selected) */}
        {viewType === "custom" && (
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-purple-600 uppercase ml-1">
              Select Range
            </label>
            <div className="flex items-center gap-2 h-[38px]">
              <input
                type="date"
                className="cursor-pointer bg-gray-50 p-2 h-full rounded-xl text-xs border border-gray-100 outline-none w-full sm:w-auto"
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                className="cursor-pointer bg-gray-50 p-2 h-full rounded-xl text-xs border border-gray-100 outline-none w-full sm:w-auto"
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* 4. Clear Filters Button */}
        {(viewType !== "today" || customRange.start || selectedEmployee) && (
          <div className="h-[38px] flex items-center">
            <button
              onClick={handleClearFilters}
              title="Clear Filters"
              className="cursor-pointer p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 group"
            >
              <XCircle size={22} />
              <span className="text-[10px] font-bold hidden sm:group-hover:block transition-all">
                CLEAR
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 3. ATTENDANCE TABLE - STICKY & SCROLLABLE */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto w-full">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100">
                  Employee Name
                </th>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100">
                  Shift Date
                </th>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100">
                  In / Out
                </th>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100">
                  Work Hours
                </th>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100 text-center">
                  Status
                </th>
                <th className="sticky top-0 p-4 text-[10px] font-bold text-gray-500 uppercase bg-gray-100 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {isFetching ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-purple-600 animate-pulse font-bold"
                  >
                    Syncing Records...
                  </td>
                </tr>
              ) : finalDisplayData.length > 0 ? (
                finalDisplayData.map((item) => {
                  const emp = item?.employeeId;
                  const record = item?.record;
                  const isAbsent = item?.isAbsent;
                  const isWeekend = record?.status === "weekend"; // Weekend check

                  // --- SMART SHIFT-AWARE LOGIC ---
                  const now = moment().tz("Asia/Karachi");

                  // Agar raat ke 12 se subah 5 ke darmiyan hai, toh shift abhi bhi pichle din ki hai
                  const shiftEffectiveDate =
                    now.hour() < 5
                      ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
                      : now.format("YYYY-MM-DD");

                  const recordDateStr = moment(record?.shiftDate).format(
                    "YYYY-MM-DD",
                  );

                  // Ab 'isToday' calendar par nahi, shift timing par depend karega
                  const isToday = recordDateStr === shiftEffectiveDate;

                  const timeInMoment = record?.timeIn
                    ? moment(record.timeIn).tz("Asia/Karachi")
                    : null;
                  const hoursSinceIn = timeInMoment
                    ? now.diff(timeInMoment, "hours", true)
                    : 0;

                  // DISCREPANCY tab jab:
                  // 1. TimeOut missing ho
                  // 2. AUR (Ya toh 20 ghante guzar gaye hon YAA record ki date shiftEffectiveDate se purani ho)
                  const isDiscrepancy =
                    record?.timeIn &&
                    !record?.timeOut &&
                    (hoursSinceIn > 20 ||
                      moment(recordDateStr).isBefore(shiftEffectiveDate));

                  // ACTIVE tab jab:
                  // Record aaj ki shift ka ho aur discrepancy na ho
                  const isActive =
                    record?.timeIn &&
                    !record?.timeOut &&
                    isToday &&
                    !isDiscrepancy;

                  const uniqueRowKey =
                    record?._id ||
                    `${emp?._id}-${record?.shiftDate || queryParams?.startDate}`;

                  return (
                    <tr
                      key={uniqueRowKey}
                      className={`hover:bg-purple-50/20 transition-colors border-b border-gray-50 group ${
                        isWeekend
                          ? "bg-gray-50/50"
                          : isAbsent
                            ? "bg-red-50/10"
                            : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="capitalize w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                            {emp?.fullName?.charAt(0) || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700 capitalize">
                              {emp?.fullName || "Unknown"}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium capitalize">
                              {emp?.designation}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-600">
                            {moment(
                              record?.shiftDate || queryParams?.startDate,
                            ).format("DD MMM, YYYY")}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {moment(
                              record?.shiftDate || queryParams?.startDate,
                            ).format("dddd")}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {isWeekend ? (
                          <span className="text-gray-300 font-bold text-[11px]">
                            -- : --
                          </span>
                        ) : isAbsent ? (
                          <span className="text-red-400 font-bold text-[11px] bg-red-50 px-2 py-1 rounded">
                            ABSENT
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px] font-bold">
                              {formatTimeOnly(record?.timeIn)}
                            </span>
                            <span className="text-gray-300">→</span>
                            {record?.timeOut ? (
                              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
                                {formatTimeOnly(record.timeOut)}
                              </span>
                            ) : isDiscrepancy ? (
                              <Tooltip text="Missing Time-Out! Contact Manager.">
                                <span className="text-red-400 font-bold flex items-center gap-1 cursor-help uppercase text-[9px] tracking-tight underline decoration-dotted">
                                  DISCREPANCY <AlertCircle size={12} />
                                </span>
                              </Tooltip>
                            ) : isActive ? (
                              <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[9px] font-black animate-pulse border border-purple-100">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-gray-300 text-[11px]">
                                --:--
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {isWeekend || isAbsent ? (
                          <span className="text-gray-300 text-[10px]">
                            -- : --
                          </span>
                        ) : (
                         <div className="flex flex-col gap-1">
  {/* 1. Total Time (TimeIn se TimeOut tak) */}
  <div className="flex items-center justify-between min-w-[120px]">
    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
      Total:
    </span>
    <span className="text-[10px] font-bold text-gray-700">
      {calculateDuration(record?.timeIn, record?.timeOut)}
    </span>
  </div>

  {/* 2. Working Time (Total Time - Break Time) */}
  <div className="flex items-center justify-between">
    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
      Working:
    </span>
    <span className="text-[10px] font-bold text-blue-600">
      {onlyWorkingHours(record?.timeIn, record?.timeOut, record?.totalBreakMinutes  )}
    </span>
  </div>

  {/* 3. Break Time */}
  <div className="flex items-center justify-between">
    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
      Break:
    </span>
    <span className="text-[10px] font-bold text-yellow-600">
      {record?.totalBreakMinutes >= 0 ? `${record.totalBreakMinutes}min` : "0min"}
    </span>
  </div>
</div>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {isWeekend ? (
                          <span className="inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200 bg-gray-50 text-gray-400">
                            WEEKEND
                          </span>
                        ) : (
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusClasses(record?.status || "absent")}`}
                          >
                            {record?.status || "absent"}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isWeekend ? (
                          <span className="inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200 bg-gray-50 text-gray-400">
                            WEEKEND
                          </span>
                        ) : isAbsent ? (
                          <button
                            onClick={() =>
                              handleOpenModal(
                                emp,
                                record,
                                queryParams?.startDate,
                              )
                            }
                            className="cursor-pointer text-[10px] font-black text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-200 px-3 py-1.5 rounded-xl transition-all"
                          >
                            MARK PRESENT
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleOpenModal(emp, record, record.shiftDate)
                            }
                            className="cursor-pointer text-gray-400 hover:text-purple-600 transition-colors p-1"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-50 p-4 rounded-full">
                        <svg
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-bold text-md">
                        No Attendance Records Found
                      </p>
                      <p className="text-gray-400 text-[12px]">
                        Try changing the date or employee filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AttendanceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, data: null })}
        selectedData={modalConfig.data}
        onSave={handleSaveAttendance}
        isSubmitting={isLoading}
      />
    </div>
  );
}
