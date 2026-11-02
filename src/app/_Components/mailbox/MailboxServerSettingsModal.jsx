"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetMailboxServerDefaultsQuery,
  useUpsertMailboxServerDefaultsMutation,
} from "@/app/_Services/mailbox/page";

const EMPTY_FORM = {
  domain: "",
  imapHost: "",
  imapPort: 993,
  imapSecure: true,
  smtpHost: "",
  smtpPort: 465,
  smtpSecure: true,
};

const PRESET = {
  domain: "trademarkusaservice.com",
  imapHost: "mail.trademarkusaservice.com",
  imapPort: 993,
  imapSecure: true,
  smtpHost: "mail.trademarkusaservice.com",
  smtpPort: 465,
  smtpSecure: true,
};

function rowToForm(row) {
  return {
    domain: row.domain,
    imapHost: row.imapHost,
    imapPort: row.imapPort,
    imapSecure: row.imapSecure,
    smtpHost: row.smtpHost,
    smtpPort: row.smtpPort,
    smtpSecure: row.smtpSecure,
  };
}

export default function MailboxServerSettingsModal({ onClose }) {
  const { data, refetch } = useGetMailboxServerDefaultsQuery();
  const [upsert, { isLoading }] = useUpsertMailboxServerDefaultsMutation();
  const rows = data?.data || [];

  const [selectedDomain, setSelectedDomain] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(PRESET);

  useEffect(() => {
    if (isNew) return;
    if (!rows.length) {
      setForm(PRESET);
      setSelectedDomain("");
      return;
    }
    const match =
      rows.find((r) => r.domain === selectedDomain) ||
      rows.find((r) => r.domain === "trademarkusaservice.com") ||
      rows[0];
    if (match) {
      setSelectedDomain(match.domain);
      setForm(rowToForm(match));
    }
  }, [data, rows, selectedDomain, isNew]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const startAddDomain = () => {
    setIsNew(true);
    setSelectedDomain("");
    setForm({ ...EMPTY_FORM });
  };

  const selectExisting = (domain) => {
    setIsNew(false);
    setSelectedDomain(domain);
    const match = rows.find((r) => r.domain === domain);
    if (match) setForm(rowToForm(match));
  };

  const save = async (e) => {
    e.preventDefault();
    const domain = String(form.domain || "")
      .trim()
      .toLowerCase();
    if (!domain) return toast.error("Domain is required");
    if (!form.imapHost?.trim() || !form.smtpHost?.trim()) {
      return toast.error("IMAP and SMTP hosts are required");
    }
    try {
      await upsert({
        ...form,
        domain,
        imapPort: Number(form.imapPort),
        smtpPort: Number(form.smtpPort),
      }).unwrap();
      toast.success(
        isNew || !rows.some((r) => r.domain === domain)
          ? `Domain "${domain}" added`
          : `Domain "${domain}" updated`,
      );
      setIsNew(false);
      setSelectedDomain(domain);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div className={fleet.modalOverlay} onClick={onClose}>
      <div
        className={`${fleet.modalPanel} max-w-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className={fleet.modalTitle}>Server settings</h3>
          <p className="text-xs text-zinc-400 mt-1">
            IMAP/SMTP defaults per domain (admin only). Add each domain once,
            then pick it when creating a mailbox.
          </p>
        </div>

        <div className="px-6 pt-4 flex flex-wrap items-center gap-2">
          {rows.map((r) => (
            <button
              key={r.domain}
              type="button"
              onClick={() => selectExisting(r.domain)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                !isNew && selectedDomain === r.domain
                  ? "border-zinc-300 text-white bg-zinc-800"
                  : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {r.domain}
            </button>
          ))}
          <button
            type="button"
            onClick={startAddDomain}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              isNew
                ? "border-emerald-400/60 text-emerald-300 bg-emerald-500/10"
                : "border-dashed border-zinc-600 text-zinc-300 hover:border-zinc-400"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add domain
          </button>
        </div>

        <form onSubmit={save} className={fleet.modalBody}>
          {isNew && (
            <p className="text-[11px] text-emerald-400/90 -mt-1">
              Enter a new domain (e.g. otherbrand.com). Saving creates a separate
              settings row; existing domains stay unchanged.
            </p>
          )}
          {[
            ["domain", "Domain", isNew ? "e.g. example.com" : undefined],
            ["imapHost", "IMAP host", "mail.example.com"],
            ["imapPort", "IMAP port"],
            ["smtpHost", "SMTP host", "mail.example.com"],
            ["smtpPort", "SMTP port"],
          ].map(([key, label, placeholder]) => (
            <div key={key}>
              <label className={fleet.modalLabel}>{label}</label>
              <input
                className={fleet.modalInput}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                required
                disabled={!isNew && key === "domain" && Boolean(selectedDomain)}
              />
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.imapSecure}
              onChange={(e) => set("imapSecure", e.target.checked)}
            />
            IMAP SSL/TLS
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.smtpSecure}
              onChange={(e) => set("smtpSecure", e.target.checked)}
            />
            SMTP SSL/TLS
          </label>
          <div className={fleet.modalFooter}>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={fleet.modalPrimaryBtn}
              disabled={isLoading}
            >
              {isNew ? "Add domain" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
