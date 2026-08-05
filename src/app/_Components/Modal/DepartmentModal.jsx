"use client";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-hot-toast";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/app/_Services/department/page";
import ModalShell from "./ModalShell";
import InputField from "../Form/InputField";
import { fleet } from "../fleet/fleetTheme";

const departSchema = Yup.object().shape({
  name: Yup.string().required("department name is required"),
});

const DepartmentModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createDeaprtment] = useCreateDepartmentMutation();
  const [updateDeaprtment] = useUpdateDepartmentMutation();

  const isEdit = !!data;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateDeaprtment({ id: data?._id, ...values }).unwrap()
        : createDeaprtment({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data
            ? "Department updated successfully!"
            : "Department created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process department");
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
    name: data?.name || "",
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Department" : "Add Department"}
      maxWidthClass="max-w-2xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={departSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <InputField
              name="name"
              label="Department Name"
              errors={errors.name}
              touched={touched.name}
              variant="dark"
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

export default DepartmentModal;
