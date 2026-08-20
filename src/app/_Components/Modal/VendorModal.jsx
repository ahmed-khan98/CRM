"use client";

import { memo, useMemo, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from "@/app/_Services/vendor/page";
import { vendorSchema } from "@/app/schema/vendor";
import { fleet } from "../fleet/fleetTheme";

const Field = ({ label, name, required, children }) => (
  <div>
    <label className={fleet.modalLabel}>
      {label}
      {required && <span className="text-white"> *</span>}
    </label>
    {children}
    <ErrorMessage name={name} component="p" className="text-red-400 text-[11px] mt-1" />
  </div>
);

const VendorModal = ({ isOpen, closeModal, data }) => {
  const [createVendor] = useCreateVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const fileRef = useRef(null);
  const isEdit = !!data;

  const initialValues = useMemo(
    () => ({
      companyName: data?.companyName || "",
      vendorName: data?.vendorName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      emergencyPhone: data?.emergencyPhone || "",
      address: data?.address || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "",
      postalCode: data?.postalCode || "",
      taxNumber: data?.taxNumber || "",
      registrationNumber: data?.registrationNumber || "",
      status: data?.status || "active",
      notes: data?.notes || "",
      profilePicture: data?.profilePicture?.url || data?.profilePicture || null,
    }),
    [data]
  );

  const previewUrl = (v) => {
    if (!v) return null;
    if (v instanceof File) return URL.createObjectURL(v);
    if (typeof v === "string") return v;
    return v?.url || null;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const hasNewFile = values.profilePicture instanceof File;
      let response;
      if (isEdit && !hasNewFile) {
        const { profilePicture, ...body } = values;
        response = await updateVendor({ id: data._id, body }).unwrap();
      } else {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
          if (k === "profilePicture") return;
          if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });
        if (hasNewFile) fd.append("profilePicture", values.profilePicture);
        response = isEdit
          ? await updateVendor({ id: data._id, body: fd }).unwrap()
          : await createVendor(fd).unwrap();
      }
      toast.success(response?.message || (isEdit ? "Vendor updated" : "Vendor created"));
      resetForm();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save vendor");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={fleet.modalOverlay}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          onClick={closeModal}
        />
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={fleet.modalPanel}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
            <h2 className={fleet.modalTitle}>{isEdit ? "Edit Vendor" : "Add Vendor"}</h2>
            <button
              type="button"
              onClick={closeModal}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={vendorSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, handleChange, handleBlur }) => (
              <Form className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar-dark">
                <div className="flex items-center gap-4 pb-2">
                  <div className="h-16 w-16 rounded-full bg-[#1c2330] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {previewUrl(values.profilePicture) ? (
                      <img
                        src={previewUrl(values.profilePicture)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-zinc-200 px-3 py-2 text-xs font-semibold hover:bg-white/15"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </button>
                    <p className="text-[11px] text-zinc-500 mt-1.5">
                      JPG, PNG, WebP up to 5MB
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("profilePicture", e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <Field label="Company Name" name="companyName" required>
                    <input name="companyName" value={values.companyName} onChange={handleChange} onBlur={handleBlur} placeholder="Acme Logistics" className={fleet.modalInput} />
                  </Field>
                  <Field label="Vendor Name" name="vendorName" required>
                    <input name="vendorName" value={values.vendorName} onChange={handleChange} onBlur={handleBlur} placeholder="John Smith" className={fleet.modalInput} />
                  </Field>
                  <Field label="Email" name="email" required>
                    <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="contact@acme.com" className={fleet.modalInput} />
                  </Field>
                  <Field label="Phone" name="phone" required>
                    <input name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+92 300 1234567" className={fleet.modalInput} />
                  </Field>
                  <Field label="Alternate Phone" name="emergencyPhone">
                    <input name="emergencyPhone" value={values.emergencyPhone} onChange={handleChange} onBlur={handleBlur} placeholder="+92 300 7654321" className={fleet.modalInput} />
                  </Field>
                  <Field label="Status" name="status" required>
                    <select name="status" value={values.status} onChange={handleChange} className={fleet.modalSelect}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Address" name="address" required>
                      <input name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} placeholder="Street address" className={fleet.modalInput} />
                    </Field>
                  </div>
                  <Field label="City" name="city" required>
                    <input name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} placeholder="Lahore" className={fleet.modalInput} />
                  </Field>
                  <Field label="State" name="state" required>
                    <input name="state" value={values.state} onChange={handleChange} onBlur={handleBlur} placeholder="Punjab" className={fleet.modalInput} />
                  </Field>
                  <Field label="Country" name="country" required>
                    <input name="country" value={values.country} onChange={handleChange} onBlur={handleBlur} placeholder="Pakistan" className={fleet.modalInput} />
                  </Field>
                  <Field label="Postal Code" name="postalCode" required>
                    <input name="postalCode" value={values.postalCode} onChange={handleChange} onBlur={handleBlur} placeholder="54000" className={fleet.modalInput} />
                  </Field>
                  <Field label="Tax Number" name="taxNumber">
                    <input name="taxNumber" value={values.taxNumber} onChange={handleChange} onBlur={handleBlur} placeholder="TAX-001" className={fleet.modalInput} />
                  </Field>
                  <Field label="Registration Number" name="registrationNumber">
                    <input name="registrationNumber" value={values.registrationNumber} onChange={handleChange} onBlur={handleBlur} placeholder="REG-001" className={fleet.modalInput} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Notes" name="notes">
                      <textarea name="notes" rows={3} value={values.notes} onChange={handleChange} onBlur={handleBlur} placeholder="Optional notes..." className={`${fleet.modalInput} resize-none`} />
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 pb-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : isEdit ? "Update Vendor" : "Add Vendor"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default memo(VendorModal);
