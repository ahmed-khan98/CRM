"use client";

import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Wallet, Plus, Eye, Download, Pencil, Unlock } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { StatCard } from "@/app/dashboard/employee/_components/hrmsUi";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { Avatar } from "@/app/_Components/attendence/TeamAttendance/Avatar";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import PayrollStatusBadge from "@/app/_Components/payroll/PayrollStatusBadge";
import PayslipDocument, {
  downloadPayslipPdf,
} from "@/app/_Components/payroll/PayslipDocument";
import {
  canManagePayroll,
  cycleLabel,
  money,
  monthOptions,
} from "@/app/_Components/payroll/payrollUi";
import {
  useAddPayrollDeductionMutation,
  useUpdatePayrollEntryAmountsMutation,
  useFinalizePayrollMutation,
  useGeneratePayrollMutation,
  useGetPayrollRunQuery,
  useGetPayrollSettingsQuery,
  useMarkPayrollPaidMutation,
  useUnlockPayrollMutation,
} from "@/app/_Services/payroll/page";
import { exportPayrollToExcel } from "@/app/utilities/exportPayrollToExcel";

const CALENDAR_DAYS = 30;

/** Infer 1-day pay used for attendance cuts (matches generate: full gross ÷ 30). */
function inferDailyRate(row, latesPerDay = 2) {
  const abs = Number(row.absentDays) || 0;
  const absAmt = Number(row.absentDeduction) || 0;
  if (abs > 0 && absAmt > 0) return absAmt / abs;

  const half = Number(row.halfDays) || 0;
  const halfAmt = Number(row.halfDayDeduction) || 0;
  if (half > 0 && halfAmt > 0) return halfAmt / (half * 0.5);

  const late = Number(row.lateDays) || 0;
  const lateAmt = Number(row.lateDeduction) || 0;
  const units = Math.floor(late / Math.max(1, latesPerDay));
  if (units > 0 && lateAmt > 0) return lateAmt / units;

  const gross = Number(row.grossPay) || 0;
  return gross > 0 ? gross / CALENDAR_DAYS : 0;
}

function amountsFromCounts({ lateDays, absentDays, halfDays, dailyRate, latesPerDay }) {
  const daily = Number(dailyRate) || 0;
  const per = Math.max(1, Number(latesPerDay) || 2);
  const late = Math.max(0, Math.floor(Number(lateDays) || 0));
  const absent = Math.max(0, Math.floor(Number(absentDays) || 0));
  const half = Math.max(0, Math.floor(Number(halfDays) || 0));
  return {
    lateDeduction: Math.round(Math.floor(late / per) * daily),
    absentDeduction: Math.round(absent * daily),
    halfDayDeduction: Math.round(half * 0.5 * daily),
  };
}

