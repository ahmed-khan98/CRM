"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import {
  useGetMailboxAssignableUsersQuery,
  useGetMailboxServerDefaultsQuery,
  useTestMailboxConnectionMutation,
  useUpsertMyPersonalMailboxMutation,
} from "@/app/_Services/mailbox/page";

function capitalizeName(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Admin-only: create/update a user's company (personal) email — not brand-linked.
 */
export default function MailboxPersonalModal({
  onClose,
  editRow = null,
  existingOwnerIds = [],
}) {
  const isEdit = Boolean(editRow?._id);
  const { data: usersData } = useGetMailboxAssignableUsersQuery();
  const { data: defaultsData } = useGetMailboxServerDefaultsQuery();
  const [upsert, { isLoading: saving }] = useUpsertMyPersonalMailboxMutation();
  const [testConnection, { isLoading: testing }] =
    useTestMailboxConnectionMutation();

  const users = usersData?.data || [];
  const defaults = defaultsData?.data || [];
  const taken = useMemo(
    () => new Set(existingOwnerIds.map(String)),
    [existingOwnerIds],
  );

  const userOptions = useMemo(
    () =>
      users
        .filter((u) => isEdit || !taken.has(String(u._id)))
        .map((u) => ({
          value: String(u._id),
          label: capitalizeName(u.fullName || "User"),
        })),
    [users, taken, isEdit],
  );

  const domainOptions = useMemo(
    () =>
      (defaults.length ? defaults : []).map((d) => ({
        value: d.domain,
        label: d.domain,
      })),
    [defaults],
  );

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    emailAddress: "",
    loginUsername: "",
    displayName: "",
    password: "",
    domain: "",
  });

  useEffect(() => {
    if (editRow) {
      setForm({
        userId: String(editRow.ownerUserId?._id || editRow.ownerUserId || ""),
        emailAddress: editRow.emailAddress || "",
        loginUsername: editRow.loginUsername || "",
        displayName: editRow.displayName || "",
        password: "",
        domain:
          editRow.serverDefaultsId?.domain ||
          String(editRow.emailAddress || "").split("@")[1] ||
          "",
      });
    } else if (defaults[0]?.domain) {
      setForm((f) => ({ ...f, domain: f.domain || defaults[0].domain }));
    }
  }, [editRow, defaults]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const runTest = async () => {
    try {
      const body = isEdit
        ? {
            mailboxId: editRow._id,
            loginUsername: form.loginUsername || form.emailAddress,
            ...(form.password ? { password: form.password } : {}),
          }
        : {
            loginUsername: form.loginUsername || form.emailAddress,
            password: form.password,
            domain: form.domain,
          };
      const res = await testConnection(body).unwrap();
      if (res?.data?.ok) toast.success("Connection OK");
      else toast.error(res?.data?.error || "Connection failed");
    } catch (err) {
      toast.error(err?.data?.message || "Test failed");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error("Select a user");
    if (!form.emailAddress) return toast.error("Email is required");
    if (!isEdit && !form.password) return toast.error("Password is required");
    if (!form.domain) return toast.error("Server domain is required");
    try {
      const body = {
        userId: form.userId,
        emailAddress: form.emailAddress.trim().toLowerCase(),
        loginUsername: form.loginUsername || form.emailAddress,
        displayName: form.displayName,
        domain: form.domain,
      };
      if (form.password) body.password = form.password;
      await upsert(body).unwrap();
      toast.success(isEdit ? "Company email updated" : "Company email created");
      onClose(true);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div className={fleet.modalOverlay}>
      <div className={`${fleet.modalPanel} max-w-lg`}>
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className={fleet.modalTitle}>
            {isEdit ? "Edit company email" : "Add company email"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Internal office mail for one employee — not linked to any brand.
          </p>
        </div>
        <form onSubmit={save} className={fleet.modalBody}>
          <div>
            <label className={fleet.modalLabel}>User</label>
            <CrmSelect
              variant="dark"
              isSearchable
              options={userOptions}
              value={form.userId}
              onChange={(v) => set("userId", v)}
              isDisabled={isEdit}
              placeholder="Select employee…"
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Email address</label>
            <input
              className={fleet.modalInput}
              type="email"
              value={form.emailAddress}
              onChange={(e) => set("emailAddress", e.target.value)}
              required
              placeholder="name@zytronworld.com"
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Login username</label>
            <input
              className={fleet.modalInput}
              value={form.loginUsername}
              onChange={(e) => set("loginUsername", e.target.value)}
              placeholder="Usually same as email"
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Display name</label>
            <input
              className={fleet.modalInput}
              value={form.displayName}
              onChange={(e) => set("displayName", e.target.value)}
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Server domain</label>
            <CrmSelect
              variant="dark"
              isSearchable
              options={domainOptions}
              value={form.domain}
              onChange={(v) => set("domain", v)}
              placeholder="Select domain…"
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>
              {isEdit ? "New password (leave blank to keep)" : "Password"}
            </label>
            <div className="relative">
              <input
                className={`${fleet.modalInput} pr-10`}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required={!isEdit}
                placeholder={isEdit ? "••••••••" : ""}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-200"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className={fleet.modalFooter}>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              disabled={testing}
              onClick={runTest}
            >
              Test connection
            </button>
            <button
              type="submit"
              className={fleet.modalPrimaryBtn}
              disabled={saving}
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
