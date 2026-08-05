"use client";

import { Formik, Form, ErrorMessage } from "formik";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/app/_Services/brand/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import FormikSelect from "./formikSelect";
import { brandSchema } from "@/app/schema/brand";
import { useEffect, useRef } from "react";
import ModalShell from "./ModalShell";
import InputField from "../Form/InputField";
import { fleet } from "../fleet/fleetTheme";

const BrandModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();
  const isEdit = !!data;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "values");
    try {
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("name", values?.name);
      payload.append("departmentId", values?.departmentId);

      const response = await (isEdit
        ? updateBrand(
            typeof values?.image === "string"
              ? {
                  body: {
                    name: values?.name,
                    departmentId: values?.departmentId,
                  },
                  id: data?._id,
                }
              : {
                  id: data?._id,
                  body: payload,
                },
          ).unwrap()
        : createBrand(payload).unwrap());

      if (response.success) {
        toast.success(
          data ? "Brand updated successfully!" : "Brand created successfully!",
        );
      } else {
        toast.error(response.message || "Failed to process Brand");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create Brand");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: data?.name || "",
    departmentId: data?.departmentId?._id || "",
    image: data?.image || "",
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Brand" : "Add Brand"}
      maxWidthClass="max-w-xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={brandSchema}
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

          const fileInputRef1 = useRef(null);

          const handleMainImageUpload = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFieldValue("image", file);
          };

          const handleDeleteMainImage = () => {
            setFieldValue("image", "");
          };

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
            <Form className="space-y-4">
              <input
                type="file"
                ref={fileInputRef1}
                onChange={handleMainImageUpload}
                className="hidden"
                accept="image/*"
              />

              <div className="flex justify-center items-center">
                <div className="relative w-24 h-24">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef1.current?.click()}
                    className={`w-24 h-24 rounded-full border
                      ${
                        previewSrc
                          ? "overflow-hidden border-white/10"
                          : "border-dashed border-white/15 bg-[#1c2330] cursor-pointer flex flex-col items-center justify-center text-center p-2"
                      }
                    `}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Client"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                        <span className="text-[11px] text-zinc-400 leading-tight">
                          Upload Client Image
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
                      onClick={handleDeleteMainImage}
                      className="absolute -top-2 -right-2 bg-[#1c2330] border border-white/10 rounded-full p-1 shadow hover:bg-[#232b3a]"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>

              <InputField
                name="name"
                label="Brand Name"
                errors={errors.name}
                touched={touched.name}
                variant="dark"
              />

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
                //   onChangeExtra={handleDepartmentChange}
              />

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
                  {isSubmitting
                    ? "Processing..."
                    : values?.type === "pickup"
                      ? "Submit Pickup"
                      : values?.type === "drop off"
                        ? "Schedule Drop Off"
                        : "Continue"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ModalShell>
  );
};

export default BrandModal;
