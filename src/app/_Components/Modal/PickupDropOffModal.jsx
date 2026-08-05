"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/_Services/employee/page";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const pickupSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  joiningDate: Yup.date().required("Joining date is required"),
  designation: Yup.string().required("designation is required"),
  firstName: Yup.string().required("first name time is required"),
  lastName: Yup.string().required("last name time is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\d{4}-\d{7}$/,
      "Phone number must be in the format 0300-1234567"
    ),
  CNIC: Yup.string()
    .required("CNIC is required")
    .matches(
      /^\d{5}-\d{7}-\d{1}$/,
      "CNIC must be in the format 40000-1234567-8"
    ),
  address: Yup.string().max(500, "address must be less than 500 characters"),
});

const fieldError = (errors, touched, name) =>
  errors[name] && touched[name] ? "border-red-500/50" : "";

const PickupDropOffModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateEmployee({ ...values, id: data?._id }).unwrap()
        : createEmployee({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data
            ? "Appointment updated successfully!"
            : "Appointment created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process appointment");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to submit delivery method");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    departmentId: data?.departmentId || "",
    joiningDate: data?.joiningDate.split("T")[0] || "",
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    designation: data?.designation || "",
    email: data?.email || "",
    CNIC: data?.CNIC || "",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Employee Info"
      maxWidthClass="max-w-4xl"
      zClass="z-50"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={pickupSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className={fleet.modalLabel}>Department Type</label>
                <Field
                  as="select"
                  name="departmentId"
                  className={`${fleet.modalSelect} ${fieldError(errors, touched, "departmentId")}`}
                >
                  <option value="">Select Department</option>
                  <option value="pickup">Pickup</option>
                  <option value="dropoff">Drop Off</option>
                </Field>
                <ErrorMessage name="departmentId" component="div" className="text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label className={fleet.modalLabel}>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Joining Date
                </label>
                <Field
                  type="date"
                  name="joiningDate"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "joiningDate")}`}
                />
                <ErrorMessage name="joiningDate" component="div" className="text-red-400 text-sm mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className={fleet.modalLabel}>First Name</label>
                <Field
                  type="text"
                  name="firstName"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "firstName")}`}
                />
                <ErrorMessage name="firstName" component="div" className="text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label className={fleet.modalLabel}>Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "lastName")}`}
                />
                <ErrorMessage name="lastName" component="div" className="text-red-400 text-sm mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className={fleet.modalLabel}>Email</label>
                <Field
                  type="email"
                  name="email"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "email")}`}
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label className={fleet.modalLabel}>Designation</label>
                <Field
                  type="text"
                  name="designation"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "designation")}`}
                />
                <ErrorMessage name="designation" component="div" className="text-red-400 text-sm mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className={fleet.modalLabel}>CNIC</label>
                <Field
                  type="text"
                  name="CNIC"
                  placeholder="40000-1234567-8"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "CNIC")}`}
                />
                <ErrorMessage name="CNIC" component="div" className="text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label className={fleet.modalLabel}>Phone No.</label>
                <Field
                  type="text"
                  name="phoneNo"
                  placeholder="0300-1234567"
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "phoneNo")}`}
                />
                <ErrorMessage name="phoneNo" component="div" className="text-red-400 text-sm mt-1" />
              </div>
            </div>

            <div>
              <label className={fleet.modalLabel}>Address</label>
              <Field
                as="textarea"
                name="address"
                rows="3"
                placeholder="Any special instructions or address..."
                className={fleet.modalTextarea}
              />
              <ErrorMessage name="address" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button type="button" onClick={closeModal} className={fleet.modalCancelBtn}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className={fleet.modalPrimaryBtn}>
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
        )}
      </Formik>
    </ModalShell>
  );
};

export default PickupDropOffModal;
