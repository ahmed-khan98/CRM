"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/app/_Services/authentication/page";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Save,
  CheckCircle,
  Loader2,
  Calendar,
  Building,
  IdCard,
  ShieldUser,
  Pencil,
  X,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tab from "@/app/_Components/Tab/page";
import { myAccountTabs } from "@/app/utilities/tabs/page";
import { formatPhoneNumber } from "@/app/utilities/phoneFormat";

const MAX_AVATAR_MB = 5;

function mergeCurrentUser(updated) {
  let prev = {};
  try {
    prev = JSON.parse(Cookies.get("currentuser") || "{}") || {};
  } catch {
    prev = {};
  }
  const next = { ...prev, ...updated };
  Cookies.set("currentuser", JSON.stringify(next), {
    expires: 7,
    secure: true,
  });
  return next;
}

function Field({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  disabled,
  editable,
  type = "text",
  placeholder,
}) {
  const locked = disabled || !editable;
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
        <Icon size={13} className="text-zinc-500" />
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={locked}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 focus:outline-none focus:ring-1 ${
          locked
            ? "cursor-default border-[#27272a] bg-[#0c0c0c] text-zinc-400"
            : "border-[#3f3f46] bg-[#121212] text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-zinc-500/30"
        }`}
      />
    </div>
  );
}

const ProfilePage = () => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [updateAvatar, { isLoading: uploadingAvatar }] = useUpdateAvatarMutation();
  const fileInputRef = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    CNIC: "",
    designation: "",
    department: "",
    joiningDate: "",
    image: "",
  });

  useEffect(() => {
    const data = Cookies.get("currentuser");
    if (!data) return;
    try {
      const user = JSON.parse(data);
      const joinRaw = user?.joiningDate;
      setFormData({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        CNIC: user?.CNIC || "",
        designation: user?.designation || "",
        department: user?.departmentId?.name || "",
        joiningDate: joinRaw ? String(joinRaw).split("T")[0] : "",
        image: user?.image || "",
      });
    } catch {
      // corrupt cookie — leave empty form
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_AVATAR_MB} MB`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(localPreview);

    try {
      const res = await updateAvatar(file).unwrap();
      if (res.success) {
        const user = mergeCurrentUser(res.data);
        setFormData((prev) => ({
          ...prev,
          image: user?.image || res.data?.image || "",
          department: user?.departmentId?.name || prev.department,
        }));
        toast.success("Profile picture updated");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Could not update picture");
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        const user = mergeCurrentUser(res.data);
        setFormData((prev) => ({
          ...prev,
          fullName: user?.fullName || prev.fullName,
          phoneNo: user?.phoneNo || prev.phoneNo,
          CNIC: user?.CNIC || prev.CNIC,
          image: user?.image || prev.image,
          department: user?.departmentId?.name || prev.department,
        }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setIsEditable(false);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const initials = (formData.fullName || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = previewUrl || formData.image || "";

  return (
    <div className="min-h-0 flex-1 pb-6">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-5xl space-y-4 px-1 sm:px-2">
        <Tab tabs={myAccountTabs} variant="dark" />

        <div className="px-0.5">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            My Account
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage your profile photo and personal details
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-xl"
        >
          {/* Banner */}
          <div className="relative h-28 bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#050505] sm:h-32">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />
          </div>

          {/* Identity row */}
          <div className="relative px-4 pb-5 sm:px-6">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <div className="h-[88px] w-[88px] overflow-hidden rounded-2xl border-2 border-[#0a0a0a] bg-[#121212] shadow-lg ring-1 ring-white/10 sm:h-24 sm:w-24">
                    {avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarSrc}
                        alt={formData.fullName || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xl font-semibold text-zinc-400">
                        {initials || <User size={28} />}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAvatarPick}
                    disabled={uploadingAvatar}
                    aria-label="Update profile picture"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-200 shadow-md transition hover:bg-zinc-700 disabled:opacity-60"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-xl font-semibold capitalize tracking-tight text-zinc-100">
                    {formData.fullName || "Your name"}
                  </h2>
                  <p className="mt-0.5 truncate text-sm text-zinc-500">
                    {formData.email || "—"}
                  </p>
                  {(formData.designation || formData.department) && (
                    <p className="mt-1.5 truncate text-xs text-zinc-400">
                      {[formData.designation, formData.department]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditable(!isEditable)}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                  isEditable
                    ? "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    : "border-white/[0.08] bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1]"
                }`}
              >
                {isEditable ? (
                  <>
                    <X size={14} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil size={14} />
                    Edit profile
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-2 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 sm:mx-6"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-sm text-emerald-300">
                    Profile updated successfully
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 border-t border-white/[0.06] px-4 py-5 sm:px-6 sm:py-6"
          >
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-4 w-0.5 rounded-full bg-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Personal information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  icon={User}
                  label="Full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  editable={isEditable}
                  placeholder="Your full name"
                />
                <Field
                  icon={IdCard}
                  label="CNIC"
                  name="CNIC"
                  value={formData.CNIC}
                  onChange={handleChange}
                  editable={isEditable}
                  placeholder="XXXXX-XXXXXXX-X"
                />
                <Field
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  editable={isEditable}
                  placeholder="you@company.com"
                />
                <Field
                  icon={Phone}
                  label="Phone"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      phoneNo: formatPhoneNumber(e.target.value),
                    }));
                  }}
                  editable={isEditable}
                  placeholder="+92 …"
                />
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-4 w-0.5 rounded-full bg-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Work details
                </h3>
                <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                  Read only
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  icon={ShieldUser}
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  editable={false}
                  disabled
                />
                <Field
                  icon={Building}
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  editable={false}
                  disabled
                />
                <Field
                  icon={Calendar}
                  label="Joining date"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  editable={false}
                  disabled
                />
              </div>
            </section>

            <AnimatePresence>
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex justify-end border-t border-white/[0.06] pt-4"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save changes
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
