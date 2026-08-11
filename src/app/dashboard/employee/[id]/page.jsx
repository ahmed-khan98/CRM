"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Briefcase,
  Wallet,
  FileText,
  Users,
  Building2,
  History,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { useGetEmployeeByIdQuery } from "@/app/_Services/employee/hrms";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import BasicInfoTab, { EmploymentTab } from "../_components/BasicInfoTab";
import CompensationTab from "../_components/CompensationTab";
import DocumentsTab from "../_components/DocumentsTab";
import FamilyTab from "../_components/FamilyTab";
import PreviousEmploymentTab from "../_components/PreviousEmploymentTab";
import HistoryTab from "../_components/HistoryTab";
import {
  formatMoney,
  formatDate,
  StatusBadge,
} from "../_components/hrmsUi";
import { fleet } from "@/app/_Components/fleet/fleetTheme";

const TABS = [
  { id: "basic", label: "Personal", icon: User },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "compensation", label: "Salary", icon: Wallet },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "family", label: "Family", icon: Users },
  { id: "previous", label: "Previous Jobs", icon: Building2 },
  { id: "history", label: "History", icon: History },
];

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className={`${fleet.card} px-4 py-3.5 flex items-start gap-3 min-w-0`}>
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-900 truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, refetch, isFetching } =
    useGetEmployeeByIdQuery(id, { skip: !id });
  const [tab, setTab] = useState("compensation");

  const employee = data?.data;

  const content = useMemo(() => {
    if (!employee) return null;
    switch (tab) {
      case "basic":
        return <BasicInfoTab employee={employee} />;
      case "employment":
        return <EmploymentTab employee={employee} />;
      case "compensation":
        return (
          <CompensationTab
            employeeId={id}
            employee={employee}
            onSaved={() => refetch()}
          />
        );
      case "documents":
        return <DocumentsTab employeeId={id} />;
      case "family":
        return <FamilyTab employeeId={id} />;
      case "previous":
        return <PreviousEmploymentTab employeeId={id} />;
      case "history":
        return <HistoryTab employeeId={id} />;
      default:
        return null;
    }
  }, [tab, employee, id, refetch]);

  if (isLoading) {
    return (
      <PageLoader
        title="Loading employee"
        subtitle="Fetching HRMS profile..."
      />
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <p className="text-sm font-semibold text-zinc-700">Employee not found</p>
        <Link href="/dashboard/employee" className={fleet.secondaryBtn}>
          Back to employees
        </Link>
      </div>
    );
  }

  const subtitle = [
    employee.designation,
    employee.departmentId?.name,
    employee.employmentType,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={fleet.page}>
      {/* Header with circular avatar — modern HRMS */}
      <div className={`${fleet.card} p-4 sm:p-5 mb-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => router.push("/dashboard/employee")}
              className="mt-2 p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-100 shadow-sm bg-zinc-100">
              <Image
                src={employee.image || "/dummy.png"}
                alt={employee.fullName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight capitalize truncate">
                  {employee.fullName}
                </h1>
                <StatusBadge
                  active={employee.status === "active"}
                  label={employee.status || "—"}
                />
                {employee.role && (
                  <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                    {employee.role}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500 truncate">
                {subtitle || "Employee profile"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className={`${fleet.secondaryBtn} self-start sm:self-center`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <QuickStat
          icon={Mail}
          label="Email"
          value={employee.email}
        />
        <QuickStat
          icon={Phone}
          label="Phone"
          value={employee.phoneNo}
        />
        <QuickStat
          icon={CalendarDays}
          label="Joined"
          value={formatDate(employee.joiningDate)}
        />
        <QuickStat
          icon={Wallet}
          label="Basic Salary"
          value={formatMoney(employee.currentSalary)}
        />
      </div>

      {/* Tabs */}
      <div className={`${fleet.card} p-1.5 mb-4 overflow-x-auto`}>
        <div className="flex gap-1 min-w-max">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-width content */}
      <div className="min-w-0">{content}</div>
    </div>
  );
}