export default function RunPayrollPage() {
  let role = "";
  try {
    role = JSON.parse(Cookies.get("currentuser") || "{}")?.role || "";
  } catch {
    role = "";
  }
  const manage = canManagePayroll(role);
  const isAdmin = role === "ADMIN";
  const options = useMemo(() => monthOptions(), []);
  const [period, setPeriod] = useState(options[0]?.value || "");
  const selected = options.find((o) => o.value === period) || options[0];
  const [checked, setChecked] = useState([]);
  const [detail, setDetail] = useState(null);
  const [deductFor, setDeductFor] = useState(null);
  const [deductForm, setDeductForm] = useState({
    name: "",
    amount: "",
    basicSalary: "",
    netPay: "",
    incentive: "",
    incentiveName: "",
  });
  const [editFor, setEditFor] = useState(null);
  const [editForm, setEditForm] = useState({
    lateDays: "",
    absentDays: "",
    halfDays: "",
    lateDeduction: "",
    absentDeduction: "",
    halfDayDeduction: "",
    dailyRate: 0,
    extraDeductions: [],
  });
  const [confirmUnlock, setConfirmUnlock] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const { data, isFetching } = useGetPayrollRunQuery({
    month: selected?.month,
    year: selected?.year,
  });
  const { data: settingsData } = useGetPayrollSettingsQuery();
  const latesPerDay = Math.max(
    1,
    Number(settingsData?.data?.settings?.lateLatesPerDay) || 2
  );
  const [generate, { isLoading: generating }] = useGeneratePayrollMutation();
  const [finalize, { isLoading: finalizing }] = useFinalizePayrollMutation();
  const [markPaid, { isLoading: paying }] = useMarkPayrollPaidMutation();
  const [unlockPayroll, { isLoading: unlocking }] = useUnlockPayrollMutation();
  const [addDeduction, { isLoading: adding }] = useAddPayrollDeductionMutation();
  const [updateAmounts, { isLoading: savingAmounts }] = useUpdatePayrollEntryAmountsMutation();

  const run = data?.data?.run;
  const entries = data?.data?.entries || [];
  const stats = run?.totals || {};

  const departmentOptions = useMemo(() => {
    const names = [
      ...new Set(
        entries
          .map((e) => (e.departmentName || "").trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
    return [
      { value: "", label: "All departments" },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [entries]);

  const employeeOptions = useMemo(() => {
    const list = (
      filterDepartment
        ? entries.filter(
            (e) => (e.departmentName || "").trim() === filterDepartment
          )
        : entries
    )
      .slice()
      .sort((a, b) =>
        String(a.employeeName || "").localeCompare(String(b.employeeName || ""))
      );
    return [
      { value: "", label: "All employees" },
      ...list.map((e) => ({
        value: String(e._id),
        label: e.employeeName || "Employee",
      })),
    ];
  }, [entries, filterDepartment]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (filterDepartment && (e.departmentName || "").trim() !== filterDepartment) {
        return false;
      }
      if (filterEmployee && String(e._id) !== String(filterEmployee)) {
        return false;
      }
      return true;
    });
  }, [entries, filterDepartment, filterEmployee]);

  const displayStats = useMemo(() => {
    const filtered = Boolean(filterDepartment || filterEmployee);
    if (!filtered) {
      return {
        employees: stats.employees || 0,
        gross: stats.gross || 0,
        deductions: stats.deductions || 0,
        net: stats.net || 0,
      };
    }
    return {
      employees: filteredEntries.length,
      gross: filteredEntries.reduce((s, e) => s + Number(e.grossPay || 0), 0),
      deductions: filteredEntries.reduce(
        (s, e) => s + Number(e.deductionsTotal || 0),
        0
      ),
      net: filteredEntries.reduce((s, e) => s + Number(e.netPay || 0), 0),
    };
  }, [filterDepartment, filterEmployee, filteredEntries, stats]);

  const onDepartmentFilter = (value) => {
    setFilterDepartment(value || "");
    if (value && filterEmployee) {
      const stillVisible = entries.some(
        (e) =>
          String(e._id) === String(filterEmployee) &&
          (e.departmentName || "").trim() === value
      );
      if (!stillVisible) setFilterEmployee("");
    }
  };

  const toggle = (id) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onGenerate = async () => {
    try {
      await generate({ month: selected.month, year: selected.year }).unwrap();
      toast.success("Payroll generated");
      setChecked([]);
    } catch (err) {
      toast.error(err?.data?.message || "Generate failed");
    }
  };

  const onFinalize = async (ids) => {
    if (!run?._id) return;
    try {
      await finalize({ id: run._id, entryIds: ids }).unwrap();
      toast.success("Payroll finalized");
      setChecked([]);
    } catch (err) {
      toast.error(err?.data?.message || "Finalize failed");
    }
  };

  const onPay = async () => {
    if (!run?._id) return;
    try {
      await markPaid(run._id).unwrap();
      toast.success("Marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const onUnlock = async () => {
    if (!run?._id) return;
    if (run.status === "paid") {
      toast.error("Paid payroll cannot be unlocked");
      setConfirmUnlock(false);
      return;
    }
    try {
      await unlockPayroll(run._id).unwrap();
      toast.success("Payroll unlocked");
      setConfirmUnlock(false);
    } catch (err) {
      toast.error(err?.data?.message || "Unlock failed");
    }
  };

  const openEditAmounts = (row) => {
    setEditFor(row);
    setEditForm({
      lateDays: row.lateDays ?? 0,
      absentDays: row.absentDays ?? 0,
      halfDays: row.halfDays ?? 0,
      lateDeduction: row.lateDeduction ?? 0,
      absentDeduction: row.absentDeduction ?? 0,
      halfDayDeduction: row.halfDayDeduction ?? 0,
      dailyRate: inferDailyRate(row, latesPerDay),
      extraDeductions: (row.extraDeductions || []).map((d) => ({
        name: d.name || "",
        amount: d.amount ?? 0,
        note: d.note || "",
      })),
    });
  };

  const onCountChange = (field, raw) => {
    const nextCount = raw === "" ? "" : Math.max(0, Math.floor(Number(raw) || 0));
    setEditForm((s) => {
      const next = { ...s, [field]: nextCount };
      const calc = amountsFromCounts({
        lateDays: field === "lateDays" ? nextCount : next.lateDays,
        absentDays: field === "absentDays" ? nextCount : next.absentDays,
        halfDays: field === "halfDays" ? nextCount : next.halfDays,
        dailyRate: next.dailyRate,
        latesPerDay,
      });
      return { ...next, ...calc };
    });
  };

  const onSaveAmounts = async (e) => {
    e.preventDefault();
    try {
      await updateAmounts({
        id: editFor._id,
        body: {
          lateDays: Number(editForm.lateDays) || 0,
          absentDays: Number(editForm.absentDays) || 0,
          halfDays: Number(editForm.halfDays) || 0,
          lateDeduction: Number(editForm.lateDeduction) || 0,
          absentDeduction: Number(editForm.absentDeduction) || 0,
          halfDayDeduction: Number(editForm.halfDayDeduction) || 0,
          extraDeductions: editForm.extraDeductions,
        },
      }).unwrap();
      toast.success("Deduction amounts updated");
      setEditFor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Could not update amounts");
    }
  };

  const openAdjustModal = (row) => {
    setDeductFor(row);
    const basic = String(row.basicSalary ?? "");
    const net = String(row.netPay ?? "");
    const inc = String(row.incentive ?? 0);
    setDeductForm({
      name: "",
      amount: "",
      basicSalary: basic,
      netPay: net,
      incentive: inc,
      incentiveName: row.incentiveNote || "",
      _origBasicSalary: basic,
      _origNetPay: net,
      _origIncentive: inc,
      _origIncentiveName: row.incentiveNote || "",
    });
  };

  const onAddDeduction = async (e) => {
    e.preventDefault();
    const body = {};
    if (deductForm.name?.trim() && deductForm.amount !== "") {
      body.name = deductForm.name.trim();
      body.amount = Number(deductForm.amount) || 0;
    }
    const basicChanged =
      deductForm.basicSalary !== "" &&
      String(deductForm.basicSalary) !== String(deductForm._origBasicSalary);
    if (basicChanged) {
      body.basicSalary = Number(deductForm.basicSalary) || 0;
    }
    const incentiveChanged =
      String(deductForm.incentive) !== String(deductForm._origIncentive) ||
      String(deductForm.incentiveName || "") !==
        String(deductForm._origIncentiveName || "");
    if (incentiveChanged) {
      body.incentive = Number(deductForm.incentive) || 0;
      body.incentiveNote = (deductForm.incentiveName || "").trim();
    }
    // Only override net if user edited it (basic/incentive alone recalc net)
    if (
      deductForm.netPay !== "" &&
      String(deductForm.netPay) !== String(deductForm._origNetPay)
    ) {
      body.netPay = Number(deductForm.netPay) || 0;
    }
    if (
      !body.name &&
      body.basicSalary === undefined &&
      body.netPay === undefined &&
      body.incentive === undefined
    ) {
      return toast.error(
        "Change basic, net pay, incentive, or add a deduction",
      );
    }
    try {
      await addDeduction({ id: deductFor._id, body }).unwrap();
      toast.success(
        basicChanged
          ? "Basic updated — gross & deductions recalculated for this run"
          : "Payroll entry updated (this run only)",
      );
      setDeductFor(null);
      setDeductForm({
        name: "",
        amount: "",
        basicSalary: "",
        netPay: "",
        incentive: "",
        incentiveName: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Could not save");
    }
  };

  const locked = ["finalized", "paid"].includes(run?.status);

  const onExportAll = () => {
    try {
      exportPayrollToExcel(filteredEntries, "payroll");
      toast.success("Exported");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const actionBtn =
    "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition sm:w-auto sm:px-3 sm:text-sm";
  const primaryAction = `${actionBtn} border-zinc-800 bg-ink text-white hover:bg-zinc-800 disabled:opacity-50`;
  const secondaryAction = `${actionBtn} border-zinc-200 bg-white text-zinc-100 hover:bg-zinc-50 disabled:opacity-50`;

  const actionButtons = (
    <>
      {manage && (
        <>
          <button type="button" onClick={onGenerate} disabled={generating} className={primaryAction}>
            {generating ? "Generating…" : "Generate Payroll"}
          </button>
          <button
            type="button"
            disabled={!run || locked || finalizing}
            onClick={() => onFinalize([])}
            className={secondaryAction}
          >
            Finalize & Lock
          </button>
          <button
            type="button"
            disabled={run?.status !== "finalized" || paying}
            onClick={onPay}
            className={secondaryAction}
          >
            Mark as Paid
          </button>
          {isAdmin && run?.status === "finalized" ? (
            <button
              type="button"
              disabled={unlocking}
              onClick={() => setConfirmUnlock(true)}
              className={secondaryAction}
            >
              <Unlock className="h-3.5 w-3.5" />
              Unlock Payroll
            </button>
          ) : null}
        </>
      )}
      {filteredEntries.length > 0 && (
        <button type="button" className={secondaryAction} onClick={onExportAll}>
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      )}
    </>
  );

  return (
    <div className="pb-5  section-stack min-h-0 flex-1  md:overflow-hidden md:pb-5">
      <AttendenceHeader icon={Wallet} length={filteredEntries.length} name="Run Payroll">
        <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-2 md:flex">
          {run?.status ? <PayrollStatusBadge status={run.status} /> : null}
          <div className="w-56 lg:w-72">
            <CrmSelect
              options={options}
              value={period}
              onChange={(v) => {
                setPeriod(v);
                setFilterEmployee("");
                setFilterDepartment("");
              }}
            />
          </div>
          {actionButtons}
        </div>
      </AttendenceHeader>

      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex items-center gap-2">
          {run?.status ? <PayrollStatusBadge status={run.status} /> : null}
          <div className="min-w-0 flex-1">
            <CrmSelect
              options={options}
              value={period}
              onChange={(v) => {
                setPeriod(v);
                setFilterEmployee("");
                setFilterDepartment("");
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">{actionButtons}</div>
      </div>

      <p className="px-0.5 text-xs font-medium text-zinc-500">
        Attendance: {cycleLabel(selected?.month, selected?.year, run?.cycleEndDay || 25, run)}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:max-w-xl">
        <CrmSelect
          options={departmentOptions}
          value={filterDepartment}
          onChange={onDepartmentFilter}
          isSearchable
          isClearable
          placeholder="All departments"
        />
        <CrmSelect
          options={employeeOptions}
          value={filterEmployee}
          onChange={(v) => setFilterEmployee(v || "")}
          isSearchable
          isClearable
          placeholder="All employees"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={displayStats.employees}
          className="border-violet-500/40 bg-violet-950/70"
        />
        <StatCard
          label="Total Gross Payroll"
          value={money(displayStats.gross)}
          className="border-emerald-500/40 bg-emerald-950/70"
        />
        <StatCard
          label="Total Deductions"
          value={money(displayStats.deductions)}
          className="border-rose-500/40 bg-rose-950/70"
        />
        <StatCard
          label="Total Net Payable"
          value={money(displayStats.net)}
          className="border-sky-500/40 bg-sky-950/70"
        />
      </div>

      {checked.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
          <span className="text-xs font-medium text-zinc-500">{checked.length} selected</span>
          {manage && !locked && (
            <button type="button" className={secondaryAction} onClick={() => onFinalize(checked)}>
              Finalize Selected
            </button>
          )}
          <button
            type="button"
            className={secondaryAction}
            onClick={() => {
              try {
                exportPayrollToExcel(
                  entries.filter((e) => checked.includes(e._id)),
                  "payroll-selected"
                );
                toast.success("Exported");
              } catch (err) {
                toast.error(err.message);
              }
            }}
          >
            <Download className="h-3.5 w-3.5" /> Export Selected
          </button>
        </div>
      )}

      {/*
        crm-table-wrap clips for radius; horizontal scroll MUST stay on the inner
        div (bounded width via min-w-0/w-full). Table minWidth forces overflow so
        Gross / Net Pay / Status / Action are reachable by scrolling right.
      */}
      <div className="crm-table-wrap min-w-0 w-full max-w-full overflow-hidden md:flex md:min-h-0 md:flex-1 md:flex-col">
        <div
          className="w-full min-w-0 max-w-full overflow-x-scroll overflow-y-auto overscroll-x-contain md:min-h-0 md:flex-1"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "auto",
            scrollbarColor: "#a1a1aa #27272a",
          }}
        >
          <table
            className="crm-table border-collapse text-left"
            style={{ minWidth: "1600px", width: "100%" }}
          >
            <thead className="sticky top-0 z-20">
              <tr className="table-head-row">
                {[
                  "",
                  "Employee",
                  "Department",
                  "Basic",
                  "Allowances",
                  "Late",
                  "Absent",
                  "Half Day",
                  "Other",
                  "Gross",
                  "Incentive",
                  "Net Pay",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h || "check"}
                    className={`table-head-cell whitespace-nowrap px-3 ${
                      h === "Action"
                        ? "sticky right-0 z-30 bg-[#0a0a0a] md:border-l md:border-zinc-800"
                        : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={14} className="px-4 py-10 text-center text-sm text-zinc-400">
                    Loading payroll…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-10 text-center text-sm text-zinc-400">
                    No payroll generated for this month
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-10 text-center text-sm text-zinc-400">
                    No employees match these filters
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr key={row._id} className="group">
                    <td className="px-1 py-3">
                      <input
                        type="checkbox"
                        checked={checked.includes(row._id)}
                        onChange={() => toggle(row._id)}
                      />
                    </td>
                    <td className="px-1 py-3">
                      <div className="flex max-w-[180px] items-center gap-2">
                        <Avatar name={row.employeeName} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold capitalize text-zinc-100">
                            {row.employeeName}
                          </p>
                          <p className="truncate text-xs leading-snug text-zinc-400">
                            {row.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[11px] font-medium text-zinc-500">
                      {row.departmentName || "—"}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px] ">
                      {money(row.basicSalary)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px] ">
                      {money(row.allowancesTotal)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px]  text-rose-500">
                      {money(row.lateDeduction)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px]  text-rose-500">
                      {money(row.absentDeduction)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px]  text-rose-500">
                      {money(row.halfDayDeduction)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px]  text-zinc-500">
                      {money(
                        (row.tax || 0) +
                          (row.pf || 0) +
                          (row.extraDeductions || []).reduce(
                            (s, d) => s + Number(d.amount || 0),
                            0
                          )
                      )}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px] ">
                      {money(row.grossPay)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px] text-sky-400">
                      {money(row.incentive)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3 text-[10px]  text-emerald-500">
                      {money(row.netPay)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <PayrollStatusBadge status={row.status} />
                    </td>
                    <td className="sticky right-0 z-10 whitespace-nowrap bg-[#121212] px-1 py-3 group-hover:bg-zinc-800 md:border-l md:border-zinc-800">
                      <div className="flex gap-1">
                        <Tooltip label="View payslip">
                          <button
                            type="button"
                            className="crm-action-btn"
                            onClick={() => setDetail(row)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        {manage && !locked && (
                          <>
                            <Tooltip label="Edit deduction amounts">
                              <button
                                type="button"
                                className="crm-action-btn"
                                onClick={() => openEditAmounts(row)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip label="Deduction / gross / incentive">
                              <button
                                type="button"
                                className="crm-action-btn"
                                onClick={() => openAdjustModal(row)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveSlideOver
        open={Boolean(detail)}
        title="Payroll breakdown"
        subtitle={detail?.employeeName}
        onClose={() => setDetail(null)}
        width="max-w-2xl"
        footer={
          detail ? (
            <button
              type="button"
              className={`${fleet.primaryBtn} !px-3 !py-1.5 !text-xs`}
              onClick={() => downloadPayslipPdf(detail)}
            >
              Download PDF
            </button>
          ) : null
        }
      >
        {detail ? <PayslipDocument entry={detail} period={run || selected} /> : null}
      </LeaveSlideOver>

      <LeaveSlideOver
        open={Boolean(deductFor)}
        title="Adjust this payroll"
        subtitle={deductFor?.employeeName}
        onClose={() => setDeductFor(null)}
      >
        <form onSubmit={onAddDeduction} className="space-y-4">
          <p className="text-[11px] text-zinc-500">
            Changes apply only to this payroll run — employee profile salary is
            not updated.
          </p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-300">
              Basic salary (this run)
            </p>
            <input
              type="number"
              min="0"
              className={fleet.input}
              placeholder="Basic salary"
              value={deductForm.basicSalary}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, basicSalary: e.target.value }))
              }
            />
            <p className="text-[10px] text-zinc-500">
              Updates gross (basic + allowances) and recalculates late / absent /
              half-day (daily = gross ÷ 30). Profile salary stays unchanged.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-300">Net pay (this run)</p>
            <input
              type="number"
              min="0"
              className={fleet.input}
              placeholder="Net pay"
              value={deductForm.netPay}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, netPay: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-300">
              Incentive (added to net pay)
            </p>
            <input
              className={fleet.input}
              placeholder="Name (e.g. Performance, Project bonus…)"
              value={deductForm.incentiveName}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, incentiveName: e.target.value }))
              }
            />
            <input
              type="number"
              min="0"
              className={fleet.input}
              placeholder="Incentive amount"
              value={deductForm.incentive}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, incentive: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <p className="text-xs font-medium text-zinc-300">
              Extra deduction (optional)
            </p>
            <input
              className={fleet.input}
              placeholder="Name (Loan, Advance…)"
              value={deductForm.name}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, name: e.target.value }))
              }
            />
            <input
              type="number"
              min="0"
              className={fleet.input}
              placeholder="Amount"
              value={deductForm.amount}
              onChange={(e) =>
                setDeductForm((s) => ({ ...s, amount: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className={`${fleet.primaryBtn} w-full justify-center`}
          >
            Save
          </button>
        </form>
      </LeaveSlideOver>

      <LeaveSlideOver
        open={Boolean(editFor)}
        title="Edit deduction amounts"
        subtitle={editFor?.employeeName}
        onClose={() => setEditFor(null)}
      >
        {editFor && (
          <form onSubmit={onSaveAmounts} className="space-y-3">
            <p className="text-xs text-zinc-500">
              Change count to auto-update amount (daily ≈{" "}
              {money(Math.round(editForm.dailyRate || 0))}). Tax / PF stay separate. Late:
              every {latesPerDay} lates = 1 day pay cut.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Late count
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={fleet.input}
                  value={editForm.lateDays}
                  onChange={(e) => onCountChange("lateDays", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Late amount (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  className={fleet.input}
                  value={editForm.lateDeduction}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, lateDeduction: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Absent count
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={fleet.input}
                  value={editForm.absentDays}
                  onChange={(e) => onCountChange("absentDays", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Absent amount (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  className={fleet.input}
                  value={editForm.absentDeduction}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, absentDeduction: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Half-day count
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={fleet.input}
                  value={editForm.halfDays}
                  onChange={(e) => onCountChange("halfDays", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Half-day amount (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  className={fleet.input}
                  value={editForm.halfDayDeduction}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, halfDayDeduction: e.target.value }))
                  }
                />
              </div>
            </div>
            {editForm.extraDeductions.map((d, i) => (
              <div key={`${d.name}-${i}`}>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  {d.name || "Extra deduction"} (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  className={fleet.input}
                  value={d.amount}
                  onChange={(e) => {
                    const extraDeductions = [...editForm.extraDeductions];
                    extraDeductions[i] = { ...d, amount: Number(e.target.value) || 0 };
                    setEditForm((s) => ({ ...s, extraDeductions }));
                  }}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={savingAmounts}
              className={`${fleet.primaryBtn} w-full justify-center`}
            >
              Save amounts
            </button>
          </form>
        )}
      </LeaveSlideOver>

      {confirmUnlock ? (
        <WarningModal
          isDeleting={unlocking}
          setConfirmDelete={() => setConfirmUnlock(false)}
          handleDelete={onUnlock}
          icon="unlock"
          title="Unlock Payroll"
          description="Unlock this payroll? You can edit or regenerate after unlock. Paid payroll cannot be unlocked."
          confirmLabel={unlocking ? "Unlocking…" : "Yes, Unlock"}
        />
      ) : null}
    </div>
  );
}
