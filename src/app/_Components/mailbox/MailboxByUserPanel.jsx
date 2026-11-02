"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetMailboxAssignableUsersQuery,
  useGetMailboxAssignmentsByUserQuery,
  useGetMailboxMappingQuery,
  useRemoveMailboxAssignmentMutation,
  useSetMailboxAssignmentsByUserMutation,
} from "@/app/_Services/mailbox/page";

const PERMS = [
  { value: "read", label: "Read" },
  { value: "read_send", label: "Read + Send" },
  { value: "manage", label: "Manage" },
];

export default function MailboxByUserPanel() {
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const [pickMailboxId, setPickMailboxId] = useState("");
  const [pickPerm, setPickPerm] = useState("read");

  const { data: usersData } = useGetMailboxAssignableUsersQuery({
    ...(search.trim() ? { search: search.trim() } : {}),
  });
  const { data: mappingData, refetch: refetchMapping } =
    useGetMailboxMappingQuery();
  const { data: byUser, refetch, isFetching } =
    useGetMailboxAssignmentsByUserQuery(userId, { skip: !userId });
  const [setAssignments, { isLoading }] =
    useSetMailboxAssignmentsByUserMutation();
  const [removeAssignment] = useRemoveMailboxAssignmentMutation();

  const users = usersData?.data || [];
  const assignments = byUser?.data?.assignments || [];
  const assignedMailboxIds = new Set(
    assignments.map((a) => String(a.mailboxId?._id || a.mailboxId)),
  );

  const allMailboxes = useMemo(() => {
    const list = [];
    for (const dept of mappingData?.data?.grouped || []) {
      for (const brand of dept.brands || []) {
        for (const m of brand.mailboxes || []) {
          list.push({
            ...m,
            brandName: brand.brandName,
            departmentName: dept.departmentName,
          });
        }
      }
    }
    return list;
  }, [mappingData]);

  const availableMailboxes = allMailboxes.filter(
    (m) => !assignedMailboxIds.has(String(m._id)),
  );

  const add = async () => {
    if (!userId || !pickMailboxId) return toast.error("Pick user and mailbox");
    try {
      await setAssignments({
        userId,
        assignments: [{ mailboxId: pickMailboxId, permission: pickPerm }],
      }).unwrap();
      toast.success("Assigned");
      setPickMailboxId("");
      refetch();
      refetchMapping();
    } catch (err) {
      toast.error(err?.data?.message || "Assign failed");
    }
  };

  const remove = async (mailboxId) => {
    try {
      await removeAssignment({ mailboxId, userId }).unwrap();
      toast.success("Removed");
      refetch();
      refetchMapping();
    } catch (err) {
      toast.error(err?.data?.message || "Remove failed");
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-800 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="type-label block mb-2">Search user</label>
          <input
            className={fleet.modalInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter list…"
          />
        </div>
        <div className="flex-[2]">
          <label className="type-label block mb-2">User</label>
          <select
            className={fleet.modalSelect}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select user…</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName} — {u.email}
                {u.departmentId?.name ? ` (${u.departmentId.name})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {userId && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1 w-full">
              <label className="type-label block mb-2">Add mailbox</label>
              <select
                className={fleet.modalSelect}
                value={pickMailboxId}
                onChange={(e) => setPickMailboxId(e.target.value)}
              >
                <option value="">Select mailbox…</option>
                {availableMailboxes.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.departmentName} / {m.brandName} / {m.emailAddress}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className="type-label block mb-2">Permission</label>
              <select
                className={fleet.modalSelect}
                value={pickPerm}
                onChange={(e) => setPickPerm(e.target.value)}
              >
                {PERMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={fleet.modalPrimaryBtn}
              disabled={isLoading}
              onClick={add}
            >
              Add
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="table-head-row">
                  <th className="table-head-cell text-left">Mailbox</th>
                  <th className="table-head-cell text-left">Brand</th>
                  <th className="table-head-cell text-left">Permission</th>
                  <th className="table-head-cell text-left">Scope</th>
                  <th className="table-head-cell text-left" />
                </tr>
              </thead>
              <tbody>
                {isFetching && (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-zinc-500">
                      Loading…
                    </td>
                  </tr>
                )}
                {!isFetching && assignments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-zinc-500">
                      No mailboxes assigned to this user (in your scope).
                    </td>
                  </tr>
                )}
                {assignments.map((a) => {
                  const m = a.mailboxId;
                  return (
                    <tr key={String(a._id)} className="border-t border-zinc-800">
                      <td className="px-4 py-2 text-zinc-100">
                        {m?.emailAddress || "—"}
                      </td>
                      <td className="px-4 py-2 text-zinc-300">
                        {m?.brandId?.name || "—"}
                      </td>
                      <td className="px-4 py-2 text-zinc-300">{a.permission}</td>
                      <td className="px-4 py-2">
                        {a.outOfScope ? (
                          <span className="text-amber-400 text-xs">Out of scope</span>
                        ) : (
                          <span className="text-emerald-400 text-xs">OK</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          className="text-rose-400 text-xs"
                          onClick={() => remove(m?._id || a.mailboxId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
