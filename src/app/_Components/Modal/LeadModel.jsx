"use client";

import { Formik, Form } from "formik";
import { toast } from "react-hot-toast";
import { useCreateLeadMutation } from "@/app/_Services/lead/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { leadSchema } from "@/app/schema/Lead";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import FormikSelect from "./formikSelect";
import InputField from "../Form/InputField";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const LeadModal = ({ isOpen, closeModal, refetch }) => {
  const [createLead] = useCreateLeadMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createLead({ ...values }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success("Client created successfully!");
      } else {
        toast.error(response.message || "Failed to process Client");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create Client");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    departmentId: "",
    brandId: "",
    brandMark: "",
    name: "",
    email: "",
    phoneNo: "",
    serialNo: "",
  };

  const handleDepartmentChange = (newDeptId) => {
    setFieldValue("departmentId", newDeptId);
    setFieldValue("brandId", "");
    setFieldValue("agent", "");
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Lead"
      maxWidthClass="max-w-4xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={leadSchema}
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
          const {
            data: departEmployee,
            error: isEmployeeError,
            isLoading: isEmployeeLoading,
          } = useGetdepartmentsEmployeeQuery(values.departmentId, {
            skip: !values.departmentId,
          });

          const {
            data: departBrand,
            error,
            isLoading: isBrandLoading,
          } = useGetDepartmentBrandQuery(values.departmentId, {
            skip: !values.departmentId,
          });

          const deptOptions =
            departments?.data?.map((d) => ({
              value: d?._id,
              label: d?.name,
            })) ?? [];

          const brandOptions =
            departBrand?.data?.map((b) => ({
              value: b?._id,
              label: b?.name,
            })) ?? [];

          return (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <InputField
                  name="name"
                  label="Name"
                  errors={errors.name}
                  touched={touched.name}
                  variant="dark"
                />
                <InputField
                  name="serialNo"
                  label="Serial No"
                  errors={errors.serialNo}
                  touched={touched.serialNo}
                  variant="dark"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <InputField
                  type="email"
                  name="email"
                  label="Email"
                  errors={errors.email}
                  touched={touched.email}
                  variant="dark"
                />
                <InputField
                  name="phoneNo"
                  label="Phone No."
                  errors={errors.phoneNo}
                  touched={touched.phoneNo}
                  variant="dark"
                />
              </div>
              <InputField
                name="brandMark"
                label="Brand Mark"
                errors={errors.brandMark}
                touched={touched.brandMark}
                variant="dark"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

                {/* Brand (depends on department) */}
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
              </div>

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
          );
        }}
      </Formik>
    </ModalShell>
  );
};

export default LeadModal;
