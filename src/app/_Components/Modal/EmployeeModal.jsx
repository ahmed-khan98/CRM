"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, User, Upload, Trash2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/_Services/employee/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useEffect, useRef } from "react";
import { empSchema } from "@/app/schema/employee";
import FormikSelect from "./formikSelect";

const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 rounded-[10px] text-[13px] font-medium bg-white/[0.04] border text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/25 transition-colors duration-150 ${
    hasError ? "border-red-500/50" : "border-white/10"
  }`;

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-black tracking-[0.12em] uppercase mb-1.5 text-zinc-500">
    {children}
  </label>
);

const ErrMsg = ({ name }) => (
  <ErrorMessage
    name={name}
    component="p"
    className="text-[11px] mt-1 font-medium text-red-400"
  />
);

const EmployeeModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const { data: departments } = useAllDepartmentsQuery();
  const isEdit = !!data;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("fullName", values?.fullName);
      payload.append("password", values?.password);
      payload.append("email", values?.email);
      payload.append("joiningDate", values?.joiningDate);
      payload.append("address", values?.address);
      payload.append("departmentId", values?.departmentId);
      payload.append("role", values?.role);
      payload.append("CNIC", values?.CNIC);
      payload.append("phoneNo", values?.phoneNo);
      payload.append("designation", values?.designation);

      const response = await (isEdit
        ? updateEmployee(
            typeof values?.image === "string"
              ? {
                  body: {
                    fullName: values?.fullName,
                    email: values?.email,
                    joiningDate: values?.joiningDate,
                    address: values?.address,
                    departmentId: values?.departmentId,
                    CNIC: values?.CNIC,
                    role: values?.role,
                    phoneNo: values?.phoneNo,
                    designation: values?.designation,
                  },
                  id: data?._id,
                }
              : { id: data?._id, body: payload },
          ).unwrap()
        : createEmployee(payload).unwrap());

      if (response.success) {
        toast.success(isEdit ? "Employee updated successfully!" : "Employee created successfully!");
      } else {
        toast.error(response.message || "Failed to process Employee");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to create employee");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    departmentId: data?.departmentId?._id || "",
    joiningDate: data?.joiningDate?.split("T")[0] || "",
    fullName: data?.fullName || "",
    designation: data?.designation || "",
    email: data?.email || "",
    CNIC: data?.CNIC || "",
    status: data?.status || "",
    role: data?.role || "USER",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
    image: data?.image || "",
    isEdit: !!data,
  };

  const roleOption = [
    { name: "User", value: "USER" },
    { name: "Department Admin", value: "SUBADMIN" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/75 backdrop-blur-md"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden rounded-[20px] bg-zinc-950 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/25 to-white/[0.06]" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/10 flex-shrink-0">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase text-zinc-600">
                    {isEdit ? "Edit Record" : "New Record"}
                  </p>
                  <h2 className="text-base font-black text-zinc-100">
                    {isEdit ? "Edit Employee" : "Add New Employee"}
                  </h2>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <Formik
                initialValues={initialValues}
                validationSchema={empSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting, values, setFieldValue, setFieldTouched }) => {
                  const deptOptions = departments?.data?.map((d) => ({ value: d?._id, label: d?.name })) ?? [];
                  const roleOptions = roleOption?.map((d) => ({ value: d?.value, label: d?.name })) ?? [];

                  const fileInputRef1 = useRef(null);

                  const handleMainImageUpload = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFieldValue("image", file);
                  };

                  const handleDeleteMainImage = () => setFieldValue("image", "");

                  const previewSrc =
                    values.image instanceof File
                      ? URL.createObjectURL(values.image)
                      : values.image || null;

                  useEffect(() => {
                    return () => {
                      if (values?.image instanceof File && previewSrc) {
                        URL.revokeObjectURL(previewSrc);
                      }
                    };
                  }, [previewSrc, values?.image]);

                  return (
                    <Form className="space-y-5">
                      <input
                        type="file"
                        ref={fileInputRef1}
                        onChange={handleMainImageUpload}
                        className="hidden"
                        accept="image/*"
                      />

                      {/* Avatar upload */}
                      <div className="flex justify-center py-2">
                        <div className="relative">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef1.current?.click()}
                            className={`w-24 h-24 rounded-full cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-150
                              ${previewSrc
                                ? "ring-2 ring-white/15"
                                : "border-2 border-dashed border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
                              }`}
                          >
                            {previewSrc ? (
                              <img src={previewSrc} alt="Employee" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-5 h-5 text-zinc-600" />
                                <span className="text-[10px] font-bold text-center px-2 text-zinc-600">
                                  Upload Photo
                                </span>
                              </div>
                            )}
                          </div>
                          <ErrMsg name="image" />
                          {previewSrc && (
                            <button
                              type="button"
                              onClick={handleDeleteMainImage}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer bg-red-500/90 border-2 border-zinc-950"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/[0.06]" />

                      {/* Row 1 — Department + Joining Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormikSelect
                            name="departmentId"
                            label="Select Department"
                            options={deptOptions}
                            value={values.departmentId}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.departmentId}
                            touched={touched.departmentId}
                            placeholder="Select Department"
                          />
                        </div>
                        <div>
                          <FieldLabel>
                            <Calendar className="inline w-3 h-3 mr-1" />
                            Joining Date
                          </FieldLabel>
                          <Field name="joiningDate">
                            {({ field }) => (
                              <input {...field} type="date" className={inputClass(errors.joiningDate && touched.joiningDate)} />
                            )}
                          </Field>
                          <ErrMsg name="joiningDate" />
                        </div>
                      </div>

                      {/* Row 2 — Full Name */}
                      <div>
                        <FieldLabel>Full Name</FieldLabel>
                        <Field name="fullName">
                          {({ field }) => (
                            <input {...field} type="text" placeholder="John Smith" className={inputClass(errors.fullName && touched.fullName)} />
                          )}
                        </Field>
                        <ErrMsg name="fullName" />
                      </div>

                      {/* Row 3 — Email + Designation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel>Email</FieldLabel>
                          <Field name="email">
                            {({ field }) => (
                              <input {...field} type="email" placeholder="example@gmail.com" className={inputClass(errors.email && touched.email)} />
                            )}
                          </Field>
                          <ErrMsg name="email" />
                        </div>
                        <div>
                          <FieldLabel>Designation</FieldLabel>
                          <Field name="designation">
                            {({ field }) => (
                              <input {...field} type="text" placeholder="e.g. Senior Developer" className={inputClass(errors.designation && touched.designation)} />
                            )}
                          </Field>
                          <ErrMsg name="designation" />
                        </div>
                      </div>

                      {/* Row 4 — CNIC + Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel>CNIC</FieldLabel>
                          <Field name="CNIC">
                            {({ field }) => (
                              <input {...field} type="text" placeholder="40000-1234567-8" className={inputClass(errors.CNIC && touched.CNIC)} />
                            )}
                          </Field>
                          <ErrMsg name="CNIC" />
                        </div>
                        <div>
                          <FieldLabel>Phone No.</FieldLabel>
                          <Field name="phoneNo">
                            {({ field }) => (
                              <input {...field} type="text" placeholder="0300-1234567" className={inputClass(errors.phoneNo && touched.phoneNo)} />
                            )}
                          </Field>
                          <ErrMsg name="phoneNo" />
                        </div>
                      </div>

                      {/* Row 5 — Password + Role */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isEdit && (
                          <div>
                            <FieldLabel>Password</FieldLabel>
                            <Field name="password">
                              {({ field }) => (
                                <input {...field} type="text" placeholder="••••••••" className={inputClass(errors.password && touched.password)} />
                              )}
                            </Field>
                            <ErrMsg name="password" />
                          </div>
                        )}
                        <div className={isEdit ? "md:col-span-2" : ""}>
                          <FormikSelect
                            name="role"
                            label="Select User Role"
                            options={roleOptions}
                            value={values.role}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.role}
                            touched={touched.role}
                            placeholder="User, Sub Admin"
                          />
                        </div>
                      </div>

                      {/* Row 6 — Address */}
                      <div>
                        <FieldLabel>Address</FieldLabel>
                        <Field name="address">
                          {({ field }) => (
                            <textarea
                              {...field}
                              rows={3}
                              placeholder="Full address..."
                              className={`${inputClass(false)} resize-none leading-relaxed`}
                            />
                          )}
                        </Field>
                        <ErrMsg name="address" />
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/[0.06]" />

                      {/* Action Buttons */}
                      <div className="flex gap-3 pb-1">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={closeModal}
                          className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 bg-white/[0.04] border border-white/[0.08] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300"
                        >
                          Cancel
                        </motion.button>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all duration-150 bg-white text-zinc-950 border border-white/90 shadow-[0_2px_16px_rgba(255,255,255,0.1)] hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </span>
                          ) : isEdit ? "Save Changes" : "Add Employee"}
                        </motion.button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeModal;