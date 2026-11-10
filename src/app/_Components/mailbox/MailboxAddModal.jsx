"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import {
  useCreateMailboxMutation,
  useGetMailboxBrandEmailsQuery,
  useGetMailboxBrandsQuery,
  useGetMailboxServerDefaultsQuery,
  useTestMailboxConnectionMutation,
  useUpdateMailboxMutation,
} from "@/app/_Services/mailbox/page";

function capitalizeName(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function MailboxAddModal({ onClose, editMailbox = null }) {
  const isEdit = Boolean(editMailbox?._id);
  const { data: brandEmailData } = useGetMailboxBrandEmailsQuery(undefined, {
    skip: isEdit,
  });
  const { data: brandsData } = useGetMailboxBrandsQuery();
  const { data: defaultsData } = useGetMailboxServerDefaultsQuery();
  const [createMailbox, { isLoading: creating }] = useCreateMailboxMutation();
  const [updateMailbox, { isLoading: updating }] = useUpdateMailboxMutation();
  const [testConnection, { isLoading: testing }] =
    useTestMailboxConnectionMutation();

  const brandEmails = brandEmailData?.data?.rows || [];
  const brands = brandsData?.data || [];
  const defaults = defaultsData?.data || [];

  const brandOptions = useMemo(
    () =>
      brands.map((b) => ({
        value: String(b._id),
        label: capitalizeName(b.name || "Brand"),
      })),
    [brands],
  );

  const brandEmailOptions = useMemo(
    () =>
      brandEmails.map((r) => ({
        value: String(r._id),
        label: String(r.email || "") + (r.departmentMismatch ? " ⚠" : ""),
      })),
    [brandEmails],
  );

  const [mode, setMode] = useState("brandEmail");
  const [brandEmailId, setBrandEmailId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    brandId: editMailbox?.brandId?._id || editMailbox?.brandId || "",
    emailAddress: editMailbox?.emailAddress || "",
    loginUsername: editMailbox?.loginUsername || "",
    displayName: editMailbox?.displayName || "",
    password: "",
    domain: defaults[0]?.domain || "trademarkusaservice.com",
    isActive: editMailbox?.isActive !== false,
  });

  const selectedBe = useMemo(
    () => brandEmails.find((r) => String(r._id) === String(brandEmailId)),
    [brandEmails, brandEmailId],
  );

  const onPickBrandEmail = (id) => {
    setBrandEmailId(id);
    const row = brandEmails.find((r) => String(r._id) === String(id));
    if (!row) return;
    setForm((f) => ({
      ...f,
      brandId: row.brandId,
      emailAddress: row.email,
      loginUsername: row.email,
      displayName: row.name || "",
    }));
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const runTest = async () => {
    try {
      const body = isEdit
        ? {
            mailboxId: editMailbox._id,
            loginUsername: form.loginUsername,
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
    try {
      if (isEdit) {
        const body = {
          id: editMailbox._id,
          displayName: form.displayName,
          loginUsername: form.loginUsername,
          isActive: form.isActive,
        };
        if (form.password) body.password = form.password;
        await updateMailbox(body).unwrap();
        toast.success("Mailbox updated");
      } else {
        if (!form.brandId || !form.emailAddress || !form.password) {
          return toast.error("Brand, address and password are required");
        }
        await createMailbox({
          brandId: form.brandId,
          brandEmailId: mode === "brandEmail" ? brandEmailId || null : null,
          emailAddress: form.emailAddress,
          loginUsername: form.loginUsername || form.emailAddress,
          displayName: form.displayName,
          password: form.password,
          domain: form.domain,
        }).unwrap();
        toast.success("Mailbox created");
      }
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
            {isEdit ? "Edit mailbox" : "Add mailbox"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Password is write-only and never shown again
          </p>
        </div>
        <form onSubmit={save} className={fleet.modalBody}>
          {!isEdit && (
            <>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border ${
                    mode === "brandEmail"
                      ? "border-zinc-400 text-white"
                      : "border-zinc-700 text-zinc-400"
                  }`}
                  onClick={() => setMode("brandEmail")}
                >
                  From Brand Email
                </button>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border ${
                    mode === "manual"
                      ? "border-zinc-400 text-white"
                      : "border-zinc-700 text-zinc-400"
                  }`}
                  onClick={() => setMode("manual")}
                >
                  New address
                </button>
              </div>
              {mode === "brandEmail" && (
                <div>
                  <label className={fleet.modalLabel}>Brand Email row</label>
                  <CrmSelect
                    variant="dark"
                    isSearchable
                    isClearable
                    options={brandEmailOptions}
                    value={brandEmailId}
                    onChange={onPickBrandEmail}
                    placeholder="Select…"
                  />
                  {selectedBe?.departmentMismatch && (
                    <p className="text-[11px] text-amber-400 mt-1">
                      brandEmail.departmentId differs from Brand.departmentId —
                      permissions use Brand only.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div>
            <label className={fleet.modalLabel}>Brand</label>
            <CrmSelect
              variant="dark"
              isSearchable
              isClearable={!isEdit && mode !== "brandEmail"}
              options={brandOptions}
              value={form.brandId ? String(form.brandId) : ""}
              onChange={(v) => set("brandId", v)}
              isDisabled={isEdit || mode === "brandEmail"}
              placeholder="Select brand…"
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>Email address</label>
            <input
              className={fleet.modalInput}
              type="email"
              value={form.emailAddress}
              onChange={(e) => set("emailAddress", e.target.value)}
              disabled={isEdit}
              required
            />
          </div>

          <div>
            <label className={fleet.modalLabel}>
              Login username (cPanel — may be .com while Brand Email is .org)
            </label>
            <input
              className={fleet.modalInput}
              value={form.loginUsername}
              onChange={(e) => set("loginUsername", e.target.value)}
              required
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

          {!isEdit && (
            <div>
              <label className={fleet.modalLabel}>Server domain</label>
              <select
                className={fleet.modalSelect}
                value={form.domain}
                onChange={(e) => set("domain", e.target.value)}
              >
                {(defaults.length
                  ? defaults
                  : [{ domain: "trademarkusaservice.com" }]
                ).map((d) => (
                  <option key={d.domain} value={d.domain}>
                    {d.domain}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                title={showPassword ? "Hide password" : "Show password"}
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

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
              />
              Active
            </label>
          )}

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
              disabled={creating || updating}
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
