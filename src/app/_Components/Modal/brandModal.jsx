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
import { useRef } from "react";
import ModalShell from "./ModalShell";
import InputField from "../Form/InputField";
import { fleet } from "../fleet/fleetTheme";

function resolveInitialDepartmentIds(data) {
  if (Array.isArray(data?.departmentIds) && data.departmentIds.length) {
    return data.departmentIds.map((d) => d?._id || d).filter(Boolean);
  }
  if (data?.departmentId?._id || data?.departmentId) {
    return [data.departmentId?._id || data.departmentId];
  }
  return [];
}

const BrandModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const { data: departments, isLoading } = useAllDepartmentsQuery();
  const isEdit = !!data;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const departmentIdsJson = JSON.stringify(values?.departmentIds || []);
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("name", values?.name);
      payload.append("departmentIds", departmentIdsJson);
      // legacy single field (primary) for older parsers
      payload.append("departmentId", values?.departmentIds?.[0] || "");

      const jsonBody = {
        name: values?.name,
        departmentIds: values?.departmentIds,
        departmentId: values?.departmentIds?.[0] || "",
      };

      const response = await (isEdit
        ? updateBrand(
            typeof values?.image === "string"
              ? {
                  body: jsonBody,
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
    departmentIds: resolveInitialDepartmentIds(data),
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
        context={{ isEdit }}
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

          return (
            <Form className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-zinc-300">
                  Brand Logo
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className={`relative flex h-20 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed ${
                      previewSrc
                        ? "border-zinc-700 bg-zinc-900"
                        : "border-zinc-700 bg-zinc-950/60"
                    }`}
                  >
                    {previewSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewSrc}
                        alt="brand"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Upload className="h-5 w-5 text-zinc-500" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef1.current?.click()}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-200 hover:bg-zinc-800"
                    >
                      Upload
                    </button>
                    <input
                      ref={fileInputRef1}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleMainImageUpload}
                    />
                    {values.image ? (
                      <button
                        type="button"
                        onClick={handleDeleteMainImage}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-900/50 px-3 py-1.5 text-[12px] text-rose-400 hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="mt-1 text-[11px] text-rose-400"
                />
              </div>

              <InputField
                name="name"
                label="Brand Name"
                errors={errors.name}
                touched={touched.name}
                variant="dark"
              />

              <FormikSelect
                name="departmentIds"
                label="Select Departments"
                options={deptOptions}
                value={values.departmentIds}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                error={errors.departmentIds}
                touched={touched.departmentIds}
                placeholder="Select one or more departments"
                variant="dark"
                isMulti
                isLoading={isLoading}
                required
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

export default BrandModal;
