"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useGetPublicJoiningQuery,
  useSavePublicJoiningDraftMutation,
  useSubmitPublicJoiningMutation,
  useUploadPublicJoiningFileMutation,
} from "@/app/_Services/recruitment/page";
import {
  JOINING_DOC_TYPES,
  joiningStatusLabel,
  formatRecDate,
} from "@/app/_Components/recruitment/recruitmentUi";
import { pub } from "@/app/_Components/recruitment/publicCareersTheme";

const field = pub.field;
const labelCls = pub.label;
const section = `${pub.card} space-y-3`;

function ReqLabel({ children }) {
  return (
    <label className={labelCls}>
      {children} <span className="text-red-600">*</span>
    </label>
  );
}

const filled = (v) => v != null && String(v).trim().length > 0;

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const MARITAL_OPTIONS = ["Single", "Married", "Divorced", "Widowed"];
const BLOOD_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Brother",
  "Sister",
  "Son",
  "Daughter",
  "Uncle",
  "Aunt",
  "Friend",
  "Other",
];

const NAME_RE = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const CNIC_RE = /^\d{5}-\d{7}-\d$/;
const PHONE_RE = /^(?:\+92|0)3\d{9}$/;
const ACCOUNT_RE = /^\d{8,20}$/;
const IBAN_RE = /^PK\d{2}[A-Z0-9]{20}$/i;
const NTN_RE = /^[A-Za-z0-9-]{5,20}$/;

function formatCnicInput(raw) {
  const d = String(raw || "")
    .replace(/\D/g, "")
    .slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

function formatPhoneInput(raw) {
  let v = String(raw || "").replace(/[^\d+]/g, "");
  if (v.startsWith("+")) {
    v = `+${v.slice(1).replace(/\D/g, "").slice(0, 12)}`;
  } else {
    v = v.replace(/\D/g, "").slice(0, 11);
  }
  return v;
}

function formatIbanInput(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 24);
}

