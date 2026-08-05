"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "@/app/_Services/Client/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import React, { useEffect, useMemo, useRef } from "react";
import { clientSchema } from "@/app/schema/client";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import FormikSelect from "./formikSelect";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import InputField from "../Form/InputField";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const signupOptions = [
  "USPTO",
  "cold",
  "PPC",
  "meta",
  "chat",
  "email",
  "google",
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "other",
].map((s) => ({ value: s, label: s }));

const ClientModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();

  // 1. Fetch Logged In User Data
  const { data: loggedUser, isLoading: isLoggedLoading } =
    useGetLoggedUserQuery();

  // Role aur user credentials calculations
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const isAdminOrSubAdmin = userRole === "ADMIN" || userRole === "SUBADMIN";

  const userDepartmentId =
    loggedUser?.data?.departmentId?._id ||
    loggedUser?.data?.departmentId ||
    loggedUser?.departmentId ||
    "";
  const currentUserId = loggedUser?.data?._id || loggedUser?._id || "";

  const { data: departments } = useAllDepartmentsQuery(undefined, {
    skip: !isAdminOrSubAdmin,
  });

  const isEdit = !!data;

  const deptOptions = useMemo(
    () =>
      departments?.data?.map((d) => ({ value: d?._id, label: d?.name })) ?? [],
    [departments],
  );

  // 4. Initial Values Configuration
  const initialValues = useMemo(
    () => ({
      departmentId:
        data?.departmentId?._id ||
        data?.departmentId ||
        (isAdminOrSubAdmin ? "" : userDepartmentId),
      handleBy:
        data?.handleBy?._id ||
        data?.handleBy ||
        (isAdminOrSubAdmin ? "" : currentUserId),
      brandId: data?.brandId?._id || data?.brandId || "",
      signupType: data?.signupType || "",
      companyName: data?.companyName || "",
      name: data?.name || "",
      email: data?.email || "",
      phoneNo: data?.phoneNo || "",
      address: data?.address || "",
      image: data?.image || "",
    }),
    [data, isAdminOrSubAdmin, userDepartmentId, currentUserId],
  );

  // Submit Handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;

      // Optmized Payload Build System
      if (isEdit && typeof values?.image === "string") {
        // Simple JSON object if image is already a URL string
        const { image, ...bodyValues } = values;
        response = await updateClient({
          id: data?._id,
          body: bodyValues,
        }).unwrap();
      } else {
        // FormData if new image is uploaded or creating client
        const payload = new FormData();
        payload.append("id", data?._id || "");
        Object.keys(values).forEach((key) => {
          const value = values[key];
          if (value === undefined || value === null || value === "") return;
          if (key === "image" && !(value instanceof File)) return;
          payload.append(key, value);
        });
        response = await (
          isEdit
            ? updateClient({ id: data?._id, body: payload })
            : createClient(payload)
        ).unwrap();
      }

      if (response.success) {
        toast.success(
          isEdit
            ? "Client updated successfully!"
            : "Client created successfully!",
        );
        resetForm();
        closeModal();
        refetch();
      } else {
        toast.error(response.message || "Failed to process Client");
      }
    } catch (error) {
      console.error("Client Submit Error:", error);
      toast.error(error.data?.message || "Failed to save Client");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoggedLoading) return null; // Early exit strategy if logged user state is loading

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Client" : "Add Client"}
      maxWidthClass="max-w-3xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={clientSchema}
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
          const fileInputRef1 = useRef(null);

          // Derived/Dependent RTK API Hooks inside Formik context
          const { data: departEmployee, isLoading: isEmployeeLoading } =
            useGetdepartmentsEmployeeQuery(values.departmentId, {
              skip: !values.departmentId || !isAdminOrSubAdmin,
            });

          const { data: departBrand, isLoading: isBrandLoading } =
            useGetDepartmentBrandQuery(values.departmentId, {
              skip: !values.departmentId,
            });

          // Memoizing dynamic runtime arrays
          const brandOptions = useMemo(
            () =>
              departBrand?.data?.map((b) => ({
                value: b?._id,
                label: b?.name,
              })) ?? [],
            [departBrand],
          );

          const agentOptions = useMemo(
            () =>
              departEmployee?.data?.map((e) => ({
                value: e?._id,
                label: e?.fullName,
              })) ?? [],
            [departEmployee],
          );

          const previewSrc = useMemo(
            () =>
              values.image instanceof File
                ? URL.createObjectURL(values.image)
                : values.image || null,
            [values.image],
          );

          // Cleanup object URLs dynamically to avoid browser memory leaks
          useEffect(() => {
            return () => {
              if (values?.image instanceof File && previewSrc) {
                URL.revokeObjectURL(previewSrc);
              }
            };
          }, [previewSrc, values?.image]);

          const handleDepartmentChange = (newDeptId) => {
            setFieldValue("departmentId", newDeptId);
            setFieldValue("brandId", "");
            setFieldValue("handleBy", "");
          };

          return (
            <Form className="space-y-4">
              <input
                type="file"
                ref={fileInputRef1}
                onChange={(e) =>
                  setFieldValue("image", e.target.files?.[0])
                }
                className="hidden"
                accept="image/*"
              />

              {/* Profile Image Render Area */}
              <div className="flex justify-center items-center">
                <div className="relative w-24 h-24">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef1.current?.click()}
                    className={`w-24 h-24 rounded-full border ${previewSrc ? "overflow-hidden border-white/10" : "border-dashed border-white/15 bg-[#1c2330] cursor-pointer flex flex-col items-center justify-center text-center p-2"}`}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Client"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-[11px] text-zinc-400 leading-tight">
                          Upload Image (optional)
                        </span>
                      </>
                    )}
                  </div>
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-400 text-[11px] mt-1"
                  />
                  {previewSrc && (
                    <button
                      type="button"
                      onClick={() => setFieldValue("image", "")}
                      className="absolute -top-2 -right-2 bg-[#1c2330] border border-white/10 rounded-full p-1 shadow hover:bg-[#232b3a]"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <InputField
                  name="name"
                  label="Client Name"
                  errors={errors.name}
                  touched={touched.name}
                  variant="dark"
                />

                <InputField
                  type="email"
                  name="email"
                  label="Client Email"
                  errors={errors.email}
                  touched={touched.email}
                  variant="dark"
                />
                <InputField
                  name="companyName"
                  label="Business Name/Brand Name"
                  errors={errors.companyName}
                  touched={touched.companyName}
                  variant="dark"
                />
                <InputField
                  name="phoneNo"
                  label="Client Phone No."
                  errors={errors.phoneNo}
                  touched={touched.phoneNo}
                  variant="dark"
                />
              </div>

              {/* Conditional Row 1: Dept & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {isAdminOrSubAdmin ? (
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
                    onChangeExtra={handleDepartmentChange}
                    variant="dark"
                  />
                ) : (
                  <Field type="hidden" name="departmentId" />
                )}

                <FormikSelect
                  name="brandId"
                  label="Select Brand"
                  options={brandOptions}
                  value={values.brandId}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.brandId}
                  touched={touched.brandId}
                  placeholder="Select Brand"
                  isLoading={isBrandLoading}
                  isDisabled={!values.departmentId}
                  variant="dark"
                />

                {isAdminOrSubAdmin ? (
                  <FormikSelect
                    name="handleBy"
                    label="Sale Agent"
                    options={agentOptions}
                    value={values.handleBy}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    error={errors.handleBy}
                    touched={touched.handleBy}
                    placeholder="Select Agent"
                    isLoading={isEmployeeLoading}
                    isDisabled={!values.departmentId}
                    variant="dark"
                  />
                ) : (
                  <Field type="hidden" name="handleBy" />
                )}

                <FormikSelect
                  name="signupType"
                  label="SignUp Type"
                  options={signupOptions}
                  value={values.signupType}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  error={errors.signupType}
                  touched={touched.signupType}
                  placeholder="Select type"
                  variant="dark"
                />
              </div>
              <InputField
                name="address"
                as="textarea"
                label="Client address"
                errors={errors.address}
                touched={touched.address}
                variant="dark"
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
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
                  {isSubmitting ? "Processing..." : "Continue"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ModalShell>
  );
};
export default React.memo(ClientModal);
