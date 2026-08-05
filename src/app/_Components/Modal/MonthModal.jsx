"use client";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateMonthMutation } from "@/app/_Services/month/page";
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

const monthSchema = Yup.object().shape({
  name: Yup.string()
    .required("Month name is required")
    .min(3, "Name must be at least 3 characters"),
  startDate: Yup.string().required("Start date is required"),
//   endDate: Yup.string()
//     .required("End date is required")
//     .test("is-after-start", "End date must be after start date", function (value) {
//       const { startDate } = this.parent;
//       if (!startDate || !value) return true;
//       return new Date(value) > new Date(startDate);
//     }),
});

const MonthModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createMonth] = useCreateMonthMutation();

  const initialValues = {
    name: "",
    startDate: "",
    endDate:  "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await  createMonth({ ...values }).unwrap();

      if (response.success) {
        toast.success("Month created successfully!");
      } else {
        toast.error(response.message || "Failed to process month");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to process month";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Start New Month"
      maxWidthClass="max-w-lg"
      zClass="z-50"
    >
              <Formik
                initialValues={initialValues}
                validationSchema={monthSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">

                    {/* Month Name */}
                    <div>
                      <FieldLabel>Month Name</FieldLabel>
                      <Field name="name">
                        {({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="e.g. January 2025"
                            className={inputClass(errors.name && touched.name)}
                          />
                        )}
                      </Field>
                      <ErrMsg name="name" />
                    </div>

                    {/* Start Date + End Date */}
                    <div className="grid grid-cols-1  gap-4">
                      <div>
                        <FieldLabel>
                          <Calendar className="inline w-3 h-3 mr-1" />
                          Start Date
                        </FieldLabel>
                        <Field name="startDate">
                          {({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className={`${inputClass(errors.startDate && touched.startDate)} [color-scheme:dark]`}
                            />
                          )}
                        </Field>
                        <ErrMsg name="startDate" />
                      </div>
                    </div>

                    {/* Info note */}
                    <div className="flex items-start gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Month code will be auto-generated from the name. Only one month can be{" "}
                        <span className="text-emerald-400 font-bold">OPEN</span> at a time.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
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
                        {isSubmitting ? "Processing..." : "Create Month"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
    </ModalShell>
  );
};

export default MonthModal;
