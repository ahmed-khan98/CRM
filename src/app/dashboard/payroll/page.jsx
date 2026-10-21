"use client";

import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Download, Eye, Mail, Wallet } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import { Avatar } from "@/app/_Components/attendence/TeamAttendance/Avatar";
import LeaveSlideOver from "@/app/_Components/leave/LeaveSlideOver";
import PayrollStatusBadge from "@/app/_Components/payroll/PayrollStatusBadge";
import PayslipDocument, {
  downloadPayslipPdf,
} from "@/app/_Components/payroll/PayslipDocument";
import { canManagePayroll, canViewPayrollRun, money, monthLabel, monthOptions } from "@/app/_Components/payroll/payrollUi";
import {
  useEmailPayslipsMutation,
  useGetMyPayslipsQuery,
  useGetTeamPayslipsQuery,
} from "@/app/_Services/payroll/page";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
import { exportPayrollToExcel } from "@/app/utilities/exportPayrollToExcel";

export default function PayslipsPage() {
  let role = "";
  try {
    role = JSON.parse(Cookies.get("currentuser") || "{}")?.role || "";
  } catch {
    role = "";
  }
  const isTeam = canViewPayrollRun(role);
  const manage = canManagePayroll(role);

  if (isTeam) return <TeamPayslips manage={manage} />;
  return <MyPayslips />;
}

