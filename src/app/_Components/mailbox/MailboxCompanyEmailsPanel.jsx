"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import MailboxPersonalModal from "@/app/_Components/mailbox/MailboxPersonalModal";
import {
  useDeleteMyPersonalMailboxMutation,
  useGetPersonalMailboxesQuery,
} from "@/app/_Services/mailbox/page";

function capitalizeName(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function MailboxCompanyEmailsPanel({ canManage }) {
  const { data, isLoading, refetch } = useGetPersonalMailboxesQuery(undefined, {
    skip: !canManage,
  });
  const [remove, { isLoading: deleting }] =
    useDeleteMyPersonalMailboxMutation();

  const rows = data?.data || [];
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = async () => {
    if (!confirmDelete?._id) return;
    try {
      await remove({ id: confirmDelete._id }).unwrap();
      toast.success("Company email deleted");
      setConfirmDelete(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (!canManage) {
    return (
      <p className="text-sm text-zinc-400 px-1">
        Only admin can manage company emails.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          className={fleet.primaryBtn}
          onClick={() => {
            setEditRow(null);
            setShowAdd(true);
          }}
        >
          Add company email
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500 px-1">
          No company emails yet. Add one per employee for internal mail.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left font-medium">User</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Domain</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-zinc-800 text-zinc-200"
                >
                  <td className="px-4 py-2">
                    {capitalizeName(r.ownerUserId?.fullName || "—")}
                  </td>
                  <td className="px-4 py-2 text-zinc-300">{r.emailAddress}</td>
                  <td className="px-4 py-2 text-zinc-400">
                    {r.serverDefaultsId?.domain || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {r.isActive ? (
                      <span className="text-emerald-400 text-xs">Active</span>
                    ) : (
                      <span className="text-zinc-500 text-xs">Inactive</span>
                    )}
                    {r.lastError ? (
                      <span className="ml-2 text-amber-400 text-xs">Error</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      type="button"
                      className="text-xs text-zinc-300 hover:text-white"
                      onClick={() => {
                        setEditRow(r);
                        setShowAdd(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose-400 hover:text-rose-300"
                      onClick={() => setConfirmDelete(r)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <MailboxPersonalModal
          editRow={editRow}
          existingOwnerIds={rows.map(
            (r) => r.ownerUserId?._id || r.ownerUserId,
          )}
          onClose={(saved) => {
            setShowAdd(false);
            setEditRow(null);
            if (saved) refetch();
          }}
        />
      )}

      {confirmDelete && (
        <WarningModal
          message={`company email "${confirmDelete.emailAddress}"`}
          title="Delete company email?"
          description={`Remove company email for ${capitalizeName(confirmDelete.ownerUserId?.fullName || "user")}? They will lose this mailbox in Inbox.`}
          confirmLabel="Yes, Delete"
          setConfirmDelete={setConfirmDelete}
          isDeleting={deleting}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
