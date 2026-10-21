"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import ModalShell from "@/app/_Components/Modal/ModalShell";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetJoiningByIdQuery,
  useGetJoiningByOfferQuery,
  useUpdateJoiningByHrMutation,
  useApproveJoiningMutation,
  useRequestJoiningChangesMutation,
  useResendJoiningByIdMutation,
} from "@/app/_Services/recruitment/page";
import {
  joiningStatusLabel,
  formatRecDate,
  formatRecDateTime,
  JOINING_DOC_TYPES,
} from "@/app/_Components/recruitment/recruitmentUi";

const field =
  "w-full rounded-xl border border-zinc-700 bg-[#121212] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none disabled:opacity-50";
const label =
  "mb-1 block text-[11px] font-medium uppercase tracking-wider text-zinc-500";

const SECTIONS = [
  { key: "personal", label: "Personal" },
  { key: "emergencyContact", label: "Emergency contact" },
  { key: "bank", label: "Bank" },
  { key: "family", label: "Family" },
  { key: "previousJobs", label: "Previous jobs" },
  { key: "documents", label: "Documents" },
];

function toDateInput(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function hydrate(data) {
  const d = data || {};
  return {
    personal: {
      cnic: d.personal?.cnic || "",
      dateOfBirth: toDateInput(d.personal?.dateOfBirth),
      gender: d.personal?.gender || "",
      maritalStatus: d.personal?.maritalStatus || "",
      bloodGroup: d.personal?.bloodGroup || "",
      address: d.personal?.address || "",
      photoUrl: d.personal?.photoUrl || "",
    },
    emergencyContact: {
      name: d.emergencyContact?.name || "",
      phone: d.emergencyContact?.phone || "",
      relationship: d.emergencyContact?.relationship || "",
      address: d.emergencyContact?.address || "",
    },
    bank: {
      bankName: d.bank?.bankName || "",
      accountTitle: d.bank?.accountTitle || "",
      accountNumber: d.bank?.accountNumber || "",
      iban: d.bank?.iban || "",
    },
    ntn: d.ntn || "",
    family: {
      fatherName: d.family?.fatherName || "",
      motherName: d.family?.motherName || "",
      spouse: {
        name: d.family?.spouse?.name || "",
        dob: toDateInput(d.family?.spouse?.dob),
        cnic: d.family?.spouse?.cnic || "",
        occupation: d.family?.spouse?.occupation || "",
      },
      children: Array.isArray(d.family?.children)
        ? d.family.children.map((c) => ({
            name: c.name || "",
            dob: toDateInput(c.dob),
            gender: c.gender || "",
            _id: c._id,
          }))
        : [],
    },
    previousJobs: Array.isArray(d.previousJobs)
      ? d.previousJobs.map((j) => ({
          companyName: j.companyName || "",
          designation: j.designation || "",
          startDate: toDateInput(j.startDate),
          endDate: toDateInput(j.endDate),
          lastSalary: j.lastSalary ?? "",
          reasonForLeaving: j.reasonForLeaving || "",
          _id: j._id,
        }))
      : [],
    documents: Array.isArray(d.documents) ? d.documents : [],
    consent: Boolean(d.consent),
  };
}

/**
 * @param {{ joiningId?: string, offerId?: string, isOpen: boolean, onClose: () => void }} props
 */
export default function JoiningReviewModal({
  joiningId,
  offerId,
  isOpen,
  onClose,
}) {
  const byId = useGetJoiningByIdQuery(joiningId, {
    skip: !isOpen || !joiningId,
  });
  const byOffer = useGetJoiningByOfferQuery(offerId, {
    skip: !isOpen || !offerId || Boolean(joiningId),
  });
  const source = joiningId ? byId : byOffer;
  const joining = source.data?.data;
  const loading = source.isFetching && !joining;

  const [updateHr, { isLoading: saving }] = useUpdateJoiningByHrMutation();
  const [approve, { isLoading: approving }] = useApproveJoiningMutation();
  const [requestChanges, { isLoading: requesting }] =
    useRequestJoiningChangesMutation();
  const [resend, { isLoading: resending }] = useResendJoiningByIdMutation();

  const [form, setForm] = useState(null);
  const [changeNote, setChangeNote] = useState("");
  const [sections, setSections] = useState([]);
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    if (joining?.data) {
      setForm(hydrate(joining.data));
      setChangeNote(joining.reviewNote || "");
      setSections(joining.requestedSections || []);
    } else if (joining === null) {
      setForm(null);
    }
  }, [joining]);

  const busy = saving || approving || requesting || resending;
  const editable = Boolean(joining?.hrEditable);
  const id = joining?._id;

  const payload = () => ({
    ...form,
    previousJobs: (form?.previousJobs || []).map((j) => ({
      ...j,
      lastSalary:
        j.lastSalary === "" || j.lastSalary == null
          ? null
          : Number(j.lastSalary),
    })),
  });

  const onSave = async () => {
    if (!id || !form) return;
    try {
      await updateHr({ id, data: payload() }).unwrap();
      toast.success("Corrections saved");
    } catch (e) {
      toast.error(e?.data?.message || "Save failed");
    }
  };

  const onApprove = async () => {
    if (!id) return;
    try {
      await approve({ id }).unwrap();
      toast.success("Joining details approved");
      onClose();
    } catch (e) {
      toast.error(e?.data?.message || "Approve failed");
    }
  };

  const onRequest = async () => {
    if (!id) return;
    if (!changeNote.trim()) {
      toast.error("Add a note for the candidate");
      return;
    }
    try {
      await requestChanges({
        id,
        note: changeNote.trim(),
        requestedSections: sections,
      }).unwrap();
      toast.success("Changes requested — email sent");
      setShowRequest(false);
      onClose();
    } catch (e) {
      toast.error(e?.data?.message || "Request failed");
    }
  };

  const onResend = async () => {
    if (!id) return;
    try {
      await resend(id).unwrap();
      toast.success("Joining link resent");
    } catch (e) {
      toast.error(e?.data?.message || "Resend failed");
    }
  };

  const setPersonal = (k, v) =>
    setForm((f) => ({ ...f, personal: { ...f.personal, [k]: v } }));
  const setEmergency = (k, v) =>
    setForm((f) => ({
      ...f,
      emergencyContact: { ...f.emergencyContact, [k]: v },
    }));
  const setBank = (k, v) =>
    setForm((f) => ({ ...f, bank: { ...f.bank, [k]: v } }));

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !busy && onClose()}
      title="Review joining details"
      maxWidthClass="max-w-3xl"
      footer={
        joining ? (
          <>
            <button
              type="button"
              className={fleet.modalCancelBtn}
              disabled={busy}
              onClick={onClose}
            >
              Close
            </button>
            {editable && (
              <button
                type="button"
                className={fleet.secondaryBtn}
                disabled={busy}
                onClick={onSave}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save edits"
                )}
              </button>
            )}
            {joining.canRequestChanges && (
              <button
                type="button"
                className={fleet.secondaryBtn}
                disabled={busy}
                onClick={() => setShowRequest((v) => !v)}
              >
                Request changes
              </button>
            )}
            {!["approved", "used"].includes(joining.status) && (
              <button
                type="button"
                className={fleet.secondaryBtn}
                disabled={busy}
                onClick={onResend}
              >
                {resending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Resend link"
                )}
              </button>
            )}
            {joining.canApprove && (
              <button
                type="button"
                className={fleet.modalPrimaryBtn}
                disabled={busy}
                onClick={onApprove}
              >
                {approving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Approve"
                )}
              </button>
            )}
          </>
        ) : null
      }
    >
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : !joining ? (
        <p className="text-sm text-zinc-400">
          No joining details for this offer yet. Accept the offer to send the
          magic link, or use Resend joining from the offers list.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
            <p className="font-medium text-zinc-100">
              {joining.candidateName} · {joining.jobTitle}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Status: {joiningStatusLabel(joining.status)}
              {joining.submittedAt
                ? ` · Submitted ${formatRecDateTime(joining.submittedAt)}`
                : ""}
              {joining.expiresAt
                ? ` · Expires ${formatRecDate(joining.expiresAt)}`
                : ""}
            </p>
            {joining.reviewNote ? (
              <p className="mt-2 text-xs text-amber-300/90">
                Last note: {joining.reviewNote}
              </p>
            ) : null}
          </div>

          {showRequest && (
            <div className="space-y-3 rounded-xl border border-amber-900/50 bg-amber-950/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">
                Request changes
              </p>
              <textarea
                className={field}
                rows={3}
                placeholder="What should the candidate update?"
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => {
                  const on = sections.includes(s.key);
                  return (
                    <button
                      key={s.key}
                      type="button"
                      className={`rounded-full px-2.5 py-1 text-[11px] ${
                        on
                          ? "bg-amber-500/20 text-amber-100"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                      onClick={() =>
                        setSections((prev) =>
                          on
                            ? prev.filter((x) => x !== s.key)
                            : [...prev, s.key]
                        )
                      }
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className={fleet.modalPrimaryBtn}
                disabled={busy}
                onClick={onRequest}
              >
                {requesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send request to candidate"
                )}
              </button>
            </div>
          )}

          {form && (
            <>
              <Section title="Personal">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["cnic", "CNIC"],
                    ["gender", "Gender"],
                    ["maritalStatus", "Marital status"],
                    ["bloodGroup", "Blood group"],
                  ].map(([k, l]) => (
                    <Field
                      key={k}
                      label={l}
                      value={form.personal[k]}
                      disabled={!editable}
                      onChange={(v) => setPersonal(k, v)}
                    />
                  ))}
                  <div>
                    <label className={label}>Date of birth</label>
                    <input
                      type="date"
                      className={field}
                      disabled={!editable}
                      value={form.personal.dateOfBirth}
                      onChange={(e) =>
                        setPersonal("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Address</label>
                    <textarea
                      className={field}
                      rows={2}
                      disabled={!editable}
                      value={form.personal.address}
                      onChange={(e) => setPersonal("address", e.target.value)}
                    />
                  </div>
                  {form.personal.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.personal.photoUrl}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : null}
                </div>
              </Section>

              <Section title="Emergency contact">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["name", "Name"],
                    ["phone", "Phone"],
                    ["relationship", "Relationship"],
                    ["address", "Address"],
                  ].map(([k, l]) => (
                    <Field
                      key={k}
                      label={l}
                      value={form.emergencyContact[k]}
                      disabled={!editable}
                      onChange={(v) => setEmergency(k, v)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Bank & tax">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["bankName", "Bank name"],
                    ["accountTitle", "Account title"],
                    ["accountNumber", "Account number"],
                    ["iban", "IBAN"],
                  ].map(([k, l]) => (
                    <Field
                      key={k}
                      label={l}
                      value={form.bank[k]}
                      disabled={!editable}
                      onChange={(v) => setBank(k, v)}
                    />
                  ))}
                  <Field
                    label="NTN"
                    value={form.ntn}
                    disabled={!editable}
                    onChange={(v) => setForm({ ...form, ntn: v })}
                  />
                </div>
              </Section>

              <Section title="Family">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Father"
                    value={form.family.fatherName}
                    disabled={!editable}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        family: { ...form.family, fatherName: v },
                      })
                    }
                  />
                  <Field
                    label="Mother"
                    value={form.family.motherName}
                    disabled={!editable}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        family: { ...form.family, motherName: v },
                      })
                    }
                  />
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-zinc-500">
                  Spouse
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["name", "cnic", "occupation"].map((k) => (
                    <Field
                      key={k}
                      label={k}
                      value={form.family.spouse[k]}
                      disabled={!editable}
                      onChange={(v) =>
                        setForm({
                          ...form,
                          family: {
                            ...form.family,
                            spouse: { ...form.family.spouse, [k]: v },
                          },
                        })
                      }
                    />
                  ))}
                </div>
                {(form.family.children || []).length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                    {form.family.children.map((c, i) => (
                      <li key={i}>
                        Child: {c.name || "—"} · {c.gender || "—"} ·{" "}
                        {c.dob || "—"}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Previous jobs">
                {(form.previousJobs || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">None</p>
                ) : (
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {form.previousJobs.map((j, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-zinc-800 p-2"
                      >
                        {j.companyName || "—"} · {j.designation || "—"}
                        <br />
                        {j.startDate || "—"} → {j.endDate || "—"}
                        {j.lastSalary !== "" && j.lastSalary != null
                          ? ` · ${j.lastSalary}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Documents">
                {(form.documents || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">None</p>
                ) : (
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {form.documents.map((d, i) => (
                      <li key={i}>
                        {JOINING_DOC_TYPES.find(
                          (t) => t.value === d.documentType
                        )?.label || d.documentType}
                        :{" "}
                        {d.fileUrl ? (
                          <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            {d.fileName || "Open"}
                          </a>
                        ) : (
                          d.fileName || "—"
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              {(joining.editLog || []).length > 0 && (
                <Section title="Edit log">
                  <ul className="max-h-32 space-y-1 overflow-y-auto text-[11px] text-zinc-500">
                    {[...joining.editLog].reverse().map((e, i) => (
                      <li key={e._id || i}>
                        {formatRecDateTime(e.at)} · {e.section}
                        {e.note ? ` — ${e.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}
        </div>
      )}
    </ModalShell>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2 border-t border-zinc-800 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label: l, value, onChange, disabled }) {
  return (
    <div>
      <label className={label}>{l}</label>
      <input
        className={field}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