function MyPayslips() {
  const { data, isFetching } = useGetMyPayslipsQuery();
  const rows = data?.data || [];
  const [detail, setDetail] = useState(null);

  return (
    <div className="pb-5 section-stack min-h-full ">
      <AttendenceHeader icon={Wallet} length={rows.length} name="My Payslips" />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="table-head-row">
              {["Period", "Gross", "Deductions", "Net Pay", "Status", "Action"].map((h) => (
                <th key={h} className="table-head-cell">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">No payslips yet</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id} className="border-b border-zinc-200">
                  <td className="px-4 py-3 text-sm font-medium">{monthLabel(row.payrollRunId?.month, row.payrollRunId?.year)}</td>
                  <td className="px-4 py-3 text-sm">{money(row.grossPay)}</td>
                  <td className="px-4 py-3 text-sm">{money(row.deductionsTotal)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{money(row.netPay)}</td>
                  <td className="px-4 py-3"><PayrollStatusBadge status={row.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Tooltip label="View payslip">
                        <button type="button" className="rounded-xl border p-1.5" onClick={() => setDetail(row)}>
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Tooltip>
                      <Tooltip label="Download PDF">
                        <button
                          type="button"
                          className="rounded-xl border p-1.5"
                          onClick={() => downloadPayslipPdf(row)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <LeaveSlideOver
        open={Boolean(detail)}
        title="Payslip"
        onClose={() => setDetail(null)}
        width="max-w-2xl"
        footer={
          <button
            type="button"
            className={`${fleet.primaryBtn} !px-3 !py-1.5 !text-xs`}
            onClick={() => downloadPayslipPdf(detail)}
          >
            Download PDF
          </button>
        }
      >
        {detail ? <PayslipDocument entry={detail} /> : null}
      </LeaveSlideOver>
    </div>
  );
}

function TeamPayslips({ manage }) {
  const options = useMemo(() => monthOptions(), []);
  const [period, setPeriod] = useState(options[0]?.value || "");
  const [employeeId, setEmployeeId] = useState("");
  const [detail, setDetail] = useState(null);
  const [emailingId, setEmailingId] = useState(null);
  const selected = options.find((o) => o.value === period) || options[0];
  const { data: employees } = useAllEmployeesQuery();
  const { data, isFetching } = useGetTeamPayslipsQuery({
    month: selected?.month,
    year: selected?.year,
    employeeId: employeeId || undefined,
  });
  const [emailPayslips, { isLoading: emailing }] = useEmailPayslipsMutation();
  const rows = data?.data || [];
  const employeeOptions = useMemo(
    () => [
      { value: "", label: "All Employees (Department)" },
      ...(employees?.data || []).map((e) => ({ value: e._id, label: e.fullName })),
    ],
    [employees]
  );

  const sendPayslipEmail = async (entryIds, label) => {
    const ids = (Array.isArray(entryIds) ? entryIds : [entryIds]).filter(Boolean);
    if (!ids.length) return;
    const singleId = ids.length === 1 ? ids[0] : "all";
    setEmailingId(singleId);
    try {
      const res = await emailPayslips(ids).unwrap();
      toast.success(
        res?.message ||
          (ids.length === 1
            ? `Payslip emailed${label ? ` to ${label}` : ""}`
            : "Payslips emailed")
      );
    } catch (err) {
      toast.error(err?.data?.message || "Email failed");
    } finally {
      setEmailingId(null);
    }
  };

  return (
    <div className="section-stack h-screen overflow-hidden">
      <AttendenceHeader icon={Wallet} length={rows.length} name="Payslips">
        <div className="flex flex-wrap items-center gap-2">
          {manage && (
            <>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium uppercase text-emerald-700"
                onClick={() => {
                  try {
                    exportPayrollToExcel(rows, "payslips");
                    toast.success("Exported");
                  } catch (err) {
                    toast.error(err.message);
                  }
                }}
              >
                <Download size={15} /> Export / Print All
              </button>
              <button
                type="button"
                disabled={emailing || !rows.length}
                className={fleet.secondaryBtn}
                onClick={() => sendPayslipEmail(rows.map((r) => r._id))}
              >
                <Mail className="h-4 w-4" /> Email All
              </button>
            </>
          )}
        </div>
      </AttendenceHeader>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-white p-2.5 md:flex-row md:items-end">
        <div className="w-full min-w-[220px] grow">
          <label className="type-label ml-1">Employee</label>
          <CrmSelect options={employeeOptions} value={employeeId} onChange={setEmployeeId} isSearchable isClearable />
        </div>
        <div className="w-full md:w-48 md:shrink-0">
          <label className="type-label ml-1">Period</label>
          <CrmSelect options={options} value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="h-full overflow-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="sticky top-0">
              <tr className="table-head-row">
                {["Employee", "Department", "Gross", "Net Pay", "Status", "Action"].map((h) => (
                  <th key={h} className="table-head-cell">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">No finalized payslips</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="border-b border-zinc-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={row.employeeName} />
                        <span className="text-sm font-semibold capitalize text-zinc-900">{row.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{row.departmentName || "—"}</td>
                    <td className="px-4 py-3 text-xs font-medium">{money(row.grossPay)}</td>
                    <td className="px-4 py-3 text-xs font-medium">{money(row.netPay)}</td>
                    <td className="px-4 py-3"><PayrollStatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Tooltip label="View payslip">
                          <button type="button" className="rounded-xl border border-zinc-200 p-1.5" onClick={() => setDetail(row)}>
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        <Tooltip label="Download PDF">
                          <button
                            type="button"
                            className="rounded-xl border border-zinc-200 p-1.5"
                            onClick={() => downloadPayslipPdf(row)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        {manage ? (
                          <Tooltip
                            label={
                              row.email
                                ? `Email to ${row.employeeName}`
                                : "No email on file"
                            }
                          >
                            <button
                              type="button"
                              className="rounded-xl border border-zinc-200 p-1.5 disabled:opacity-40"
                              disabled={
                                emailing ||
                                !row.email ||
                                emailingId === row._id
                              }
                              onClick={() =>
                                sendPayslipEmail(row._id, row.employeeName)
                              }
                            >
                              <Mail
                                className={`h-3.5 w-3.5 ${
                                  emailingId === row._id ? "animate-pulse" : ""
                                }`}
                              />
                            </button>
                          </Tooltip>
                        ) : null}
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
        title="Payslip"
        onClose={() => setDetail(null)}
        width="max-w-2xl"
        footer={
          <div className="flex flex-wrap items-center gap-2">
            {manage ? (
              <button
                type="button"
                className={`${fleet.secondaryBtn} !px-3 !py-1.5 !text-xs`}
                disabled={
                  emailing || !detail?.email || emailingId === detail?._id
                }
                onClick={() =>
                  sendPayslipEmail(detail._id, detail.employeeName)
                }
              >
                <Mail className="h-3.5 w-3.5" />
                {emailingId === detail?._id ? "Sending…" : "Email"}
              </button>
            ) : null}
            <button
              type="button"
              className={`${fleet.primaryBtn} !px-3 !py-1.5 !text-xs`}
              onClick={() => downloadPayslipPdf(detail)}
            >
              Download PDF
            </button>
          </div>
        }
      >
        {detail ? <PayslipDocument entry={detail} period={selected} /> : null}
      </LeaveSlideOver>
    </div>
  );
}