function formatNameInput(raw) {
  return String(raw || "")
    .replace(/[^A-Za-z\s'.-]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 80);
}

function fieldClass(hasError) {
  return hasError
    ? `${field} border-red-400 focus:border-red-500 focus:ring-red-200`
    : field;
}

function emptyJob() {
  return {
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    lastSalary: "",
    reasonForLeaving: "",
  };
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-[11px] font-medium text-red-600">{msg}</p>;
}

/** Returns { missing: string[], errors: Record<fieldPath, string> } */
function validateJoiningForm(form) {
  const missing = [];
  const errors = {};
  const p = form.personal || {};

  if (!filled(p.cnic)) errors["personal.cnic"] = "CNIC is required";
  else if (!CNIC_RE.test(String(p.cnic).trim()))
    errors["personal.cnic"] = "Use format 12345-1234567-1";

  if (!filled(p.dateOfBirth))
    errors["personal.dateOfBirth"] = "Date of birth is required";
  else {
    const dob = new Date(p.dateOfBirth);
    const age =
      (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(dob.getTime()) || age < 16 || age > 80)
      errors["personal.dateOfBirth"] = "Enter a valid date of birth";
  }

  if (!filled(p.gender)) errors["personal.gender"] = "Select gender";
  else if (!GENDER_OPTIONS.includes(p.gender))
    errors["personal.gender"] = "Select a valid gender";

  if (!filled(p.maritalStatus))
    errors["personal.maritalStatus"] = "Select marital status";
  else if (!MARITAL_OPTIONS.includes(p.maritalStatus))
    errors["personal.maritalStatus"] = "Select a valid marital status";

  if (!filled(p.bloodGroup))
    errors["personal.bloodGroup"] = "Select blood group";
  else if (!BLOOD_OPTIONS.includes(p.bloodGroup))
    errors["personal.bloodGroup"] = "Select a valid blood group";

  if (!filled(p.address) || String(p.address).trim().length < 5)
    errors["personal.address"] = "Enter a full address";

  if (!filled(p.photoUrl)) errors["personal.photoUrl"] = "Photo is required";

  if (
    errors["personal.cnic"] ||
    errors["personal.dateOfBirth"] ||
    errors["personal.gender"] ||
    errors["personal.maritalStatus"] ||
    errors["personal.bloodGroup"] ||
    errors["personal.address"] ||
    errors["personal.photoUrl"]
  ) {
    missing.push("Personal");
  }

  const e = form.emergencyContact || {};
  if (!filled(e.name) || !NAME_RE.test(String(e.name).trim()))
    errors["emergency.name"] = "Enter a valid name (letters only)";
  if (!filled(e.phone)) errors["emergency.phone"] = "Phone is required";
  else if (!PHONE_RE.test(String(e.phone).replace(/\s/g, "")))
    errors["emergency.phone"] = "Use 03XXXXXXXXX or +923XXXXXXXXX";
  if (!filled(e.relationship))
    errors["emergency.relationship"] = "Select relationship";
  else if (!RELATIONSHIP_OPTIONS.includes(e.relationship))
    errors["emergency.relationship"] = "Select a valid relationship";
  if (!filled(e.address) || String(e.address).trim().length < 5)
    errors["emergency.address"] = "Enter emergency address";
  if (
    errors["emergency.name"] ||
    errors["emergency.phone"] ||
    errors["emergency.relationship"] ||
    errors["emergency.address"]
  ) {
    missing.push("Emergency contact");
  }

  const b = form.bank || {};
  if (!filled(b.bankName) || String(b.bankName).trim().length < 2)
    errors["bank.bankName"] = "Bank name is required";
  if (!filled(b.accountTitle) || !NAME_RE.test(String(b.accountTitle).trim()))
    errors["bank.accountTitle"] = "Enter a valid account title";
  if (!filled(b.accountNumber))
    errors["bank.accountNumber"] = "Account number is required";
  else if (!ACCOUNT_RE.test(String(b.accountNumber).replace(/\s/g, "")))
    errors["bank.accountNumber"] = "Account number must be 8–20 digits";
  if (!filled(b.iban)) errors["bank.iban"] = "IBAN is required";
  else if (!IBAN_RE.test(String(b.iban).replace(/\s/g, "")))
    errors["bank.iban"] = "IBAN must be PK + 22 characters (24 total)";
  if (filled(form.ntn) && !NTN_RE.test(String(form.ntn).trim()))
    errors.ntn = "Enter a valid NTN";
  if (
    errors["bank.bankName"] ||
    errors["bank.accountTitle"] ||
    errors["bank.accountNumber"] ||
    errors["bank.iban"]
  ) {
    missing.push("Bank");
  }

  const f = form.family || {};
  if (!filled(f.fatherName) || !NAME_RE.test(String(f.fatherName).trim()))
    errors["family.fatherName"] = "Enter father's name (letters only)";
  if (!filled(f.motherName) || !NAME_RE.test(String(f.motherName).trim()))
    errors["family.motherName"] = "Enter mother's name (letters only)";
  const married = /married/i.test(String(p.maritalStatus || ""));
  if (married) {
    if (!filled(f.spouse?.name) || !NAME_RE.test(String(f.spouse.name).trim()))
      errors["family.spouse.name"] = "Spouse name is required";
  }
  if (filled(f.spouse?.cnic) && !CNIC_RE.test(String(f.spouse.cnic).trim()))
    errors["family.spouse.cnic"] = "Use format 12345-1234567-1";

  const children = Array.isArray(f.children) ? f.children : [];
  children.forEach((c, i) => {
    const started = filled(c?.name) || filled(c?.dob) || filled(c?.gender);
    if (!started) return;
    if (!filled(c?.name) || !NAME_RE.test(String(c.name).trim()))
      errors[`family.children.${i}.name`] = "Enter child name (letters only)";
    if (filled(c?.gender) && !GENDER_OPTIONS.includes(c.gender))
      errors[`family.children.${i}.gender`] = "Select a valid gender";
  });

  if (
    errors["family.fatherName"] ||
    errors["family.motherName"] ||
    errors["family.spouse.name"] ||
    errors["family.spouse.cnic"] ||
    Object.keys(errors).some((k) => k.startsWith("family.children."))
  ) {
    missing.push(
      married && errors["family.spouse.name"]
        ? "Family (spouse)"
        : errors["family.spouse.cnic"]
          ? "Family (spouse CNIC)"
          : "Family"
    );
  }

  const jobs = Array.isArray(form.previousJobs) ? form.previousJobs : [];
  const incompleteJob = jobs.some((j) => {
    const started =
      filled(j?.companyName) ||
      filled(j?.designation) ||
      filled(j?.startDate) ||
      filled(j?.endDate) ||
      filled(j?.lastSalary) ||
      filled(j?.reasonForLeaving);
    if (!started) return false;
    return !(
      filled(j?.companyName) &&
      filled(j?.designation) &&
      filled(j?.startDate) &&
      filled(j?.reasonForLeaving)
    );
  });
  if (incompleteJob) {
    missing.push("Previous jobs (complete each added job)");
  }

  const docs = Array.isArray(form.documents) ? form.documents : [];
  if (!docs.some((d) => filled(d?.fileUrl))) {
    missing.push("Documents");
    errors.documents = "Upload at least one document";
  }
  if (!form.consent) {
    missing.push("Consent");
    errors.consent = "Please confirm the information is accurate";
  }

  if (errors.ntn && !missing.includes("Bank")) missing.push("Bank & tax (NTN)");

  return { missing, errors, ok: missing.length === 0 && Object.keys(errors).length === 0 };
}

const emptyForm = () => ({
  personal: {
    cnic: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    address: "",
    photoUrl: "",
  },
  emergencyContact: { name: "", phone: "", relationship: "", address: "" },
  bank: { bankName: "", accountTitle: "", accountNumber: "", iban: "" },
  ntn: "",
  family: {
    fatherName: "",
    motherName: "",
    spouse: { name: "", dob: "", cnic: "", occupation: "" },
    children: [],
  },
  previousJobs: [],
  documents: [],
  consent: false,
});

function toDateInput(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function hydrate(data) {
  const base = emptyForm();
  if (!data) return base;
  return {
    personal: {
      ...base.personal,
      ...(data.personal || {}),
      dateOfBirth: toDateInput(data.personal?.dateOfBirth),
      photoUrl: data.personal?.photoUrl || "",
    },
    emergencyContact: {
      ...base.emergencyContact,
      ...(data.emergencyContact || {}),
    },
    bank: { ...base.bank, ...(data.bank || {}) },
    ntn: data.ntn || "",
    family: {
      fatherName: data.family?.fatherName || "",
      motherName: data.family?.motherName || "",
      spouse: {
        name: data.family?.spouse?.name || "",
        dob: toDateInput(data.family?.spouse?.dob),
        cnic: data.family?.spouse?.cnic || "",
        occupation: data.family?.spouse?.occupation || "",
      },
      children: Array.isArray(data.family?.children)
        ? data.family.children.map((c) => ({
            name: c.name || "",
            dob: toDateInput(c.dob),
            gender: c.gender || "",
            _id: c._id,
          }))
        : [],
    },
    previousJobs:
      Array.isArray(data.previousJobs) && data.previousJobs.length
        ? data.previousJobs.map((j) => ({
            companyName: j.companyName || "",
            designation: j.designation || "",
            startDate: toDateInput(j.startDate),
            endDate: toDateInput(j.endDate),
            lastSalary: j.lastSalary ?? "",
            reasonForLeaving: j.reasonForLeaving || "",
            _id: j._id,
          }))
        : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    consent: Boolean(data.consent),
  };
}

export default function JoiningFormPage() {
  const { token } = useParams();
  const { data, isFetching, error, refetch } = useGetPublicJoiningQuery(token, {
    skip: !token,
  });
  const [saveDraft, { isLoading: saving }] = useSavePublicJoiningDraftMutation();
  const [submit, { isLoading: submitting }] = useSubmitPublicJoiningMutation();
  const [uploadFile, { isLoading: uploading }] =
    useUploadPublicJoiningFileMutation();

  const joining = data?.data;
  const [form, setForm] = useState(emptyForm);
  const [docType, setDocType] = useState("CNIC_PASSPORT");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (joining?.data) setForm(hydrate(joining.data));
  }, [joining]);

  const editable = Boolean(joining?.editable);
  const clearError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  const setPersonal = (k, v) => {
    clearError(`personal.${k}`);
    setForm((f) => ({ ...f, personal: { ...f.personal, [k]: v } }));
  };
  const setEmergency = (k, v) => {
    clearError(`emergency.${k}`);
    setForm((f) => ({
      ...f,
      emergencyContact: { ...f.emergencyContact, [k]: v },
    }));
  };
  const setBank = (k, v) => {
    clearError(`bank.${k}`);
    setForm((f) => ({ ...f, bank: { ...f.bank, [k]: v } }));
  };

  const payload = () => ({
    ...form,
    previousJobs: form.previousJobs.map((j) => ({
      ...j,
      lastSalary:
        j.lastSalary === "" || j.lastSalary == null
          ? null
          : Number(j.lastSalary),
    })),
  });

  const onSave = async () => {
    try {
      await saveDraft({ token, data: payload() }).unwrap();
      toast.success("Draft saved");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Save failed");
    }
  };

  const onSubmit = async () => {
    const { missing, errors: nextErrors, ok } = validateJoiningForm(form);
    setErrors(nextErrors);
    if (!ok || missing.length || Object.keys(nextErrors).length) {
      toast.error(
        missing.length
          ? `Please fix: ${missing.join(", ")}`
          : "Please fix the highlighted fields"
      );
      requestAnimationFrame(() => {
        document
          .querySelector(".border-red-400, .text-red-600")
          ?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      });
      return;
    }
    try {
      await submit({ token, data: payload() }).unwrap();
      toast.success("Submitted for HR review");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Submit failed");
    }
  };

  const onUpload = async (file, kind) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", kind);
    if (kind === "document") fd.append("documentType", docType);
    try {
      const res = await uploadFile({ token, formData: fd }).unwrap();
      if (res?.data?.data) setForm(hydrate(res.data.data));
      toast.success("Uploaded");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Upload failed");
    }
  };

  if (isFetching && !joining) {
    return (
      <div className={`${pub.pageCenter} text-sm text-slate-600`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (error || !joining) {
    return (
      <div className={pub.pageCenter}>
        <div className={`${pub.card} max-w-md text-center`}>
          <h1 className="text-lg font-semibold text-slate-900">
            Link unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {error?.data?.message ||
              "This joining link is no longer valid. Please open the latest email from HR, or ask them to resend the link."}
          </p>
        </div>
      </div>
    );
  }

  if (!editable) {
    return (
      <div className={pub.pageCenter}>
        <div className={`${pub.card} max-w-md text-center`}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
            ✓
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            {joining.status === "submitted"
              ? "Details submitted"
              : joiningStatusLabel(joining.status)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {joining.candidateName} · {joining.jobTitle}
          </p>
          {joining.reviewNote ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-sm text-amber-950">
              {joining.reviewNote}
            </p>
          ) : null}
          <p className="mt-4 text-xs font-medium text-slate-500">
            Link expires {formatRecDate(joining.expiresAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${pub.page} px-4 py-8`}>
      <div className="mx-auto max-w-3xl space-y-5">
        <header className={`${pub.card} !bg-[#0f172a] text-white`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
            {joining.companyName || "Joining details"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {joining.jobTitle || "Complete your details"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Hi {joining.candidateName || "there"} — all sections marked{" "}
            <span className="font-semibold text-amber-300">*</span> are required
            before submit. Link expires {formatRecDate(joining.expiresAt)}.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
            Status: {joiningStatusLabel(joining.status)}
          </p>
        </header>

        <section className={section}>
          <h2 className="text-sm font-semibold">
            Personal <span className="text-red-500">*</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <ReqLabel>CNIC</ReqLabel>
              <input
                className={fieldClass(errors["personal.cnic"])}
                required
                inputMode="numeric"
                placeholder="12345-1234567-1"
                maxLength={15}
                value={form.personal.cnic}
                onChange={(e) => setPersonal("cnic", formatCnicInput(e.target.value))}
              />
              <FieldError msg={errors["personal.cnic"]} />
            </div>
            <div>
              <ReqLabel>Gender</ReqLabel>
              <select
                className={fieldClass(errors["personal.gender"])}
                required
                value={form.personal.gender}
                onChange={(e) => setPersonal("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FieldError msg={errors["personal.gender"]} />
            </div>
            <div>
              <ReqLabel>Marital status</ReqLabel>
              <select
                className={fieldClass(errors["personal.maritalStatus"])}
                required
                value={form.personal.maritalStatus}
                onChange={(e) => setPersonal("maritalStatus", e.target.value)}
              >
                <option value="">Select status</option>
                {MARITAL_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FieldError msg={errors["personal.maritalStatus"]} />
            </div>
            <div>
              <ReqLabel>Blood group</ReqLabel>
              <select
                className={fieldClass(errors["personal.bloodGroup"])}
                required
                value={form.personal.bloodGroup}
                onChange={(e) => setPersonal("bloodGroup", e.target.value)}
              >
                <option value="">Select blood group</option>
                {BLOOD_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FieldError msg={errors["personal.bloodGroup"]} />
            </div>
            <div>
              <ReqLabel>Date of birth</ReqLabel>
              <input
                type="date"
                className={fieldClass(errors["personal.dateOfBirth"])}
                required
                value={form.personal.dateOfBirth}
                onChange={(e) => setPersonal("dateOfBirth", e.target.value)}
              />
              <FieldError msg={errors["personal.dateOfBirth"]} />
            </div>
            <div className="sm:col-span-2">
              <ReqLabel>Address</ReqLabel>
              <textarea
                className={fieldClass(errors["personal.address"])}
                rows={2}
                required
                value={form.personal.address}
                onChange={(e) => setPersonal("address", e.target.value)}
              />
              <FieldError msg={errors["personal.address"]} />
            </div>
            <div className="sm:col-span-2">
              <ReqLabel>Photo</ReqLabel>
              {form.personal.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.personal.photoUrl}
                  alt=""
                  className="mb-2 h-20 w-20 rounded-xl object-cover"
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  clearError("personal.photoUrl");
                  onUpload(e.target.files?.[0], "photo");
                }}
              />
              <FieldError msg={errors["personal.photoUrl"]} />
            </div>
          </div>
        </section>

        <section className={section}>
          <h2 className="text-sm font-semibold">
            Emergency contact <span className="text-red-500">*</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <ReqLabel>Name</ReqLabel>
              <input
                className={fieldClass(errors["emergency.name"])}
                required
                value={form.emergencyContact.name}
                onChange={(e) =>
                  setEmergency("name", formatNameInput(e.target.value))
                }
              />
              <FieldError msg={errors["emergency.name"]} />
            </div>
            <div>
              <ReqLabel>Phone</ReqLabel>
              <input
                className={fieldClass(errors["emergency.phone"])}
                required
                inputMode="tel"
                placeholder="03XXXXXXXXX"
                value={form.emergencyContact.phone}
                onChange={(e) =>
                  setEmergency("phone", formatPhoneInput(e.target.value))
                }
              />
              <FieldError msg={errors["emergency.phone"]} />
            </div>
            <div>
              <ReqLabel>Relationship</ReqLabel>
              <select
                className={fieldClass(errors["emergency.relationship"])}
                required
                value={form.emergencyContact.relationship}
                onChange={(e) => setEmergency("relationship", e.target.value)}
              >
                <option value="">Select relationship</option>
                {RELATIONSHIP_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FieldError msg={errors["emergency.relationship"]} />
            </div>
            <div>
              <ReqLabel>Address</ReqLabel>
              <input
                className={fieldClass(errors["emergency.address"])}
                required
                value={form.emergencyContact.address}
                onChange={(e) => setEmergency("address", e.target.value)}
              />
              <FieldError msg={errors["emergency.address"]} />
            </div>
          </div>
        </section>

        <section className={section}>
          <h2 className="text-sm font-semibold">
            Bank & tax <span className="text-red-500">*</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <ReqLabel>Bank name</ReqLabel>
              <input
                className={fieldClass(errors["bank.bankName"])}
                required
                value={form.bank.bankName}
                onChange={(e) => setBank("bankName", e.target.value)}
              />
              <FieldError msg={errors["bank.bankName"]} />
            </div>
            <div>
              <ReqLabel>Account title</ReqLabel>
              <input
                className={fieldClass(errors["bank.accountTitle"])}
                required
                value={form.bank.accountTitle}
                onChange={(e) =>
                  setBank("accountTitle", formatNameInput(e.target.value))
                }
              />
              <FieldError msg={errors["bank.accountTitle"]} />
            </div>
            <div>
              <ReqLabel>Account number</ReqLabel>
              <input
                className={fieldClass(errors["bank.accountNumber"])}
                required
                inputMode="numeric"
                placeholder="Digits only"
                value={form.bank.accountNumber}
                onChange={(e) =>
                  setBank(
                    "accountNumber",
                    e.target.value.replace(/\D/g, "").slice(0, 20)
                  )
                }
              />
              <FieldError msg={errors["bank.accountNumber"]} />
            </div>
            <div>
              <ReqLabel>IBAN</ReqLabel>
              <input
                className={fieldClass(errors["bank.iban"])}
                required
                placeholder="PK00XXXX0000000000000000"
                maxLength={24}
                value={form.bank.iban}
                onChange={(e) => setBank("iban", formatIbanInput(e.target.value))}
              />
              <FieldError msg={errors["bank.iban"]} />
            </div>
            <div>
              <label className={labelCls}>NTN</label>
              <input
                className={fieldClass(errors.ntn)}
                value={form.ntn}
                onChange={(e) => {
                  clearError("ntn");
                  setForm({
                    ...form,
                    ntn: e.target.value.replace(/[^A-Za-z0-9-]/g, "").slice(0, 20),
                  });
                }}
              />
              <FieldError msg={errors.ntn} />
            </div>
          </div>
        </section>

        <section className={section}>
          <h2 className="text-sm font-semibold">
            Family <span className="text-red-500">*</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <ReqLabel>Father&apos;s name</ReqLabel>
              <input
                className={fieldClass(errors["family.fatherName"])}
                required
                value={form.family.fatherName}
                onChange={(e) => {
                  clearError("family.fatherName");
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      fatherName: formatNameInput(e.target.value),
                    },
                  });
                }}
              />
              <FieldError msg={errors["family.fatherName"]} />
            </div>
            <div>
              <ReqLabel>Mother&apos;s name</ReqLabel>
              <input
                className={fieldClass(errors["family.motherName"])}
                required
                value={form.family.motherName}
                onChange={(e) => {
                  clearError("family.motherName");
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      motherName: formatNameInput(e.target.value),
                    },
                  });
                }}
              />
              <FieldError msg={errors["family.motherName"]} />
            </div>
          </div>
          <p className="pt-2 text-xs font-medium text-slate-600">
            Spouse
            {/married/i.test(String(form.personal.maritalStatus || "")) ? (
              <span className="text-red-500"> *</span>
            ) : (
              <span className="font-normal text-slate-500"> (if married)</span>
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              {/married/i.test(String(form.personal.maritalStatus || "")) ? (
                <ReqLabel>Name</ReqLabel>
              ) : (
                <label className={labelCls}>Name</label>
              )}
              <input
                className={fieldClass(errors["family.spouse.name"])}
                value={form.family.spouse.name}
                onChange={(e) => {
                  clearError("family.spouse.name");
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      spouse: {
                        ...form.family.spouse,
                        name: formatNameInput(e.target.value),
                      },
                    },
                  });
                }}
              />
              <FieldError msg={errors["family.spouse.name"]} />
            </div>
            <div>
              <label className={labelCls}>CNIC</label>
              <input
                className={fieldClass(errors["family.spouse.cnic"])}
                inputMode="numeric"
                placeholder="12345-1234567-1"
                maxLength={15}
                value={form.family.spouse.cnic}
                onChange={(e) => {
                  clearError("family.spouse.cnic");
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      spouse: {
                        ...form.family.spouse,
                        cnic: formatCnicInput(e.target.value),
                      },
                    },
                  });
                }}
              />
              <FieldError msg={errors["family.spouse.cnic"]} />
            </div>
            <div>
              <label className={labelCls}>Occupation</label>
              <input
                className={field}
                value={form.family.spouse.occupation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      spouse: {
                        ...form.family.spouse,
                        occupation: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div>
              <label className={labelCls}>Spouse DOB</label>
              <input
                type="date"
                className={field}
                value={form.family.spouse.dob}
                onChange={(e) =>
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      spouse: { ...form.family.spouse, dob: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs font-medium text-slate-600">Children</p>
            <button
              type="button"
              className="text-xs font-medium text-slate-800 underline"
              onClick={() =>
                setForm({
                  ...form,
                  family: {
                    ...form.family,
                    children: [
                      ...form.family.children,
                      { name: "", dob: "", gender: "" },
                    ],
                  },
                })
              }
            >
              Add child
            </button>
          </div>
          {form.family.children.map((c, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <div>
                <input
                  className={fieldClass(errors[`family.children.${i}.name`])}
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => {
                    clearError(`family.children.${i}.name`);
                    const children = [...form.family.children];
                    children[i] = {
                      ...children[i],
                      name: formatNameInput(e.target.value),
                    };
                    setForm({
                      ...form,
                      family: { ...form.family, children },
                    });
                  }}
                />
                <FieldError msg={errors[`family.children.${i}.name`]} />
              </div>
              <input
                type="date"
                className={field}
                value={c.dob}
                onChange={(e) => {
                  const children = [...form.family.children];
                  children[i] = { ...children[i], dob: e.target.value };
                  setForm({
                    ...form,
                    family: { ...form.family, children },
                  });
                }}
              />
              <select
                className={fieldClass(errors[`family.children.${i}.gender`])}
                value={c.gender}
                onChange={(e) => {
                  clearError(`family.children.${i}.gender`);
                  const children = [...form.family.children];
                  children[i] = { ...children[i], gender: e.target.value };
                  setForm({
                    ...form,
                    family: { ...form.family, children },
                  });
                }}
              >
                <option value="">Gender</option>
                {GENDER_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-red-700"
                onClick={() =>
                  setForm({
                    ...form,
                    family: {
                      ...form.family,
                      children: form.family.children.filter((_, idx) => idx !== i),
                    },
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className={section}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Previous employment</h2>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
              onClick={() =>
                setForm({
                  ...form,
                  previousJobs: [...form.previousJobs, emptyJob()],
                })
              }
            >
              Add job
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Optional — skip if this is your first job. Click &quot;Add job&quot;
            only if you have past employment.
          </p>
          {!form.previousJobs.length ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
              No previous employment added.
            </p>
          ) : (
            form.previousJobs.map((j, i) => (
              <div
                key={i}
                className="space-y-2 rounded-xl border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">
                    Job {i + 1}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-medium text-red-700 underline"
                    onClick={() => {
                      setForm({
                        ...form,
                        previousJobs: form.previousJobs.filter(
                          (_, idx) => idx !== i
                        ),
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    ["companyName", "Company", true],
                    ["designation", "Designation", true],
                    ["startDate", "Start", true, "date"],
                    ["endDate", "End", false, "date"],
                    ["lastSalary", "Last salary", false, "number"],
                    ["reasonForLeaving", "Reason for leaving", true],
                  ].map(([k, l, req, type]) => (
                    <div key={k}>
                      {req ? (
                        <ReqLabel>{l}</ReqLabel>
                      ) : (
                        <label className={labelCls}>{l}</label>
                      )}
                      <input
                        type={type || "text"}
                        className={field}
                        value={j[k]}
                        onChange={(e) => {
                          const previousJobs = [...form.previousJobs];
                          previousJobs[i] = {
                            ...previousJobs[i],
                            [k]: e.target.value,
                          };
                          setForm({ ...form, previousJobs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <section className={section}>
          <h2 className="text-sm font-semibold">
            Documents <span className="text-red-500">*</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload at least one document (e.g. CNIC / CV).
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select
                className={field}
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {JOINING_DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="file"
              disabled={uploading}
              onChange={(e) => {
                clearError("documents");
                onUpload(e.target.files?.[0], "document");
              }}
            />
          </div>
          {form.documents?.length ? (
            <ul className="space-y-1 text-sm text-slate-700">
              {form.documents.map((d, i) => (
                <li key={i}>
                  {d.documentType}: {d.fileName || d.fileUrl}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-red-600">No documents uploaded yet.</p>
          )}
          <FieldError msg={errors.documents} />
        </section>

        <section className={section}>
          <label className="flex items-start gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.consent}
              onChange={(e) => {
                clearError("consent");
                setForm({ ...form, consent: e.target.checked });
              }}
            />
            <span>
              I confirm the information provided is accurate to the best of my
              knowledge. <span className="text-red-500">*</span>
            </span>
          </label>
          <FieldError msg={errors.consent} />
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={saving || uploading}
              onClick={onSave}
              className={pub.secondaryBtn}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save draft
            </button>
            <button
              type="button"
              disabled={submitting || uploading}
              onClick={onSubmit}
              className={pub.primaryBtn}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit for HR review
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
