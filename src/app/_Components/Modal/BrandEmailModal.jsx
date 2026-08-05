"use client";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-hot-toast";
import {
  useCreateBrandEmailMutation,
  useUpdateBrandEmailMutation,
} from "@/app/_Services/domain/page";
import { useAllBrandsQuery } from "@/app/_Services/brand/page";
import FormikSelect from "./formikSelect";
import InputField from "../Form/InputField";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const BrandEmailSchema = Yup.object().shape({
  brandId: Yup.string().required("please select brand"),
  name: Yup.string().required("name is required"),
  email: Yup.string().required("email is required"),
});

const BrandEmailModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createBrandEmail] = useCreateBrandEmailMutation();
  const [updateBrandEmail] = useUpdateBrandEmailMutation();

  const { data: Brand, isLoading: isBrandLoading } = useAllBrandsQuery();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateBrandEmail({ id: data?._id, ...values }).unwrap()
        : createBrandEmail({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data ? "domain updated successfully!" : "domain created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process domain");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to create department";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    brandId: data?.brandId?._id || "",
    name: data?.name || "",
    email: data?.email || "",
  };

  const brandOptions =
    Brand?.data?.map((b) => ({
      value: b?._id,
      label: b?.name,
    })) ?? [];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={data ? "Edit Brand Email" : "Add Brand Email"}
      maxWidthClass="max-w-2xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={BrandEmailSchema}
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
        }) => (
          <Form className="space-y-4">
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
              variant="dark"
              required
            />

            <InputField
              label="Name"
              name="name"
              variant="dark"
              required
              errors={errors.name}
              touched={touched.name}
            />

            <InputField
              label="Email ID"
              name="email"
              variant="dark"
              required
              errors={errors.email}
              touched={touched.email}
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
                {isSubmitting ? "Processing..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default BrandEmailModal;
