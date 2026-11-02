"use client";

import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Mail, Plus, Settings2, Users } from "lucide-react";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import MailboxAddModal from "@/app/_Components/mailbox/MailboxAddModal";
import MailboxAssignPanel from "@/app/_Components/mailbox/MailboxAssignPanel";
import MailboxByUserPanel from "@/app/_Components/mailbox/MailboxByUserPanel";
import MailboxServerSettingsModal from "@/app/_Components/mailbox/MailboxServerSettingsModal";
import {
  useGetMailboxDepartmentsQuery,
  useGetMailboxMappingQuery,
} from "@/app/_Services/mailbox/page";
import { effectiveRole } from "@/app/config/permissions";

export default function MailboxMappingPage() {
  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const role = effectiveRole(user) || user?.role;
  const isAdmin = role === "ADMIN";
  const canFilterDept = role === "ADMIN" || role === "SUBADMIN";

  const { data, isLoading, isError, error, refetch } =
    useGetMailboxMappingQuery();
  const { data: deptData } = useGetMailboxDepartmentsQuery();

  const [view, setView] = useState("mailboxes");
  const [showSettings, setShowSettings] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editMailbox, setEditMailbox] = useState(null);
  const [assignMailbox, setAssignMailbox] = useState(null);

  const grouped = data?.data?.grouped || [];
  const mismatches = data?.data?.brandEmailDeptMismatches || [];
  const departments = deptData?.data || [];

  const flatCount = useMemo(
    () =>
      grouped.reduce(
        (n, d) =>
          n +
          d.brands.reduce((bn, b) => bn + (b.mailboxes?.length || 0), 0),
        0,
      ),
    [grouped],
  );

  if (isLoading) {
    return (
      <PageLoader
        title="Loading Email Mapping"
        subtitle="Fetching mailboxes in your scope…"
      />
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Mail}
          title="Cannot open Email Mapping"
          description={
            error?.data?.message ||
            "You may not have access, or the mailbox API is unavailable."
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-1 mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-3">
        <div className="flex flex-col gap-2 pb-2 justify-between items-start md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-zinc-200" />
            <div>
              <h3 className="text-zinc-100 text-xl font-medium">Email Mapping</h3>
              <p className="text-xs text-zinc-500">
                {flatCount} mailbox{flatCount === 1 ? "" : "es"} in scope
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex rounded-xl border border-zinc-700 overflow-hidden text-xs">
              <button
                type="button"
                className={`px-3 py-2 ${
                  view === "mailboxes"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400"
                }`}
                onClick={() => setView("mailboxes")}
              >
                By mailbox
              </button>
              <button
                type="button"
                className={`px-3 py-2 ${
                  view === "user" ? "bg-zinc-800 text-white" : "text-zinc-400"
                }`}
                onClick={() => setView("user")}
              >
                By user
              </button>
            </div>
            {isAdmin && (
              <>
                <button
                  type="button"
                  className={fleet.secondaryBtn}
                  onClick={() => setShowSettings(true)}
                >
                  <Settings2 className="h-4 w-4" />
                  Server settings
                </button>
                <button
                  type="button"
                  className={fleet.primaryBtn}
                  onClick={() => {
                    setEditMailbox(null);
                    setShowAdd(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add mailbox
                </button>
              </>
            )}
          </div>
        </div>

        {mismatches.length > 0 && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            {mismatches.length} Brand Email row(s) have departmentId out of sync
            with Brand.departmentId. Mapping permissions use Brand.departmentId
            only. Report these to admin if unexpected.
          </div>
        )}

        {view === "user" ? (
          <MailboxByUserPanel />
        ) : flatCount === 0 ? (
          <EmptyState
            icon={Mail}
            title="No mailboxes yet"
            description={
              isAdmin
                ? "Save server settings, then add a mailbox."
                : "No mailboxes in your department scope yet."
            }
          />
        ) : (
          <div className="space-y-6">
            {grouped.map((dept) => (
              <section key={dept.departmentId} className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  {dept.departmentName}
                </h4>
                {dept.brands.map((brand) => (
                  <div
                    key={brand.brandId}
                    className="overflow-hidden rounded-2xl border border-zinc-800"
                  >
                    <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-800 text-sm text-zinc-200 font-medium">
                      {brand.brandName}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="table-head-row">
                            <th className="table-head-cell text-left">Mailbox</th>
                            <th className="table-head-cell text-left">Login</th>
                            <th className="table-head-cell text-left">Status</th>
                            <th className="table-head-cell text-left">Users</th>
                            <th className="table-head-cell text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brand.mailboxes.map((m) => (
                            <tr
                              key={m._id}
                              className="border-t border-zinc-800 hover:bg-zinc-900/40"
                            >
                              <td className="px-4 py-3 text-sm text-zinc-100">
                                {m.emailAddress}
                                {m.displayName ? (
                                  <div className="text-[11px] text-zinc-500">
                                    {m.displayName}
                                  </div>
                                ) : null}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-400">
                                {m.loginUsername}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <StatusPill status={m.status} error={m.lastError} />
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-300">
                                {m.assignedCount}
                                {m.outOfScopeCount > 0 && (
                                  <span className="ml-1 text-amber-400 text-xs">
                                    ({m.outOfScopeCount} out of scope)
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-xs text-zinc-200 hover:text-white"
                                    onClick={() =>
                                      setAssignMailbox({
                                        ...m,
                                        brandId: {
                                          _id: brand.brandId,
                                          name: brand.brandName,
                                          departmentId: dept.departmentId,
                                        },
                                      })
                                    }
                                  >
                                    <Users className="h-3.5 w-3.5" />
                                    Assign
                                  </button>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      className="text-xs text-zinc-400 hover:text-white"
                                      onClick={() => {
                                        setEditMailbox(m);
                                        setShowAdd(true);
                                      }}
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>

      {showSettings && (
        <MailboxServerSettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showAdd && (
        <MailboxAddModal
          editMailbox={editMailbox}
          onClose={(saved) => {
            setShowAdd(false);
            setEditMailbox(null);
            if (saved) refetch();
          }}
        />
      )}
      {assignMailbox && (
        <MailboxAssignPanel
          mailbox={assignMailbox}
          canFilterDept={canFilterDept}
          departments={departments}
          onClose={() => {
            setAssignMailbox(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function StatusPill({ status, error }) {
  const map = {
    connected: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    error: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    disabled: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
    unknown: "text-zinc-400 bg-zinc-500/10 border-zinc-600/40",
  };
  const cls = map[status] || map.unknown;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${cls}`}
      title={error || undefined}
    >
      {status}
    </span>
  );
}
