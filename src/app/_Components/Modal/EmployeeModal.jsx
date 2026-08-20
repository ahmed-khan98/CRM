"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Upload, Trash2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/_Services/employee/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useEffect, useRef } from "react";
import {
  empSchema,
  GENDER_OPTIONS,
  MARITAL_OPTIONS,
  BLOOD_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/app/schema/employee";
import FormikSelect from "./formikSelect";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const inputClass = (hasError) =>
  `${fleet.modalInput} ${hasError ? "border-red-500/50" : ""}`;

const FieldLabel = ({ children }) => (
  <label className={fleet.modalLabel}>{children}</label>
);

const ErrMsg = ({ name }) => (
  <ErrorMessage
    name={name}
    component="p"
    className="text-[11px] mt-1 font-medium text-red-400"
  />
);

const SectionTitle = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500 pt-2">
    {children}
  </p>
);

const emptyEmergency = () => ({
  name: "",
  phone: "",
  relationship: "",
  address: "",
});

const dateOnly = (v) => (v ? String(v).split("T")[0] : "");

/** HTML time inputs only accept 00:00–23:59. Midnight stored as 24:00 must be mapped. */
const toTimeInputValue = (v) => {
  if (!v) return "";
  const s = String(v).trim();
  const match = s.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  if (hour === 24 && minute === "00") return "00:00";
  if (hour > 23 || Number(minute) > 59) return "";
  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const appendHrmsFields = (payload, values) => {
  if (values.dateOfBirth) payload.append("dateOfBirth", values.dateOfBirth);
  if (values.gender) payload.append("gender", values.gender);
  if (values.maritalStatus) payload.append("maritalStatus", values.maritalStatus);
  if (values.bloodGroup) payload.append("bloodGroup", values.bloodGroup);
  if (values.employmentType) payload.append("employmentType", values.employmentType);
  if (values.currentSalary !== "" && values.currentSalary != null) {
    payload.append("currentSalary", values.currentSalary);
  }
  if (values.bankName) payload.append("bankName", values.bankName);
  if (values.accountTitle) payload.append("accountTitle", values.accountTitle);
  if (values.accountNumber) payload.append("accountNumber", values.accountNumber);
  if (values.iban) payload.append("iban", values.iban);
  if (values.ntn) payload.append("ntn", values.ntn);
  if (values.shiftStart) payload.append("shiftStart", values.shiftStart);
  if (values.shiftEnd) payload.append("shiftEnd", values.shiftEnd);
  payload.append("emergencyContact", JSON.stringify(values.emergencyContact || {}));
};

const hrmsJsonBody = (values) => ({
  dateOfBirth: values.dateOfBirth || undefined,
  gender: values.gender || "",
  maritalStatus: values.maritalStatus || "",
  bloodGroup: values.bloodGroup || "",
  employmentType: values.employmentType || "",
  currentSalary:
    values.currentSalary === "" || values.currentSalary == null
      ? undefined
      : Number(values.currentSalary),
  bankName: values.bankName || "",
  accountTitle: values.accountTitle || "",
  accountNumber: values.accountNumber || "",
  iban: values.iban || "",
  ntn: values.ntn || "",
  shiftStart: values.shiftStart || "",
  shiftEnd: values.shiftEnd || "",
  emergencyContact: values.emergencyContact || {},
});

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
      appendHrmsFields(payload, values);

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
                    ...hrmsJsonBody(values),
                  },
                  id: data?._id,
                }
              : { id: data?._id, body: payload },
          ).unwrap()
        : createEmployee(payload).unwrap());

      if (response.success) {
        toast.success(
          isEdit
            ? "Employee updated successfully!"
            : "Employee created successfully!",
        );
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
    departmentId: data?.departmentId?._id || data?.departmentId || "",
    joiningDate: dateOnly(data?.joiningDate),
    fullName: data?.fullName || "",
    designation: data?.designation || "",
    email: data?.email || "",
    CNIC: data?.CNIC || "",
    status: data?.status || "",
    role: data?.role || "USER",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
    image: data?.image || "",
    password: "",
    isEdit: !!data,
    dateOfBirth: dateOnly(data?.dateOfBirth),
    gender: data?.gender || "",
    maritalStatus: data?.maritalStatus || "",
    bloodGroup: data?.bloodGroup || "",
    employmentType: data?.employmentType || "",
    currentSalary: data?.currentSalary ?? "",
    bankName: data?.bankName || "",
    accountTitle: data?.accountTitle || "",
    accountNumber: data?.accountNumber || "",
    iban: data?.iban || "",
    ntn: data?.ntn || "",
    shiftStart: toTimeInputValue(data?.shiftStart),
    shiftEnd: toTimeInputValue(data?.shiftEnd),
    emergencyContact: {
      ...emptyEmergency(),
      ...(data?.emergencyContact || {}),
    },
  };

  const roleOption = [
    { name: "User", value: "USER" },
    { name: "Department Admin", value: "DEP_ADMIN" },
    { name: "HR Admin", value: "HR_ADMIN" },
    { name: "Finance Admin", value: "FINANCE_ADMIN" },
    { name: "Sub Admin", value: "SUBADMIN" },
    { name: "Admin", value: "ADMIN" },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Employee" : "Add Employee"}
      maxWidthClass="max-w-4xl"
      zClass="z-50"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={empSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          errors,
          touched,
          isSubmitting,
          values,
          setFieldValue,
          setFieldTouched,
        }) => {
          const deptOptions =
            departments?.data?.map((d) => ({
              value: d?._id,
              label: d?.name,
            })) ?? [];
          const roleOptions =
            roleOption?.map((d) => ({
              value: d?.value,
              label: d?.name,
            })) ?? [];

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
            <Form className="space-y-3">
              <input
                type="file"
                ref={fileInputRef1}
                onChange={handleMainImageUpload}
                className="hidden"
                accept="image/*"
              />

              <div className="flex justify-center py-2">
                <div className="relative">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef1.current?.click()}
                    className={`w-24 h-24 rounded-full cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-150
                      ${
                        previewSrc
                          ? "ring-2 ring-white/15"
                          : "border-2 border-dashed border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
                      }`}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Employee"
                        className="w-full h-full object-cover"
                      />
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
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer bg-red-500/90 border-2 border-[#0f1419]"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </div>

              <SectionTitle>Basic Information</SectionTitle>
              <div className="h-px bg-white/[0.06]" />

              <div>
                <FieldLabel>Full Name</FieldLabel>
                <Field name="fullName">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="John Smith"
                      className={inputClass(errors.fullName && touched.fullName)}
                    />
                  )}
                </Field>
                <ErrMsg name="fullName" />
              </div>

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
                    variant="dark"
                  />
                </div>
                <div>
                  <FieldLabel>
                    <Calendar className="inline w-3 h-3 mr-1" />
                    Joining Date
                  </FieldLabel>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className={inputClass(
                          errors.joiningDate && touched.joiningDate
                        )}
                      />
                    )}
                  </Field>
                  <ErrMsg name="joiningDate" />
                </div>

                <div>
                  <FieldLabel>Email</FieldLabel>
                  <Field name="email">
                    {({ field }) => (
                      <input
                        {...field}
                        type="email"
                        placeholder="example@gmail.com"
                        className={inputClass(errors.email && touched.email)}
                      />
                    )}
                  </Field>
                  <ErrMsg name="email" />
                </div>
                <div>
                  <FieldLabel>Designation</FieldLabel>
                  <Field name="designation">
                    {({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g. Senior Developer"
                        className={inputClass(
                          errors.designation && touched.designation
                        )}
                      />
                    )}
                  </Field>
                  <ErrMsg name="designation" />
                </div>

                <div>
                  <FieldLabel>CNIC</FieldLabel>
                  <Field name="CNIC">
                    {({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="40000-1234567-8"
                        className={inputClass(errors.CNIC && touched.CNIC)}
                      />
                    )}
                  </Field>
                  <ErrMsg name="CNIC" />
                </div>
                <div>
                  <FieldLabel>Phone No.</FieldLabel>
                  <Field name="phoneNo">
                    {({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="0300-1234567"
                        className={inputClass(errors.phoneNo && touched.phoneNo)}
                      />
                    )}
                  </Field>
                  <ErrMsg name="phoneNo" />
                </div>

                {!isEdit && (
                  <div>
                    <FieldLabel>Password</FieldLabel>
                    <Field name="password">
                      {({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="••••••••"
                          className={inputClass(
                            errors.password && touched.password
                          )}
                        />
                      )}
                    </Field>
                    <ErrMsg name="password" />
                  </div>
                )}
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
                  variant="dark"
                />
              </div>

              <div>
                <FieldLabel>Address</FieldLabel>
                <Field name="address">
                  {({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      placeholder="Full address..."
                      className={`${fleet.modalTextarea} leading-relaxed`}
                    />
                  )}
                </Field>
                <ErrMsg name="address" />
              </div>

              <SectionTitle>Personal Information</SectionTitle>
              <div className="h-px bg-white/[0.06]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Field name="dateOfBirth">
                    {({ field }) => (
                      <input {...field} type="date" className={inputClass(false)} />
                    )}
                  </Field>
                </div>
                <FormikSelect
                  name="gender"
                  label="Gender"
                  options={GENDER_OPTIONS}
                  value={values.gender}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.gender}
                  touched={touched.gender}
                  placeholder="Select gender"
                  variant="dark"
                />
                <FormikSelect
                  name="maritalStatus"
                  label="Marital Status"
                  options={MARITAL_OPTIONS}
                  value={values.maritalStatus}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.maritalStatus}
                  touched={touched.maritalStatus}
                  placeholder="Select status"
                  variant="dark"
                />
                <FormikSelect
                  name="bloodGroup"
                  label="Blood Group"
                  options={BLOOD_OPTIONS}
                  value={values.bloodGroup}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.bloodGroup}
                  touched={touched.bloodGroup}
                  placeholder="Select blood group"
                  variant="dark"
                />
              </div>

              <SectionTitle>Emergency Contact</SectionTitle>
              <div className="h-px bg-white/[0.06]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Contact Name</FieldLabel>
                  <Field name="emergencyContact.name">
                    {({ field }) => (
                      <input {...field} type="text" className={inputClass(false)} placeholder="Name" />
                    )}
                  </Field>
                </div>
                <div>
                  <FieldLabel>Contact Number</FieldLabel>
                  <Field name="emergencyContact.phone">
                    {({ field }) => (
                      <input {...field} type="text" className={inputClass(false)} placeholder="0300-1234567" />
                    )}
                  </Field>
                </div>
                <div>
                  <FieldLabel>Relationship</FieldLabel>
                  <Field name="emergencyContact.relationship">
                    {({ field }) => (
                      <input {...field} type="text" className={inputClass(false)} placeholder="e.g. Spouse" />
                    )}
                  </Field>
                </div>
                <div>
                  <FieldLabel>Address (optional)</FieldLabel>
                  <Field name="emergencyContact.address">
                    {({ field }) => (
                      <input {...field} type="text" className={inputClass(false)} placeholder="Address" />
                    )}
                  </Field>
                </div>
              </div>

              <SectionTitle>Employment & Starting Salary</SectionTitle>
              <div className="h-px bg-white/[0.06]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormikSelect
                  name="employmentType"
                  label="Employment Type"
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  value={values.employmentType}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.employmentType}
                  touched={touched.employmentType}
                  placeholder="Permanent / Probation"
                  variant="dark"
                />
                <div>
                  <FieldLabel>Starting Basic Salary</FieldLabel>
                  <Field name="currentSalary">
                    {({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g. 100000"
                        className={inputClass(false)}
                      />
                    )}
                  </Field>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Full package (salary + allowances) can also be set from employee profile → Compensation.
                  </p>
                </div>
                <div>
                  <FieldLabel>Shift Start</FieldLabel>
                  <Field name="shiftStart">
                    {({ field }) => (
                      <input {...field} type="time" className={inputClass(false)} />
                    )}
                  </Field>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Used to calculate late arrival on attendance.
                  </p>
                </div>
                <div>
                  <FieldLabel>Shift End</FieldLabel>
                  <Field name="shiftEnd">
                    {({ field }) => (
                      <input {...field} type="time" className={inputClass(false)} />
                    )}
                  </Field>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Use 12:00 AM for midnight (24:00).
                  </p>
                </div>
              </div>

              <SectionTitle>Banking & Tax</SectionTitle>
              <div className="h-px bg-white/[0.06]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["bankName", "Bank Name"],
                  ["accountTitle", "Account Title"],
                  ["accountNumber", "Account Number"],
                  ["iban", "IBAN (optional)"],
                  ["ntn", "NTN"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <FieldLabel>{label}</FieldLabel>
                    <Field name={name}>
                      {({ field }) => (
                        <input {...field} type="text" className={inputClass(false)} />
                      )}
                    </Field>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.06]" />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className={fleet.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={fleet.modalPrimaryBtn}
                >
                  {isSubmitting
                    ? "Processing..."
                    : isEdit
                      ? "Save Changes"
                      : "Add Employee"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ModalShell>
  );
};

export default EmployeeModal;
