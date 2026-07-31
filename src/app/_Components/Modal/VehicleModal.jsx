"use client";

import { useMemo, useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { Car, Film, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} from "@/app/_Services/vehicle/page";
import { useGetVendorsQuery } from "@/app/_Services/vendor/page";
import { vehicleSchema } from "@/app/schema/vehicle";
import { fleet } from "../fleet/fleetTheme";

const Field = ({ label, name, required, children, className = "" }) => (
  <div className={className}>
    <label className={fleet.modalLabel}>
      {label}
      {required && <span className="text-white"> *</span>}
    </label>
    {children}
    {name && (
      <ErrorMessage name={name} component="p" className="text-red-400 text-[11px] mt-1" />
    )}
  </div>
);

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#161b22",
    borderColor: state.isFocused ? "rgba(161,161,170,0.8)" : "rgba(255,255,255,0.1)",
    boxShadow: "none",
    borderRadius: 12,
    minHeight: 42,
  }),
  menu: (base) => ({ ...base, background: "#161b22", zIndex: 50 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "#1c2330" : "#161b22",
    color: "#fff",
    fontSize: 13,
  }),
  singleValue: (base) => ({ ...base, color: "#fff", fontSize: 13 }),
  input: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "#71717a", fontSize: 13 }),
};

const VehicleModal = ({ isOpen, closeModal, data, defaultVendorId }) => {
  const [createVehicle] = useCreateVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const [vendorSearch, setVendorSearch] = useState("");
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const isEdit = !!data;

  const { data: vendorsData } = useGetVendorsQuery({
    page: 1,
    limit: 50,
    search: vendorSearch || undefined,
    status: "active",
  });

  const vendorOptions = useMemo(() => {
    const items = vendorsData?.data?.items || [];
    const opts = items.map((v) => ({
      value: v._id,
      label: `${v.companyName} — ${v.vendorName}`,
    }));
    if (data?.vendor) {
      const id = data.vendor._id || data.vendor;
      const label = data.vendor.companyName
        ? `${data.vendor.companyName} — ${data.vendor.vendorName || ""}`
        : "Current vendor";
      if (!opts.some((o) => o.value === id)) opts.unshift({ value: id, label });
    }
    return opts;
  }, [vendorsData, data]);

  const initialValues = useMemo(
    () => ({
      vendor: data?.vendor?._id || data?.vendor || defaultVendorId || "",
      vehicleName: data?.vehicleName || "",
      make: data?.make || "",
      model: data?.model || "",
      year: data?.year || "",
      rentAmount: data?.rentAmount ?? "",
      registrationNumber: data?.registrationNumber || "",
      chassisNumber: data?.chassisNumber || "",
      engineNumber: data?.engineNumber || "",
      color: data?.color || "",
      fuelType: data?.fuelType || "",
      transmission: data?.transmission || "",
      seatingCapacity: data?.seatingCapacity || "",
      mileage: data?.mileage ?? "",
      status: data?.status || "available",
      notes: data?.notes || "",
      images: [],
      videos: [],
    }),
    [data, defaultVendorId]
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const hasFiles =
        (values.images?.length || 0) > 0 || (values.videos?.length || 0) > 0;
      let response;
      if (isEdit && !hasFiles) {
        const { images, videos, ...body } = values;
        response = await updateVehicle({ id: data._id, body }).unwrap();
      } else {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
          if (k === "images" || k === "videos") return;
          if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });
        (values.images || []).forEach((f) => fd.append("images", f));
        (values.videos || []).forEach((f) => fd.append("videos", f));
        response = isEdit
          ? await updateVehicle({ id: data._id, body: fd }).unwrap()
          : await createVehicle(fd).unwrap();
      }
      toast.success(response?.message || (isEdit ? "Vehicle updated" : "Vehicle created"));
      resetForm();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={fleet.modalOverlay}>
        <motion.div className="absolute inset-0" onClick={closeModal} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${fleet.modalPanel} max-w-4xl`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
            <h2 className={fleet.modalTitle}>{isEdit ? "Edit Vehicle" : "Add Vehicle"}</h2>
            <button type="button" onClick={closeModal} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          <Formik initialValues={initialValues} validationSchema={vehicleSchema} enableReinitialize onSubmit={handleSubmit}>
            {({ values, setFieldValue, isSubmitting, handleChange, handleBlur }) => (
              <Form className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar-dark">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-[#1c2330] border border-white/10 flex items-center justify-center shrink-0">
                    <Car className="w-7 h-7 text-zinc-500" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => imageRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-zinc-200 px-3 py-2 text-xs font-semibold hover:bg-white/15"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Photos
                        </button>
                        <button
                          type="button"
                          onClick={() => videoRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-zinc-200 px-3 py-2 text-xs font-semibold hover:bg-white/15"
                        >
                          <Film className="w-3.5 h-3.5" /> Upload Videos
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1.5">
                        Photos: JPG, PNG, WebP · Videos: MP4, WebM, MOV
                      </p>
                      <input
                        ref={imageRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          setFieldValue("images", Array.from(e.target.files || []))
                        }
                      />
                      <input
                        ref={videoRef}
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          setFieldValue("videos", Array.from(e.target.files || []))
                        }
                      />
                      {(values.images?.length > 0 || values.videos?.length > 0) && (
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {[
                            values.images?.length > 0 &&
                              `${values.images.length} photo(s)`,
                            values.videos?.length > 0 &&
                              `${values.videos.length} video(s)`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}{" "}
                          selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Field label="Vendor" name="vendor" required>
                  <Select
                    options={vendorOptions}
                    value={vendorOptions.find((o) => o.value === values.vendor) || null}
                    onChange={(opt) => setFieldValue("vendor", opt?.value || "")}
                    onInputChange={(val) => setVendorSearch(val)}
                    placeholder="Search vendor..."
                    isClearable
                    styles={selectStyles}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <Field label="Vehicle Name" name="vehicleName" required>
                    <input name="vehicleName" value={values.vehicleName} onChange={handleChange} onBlur={handleBlur} placeholder="Toyota Camry 2022" className={fleet.modalInput} />
                  </Field>
                  <Field label="Registration Number" name="registrationNumber" required>
                    <input name="registrationNumber" value={values.registrationNumber} onChange={handleChange} onBlur={handleBlur} placeholder="ABC-1234" className={fleet.modalInput} />
                  </Field>
                  <Field label="Make" name="make">
                    <input name="make" value={values.make} onChange={handleChange} onBlur={handleBlur} placeholder="Toyota" className={fleet.modalInput} />
                  </Field>
                  <Field label="Model" name="model">
                    <input name="model" value={values.model} onChange={handleChange} onBlur={handleBlur} placeholder="Camry" className={fleet.modalInput} />
                  </Field>
                  <Field label="Year" name="year">
                    <input name="year" type="number" value={values.year} onChange={handleChange} onBlur={handleBlur} placeholder="2022" className={fleet.modalInput} />
                  </Field>
                  <Field label="Color" name="color">
                    <input name="color" value={values.color} onChange={handleChange} onBlur={handleBlur} placeholder="White" className={fleet.modalInput} />
                  </Field>
                  <Field label="Chassis / VIN" name="chassisNumber">
                    <input name="chassisNumber" value={values.chassisNumber} onChange={handleChange} onBlur={handleBlur} placeholder="VIN number" className={fleet.modalInput} />
                  </Field>
                  <Field label="Engine Number" name="engineNumber">
                    <input name="engineNumber" value={values.engineNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Engine no." className={fleet.modalInput} />
                  </Field>
                  <Field label="Fuel Type" name="fuelType">
                    <select name="fuelType" value={values.fuelType} onChange={handleChange} className={fleet.modalSelect}>
                      <option value="">Select</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                      <option value="cng">CNG</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Transmission" name="transmission">
                    <select name="transmission" value={values.transmission} onChange={handleChange} className={fleet.modalSelect}>
                      <option value="">Select</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Seating Capacity" name="seatingCapacity">
                    <input name="seatingCapacity" type="number" value={values.seatingCapacity} onChange={handleChange} onBlur={handleBlur} placeholder="5" className={fleet.modalInput} />
                  </Field>
                  <Field label="Rent Amount" name="rentAmount">
                    <input name="rentAmount" type="number" value={values.rentAmount} onChange={handleChange} onBlur={handleBlur} placeholder="0" className={fleet.modalInput} />
                  </Field>
                  {!isEdit && (
                    <Field label="Initial Mileage" name="mileage">
                      <input name="mileage" type="number" value={values.mileage} onChange={handleChange} onBlur={handleBlur} placeholder="0" className={fleet.modalInput} />
                    </Field>
                  )}
                  <Field label="Status" name="status" required>
                    <select name="status" value={values.status} onChange={handleChange} className={fleet.modalSelect}>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Notes" name="notes">
                      <textarea name="notes" rows={3} value={values.notes} onChange={handleChange} onBlur={handleBlur} className={`${fleet.modalInput} resize-none`} placeholder="Optional notes..." />
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-60">
                    {isSubmitting ? "Saving..." : isEdit ? "Update Vehicle" : "Add Vehicle"}
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

export default VehicleModal;
