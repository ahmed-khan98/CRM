"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useAssignMailboxUsersMutation,
  useGetMailboxAssignableUsersQuery,
  useGetMailboxAssignmentsQuery,
  useRemoveMailboxAssignmentMutation,
  useUpdateMailboxAssignmentMutation,
} from "@/app/_Services/mailbox/page";

const PERMS = [
  { value: "read", label: "Read" },
  { value: "read_send", label: "Read + Send" },
  { value: "manage", label: "Manage" },
];

export default function MailboxAssignPanel({
  mailbox,
  canFilterDept,
  departments = [],
  onClose,
}) {
  const mailboxId = mailbox?._id;
  const { data, refetch, isFetching } = useGetMailboxAssignmentsQuery(mailboxId, {
    skip: !mailboxId,
  });
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pickUserId, setPickUserId] = useState("");
  const [pickPerm, setPickPerm] = useState("read");

  const userParams = useMemo(
    () => ({
      ...(canFilterDept && deptFilter ? { departmentId: deptFilter } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    }),
    [canFilterDept, deptFilter, search],
  );

  const { data: usersData, refetch: refetchUsers } =
    useGetMailboxAssignableUsersQuery(userParams);
  const [assignUsers, { isLoading: assigning }] =
    useAssignMailboxUsersMutation();
  const [updateAssignment] = useUpdateMailboxAssignmentMutation();
  const [removeAssignment] = useRemoveMailboxAssignmentMutation();

  useEffect(() => {
    refetchUsers();
  }, [userParams, refetchUsers]);

  const assignments = data?.data || [];
  const users = usersData?.data || [];
  const assignedIds = new Set(
    assignments.map((a) => String(a.userId?._id || a.userId)),
  );
  const available = users.filter((u) => !assignedIds.has(String(u._id)));

  const add = async () => {
    if (!pickUserId) return toast.error("Select a user");
    try {
      await assignUsers({
        mailboxId,
        assignments: [{ userId: pickUserId, permission: pickPerm }],
      }).unwrap();
      toast.success("User assigned");
      setPickUserId("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Assign failed");
    }
  };

  const changePerm = async (userId, permission) => {
    try {
      await updateAssignment({ mailboxId, userId, permission }).unwrap();
      toast.success("Permission updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const remove = async (userId) => {
    try {
      await removeAssignment({ mailboxId, userId }).unwrap();
      toast.success("Access removed");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Remove failed");
    }
  };

  return (
    <div className={fleet.modalOverlay} onClick={onClose}>
      <div
        className={`${fleet.modalPanel} max-w-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className={fleet.modalTitle}>Assign users</h3>
          <p className="text-xs text-zinc-400 mt-1">
            {mailbox?.emailAddress} · {mailbox?.brandId?.name || ""}
          </p>
        </div>
        <div className={fleet.modalBody}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {canFilterDept && (
              <div>
                <label className={fleet.modalLabel}>Department filter</label>
                <select
                  className={fleet.modalSelect}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="">All (in scope)</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={fleet.modalLabel}>Search users</label>
              <input
                className={fleet.modalInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or email"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1 w-full">
              <label className={fleet.modalLabel}>Add user</label>
              <select
                className={fleet.modalSelect}
                value={pickUserId}
                onChange={(e) => setPickUserId(e.target.value)}
              >
                <option value="">Select…</option>
                {available.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className={fleet.modalLabel}>Permission</label>
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
              disabled={assigning}
              onClick={add}
            >
              Add
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-zinc-900/80 text-zinc-400 text-left">
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Permission</th>
                  <th className="px-3 py-2 font-medium">Scope</th>
                  <th className="px-3 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {isFetching && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-zinc-500">
                      Loading…
                    </td>
                  </tr>
                )}
                {!isFetching && assignments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-zinc-500">
                      No users assigned yet.
                    </td>
                  </tr>
                )}
                {assignments.map((a) => {
                  const uid = a.userId?._id || a.userId;
                  return (
                    <tr
                      key={String(a._id)}
                      className="border-t border-white/[0.06]"
                    >
                      <td className="px-3 py-2 text-zinc-100 capitalize">
                        {a.userId?.fullName || "—"}
                        <div className="text-[11px] text-zinc-500 normal-case">
                          {a.userId?.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className={fleet.modalSelect}
                          value={a.permission}
                          onChange={(e) => changePerm(uid, e.target.value)}
                        >
                          {PERMS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        {a.outOfScope ? (
                          <span className="text-amber-400 text-xs font-medium">
                            Out of scope
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-xs">OK</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          className="text-rose-400 text-xs font-medium hover:text-rose-300"
                          onClick={() => remove(uid)}
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
        </div>
        <div className={fleet.modalFooter}>
          <button type="button" className={fleet.modalCancelBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
