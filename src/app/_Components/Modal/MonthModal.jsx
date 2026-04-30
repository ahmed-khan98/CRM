"use client";

import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, CalendarDays, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateMonthMutation } from "@/app/_Services/month/page";


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
            className="w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden rounded-[20px] bg-zinc-950 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/25 to-white/[0.06]" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/10 flex-shrink-0">
                  <CalendarDays className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase text-zinc-600">
                    New Record"
                  </p>
                  <h2 className="text-base font-black text-zinc-100">
                    Start New Month
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

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
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
                              className={inputClass(errors.startDate && touched.startDate)}
                            />
                          )}
                        </Field>
                        <ErrMsg name="startDate" />
                      </div>

                      {/* <div>
                        <FieldLabel>
                          <Calendar className="inline w-3 h-3 mr-1" />
                          End Date
                        </FieldLabel>
                        <Field name="endDate">
                          {({ field }) => (
                            <input
                              {...field}
                              type="date"
                              className={inputClass(errors.endDate && touched.endDate)}
                            />
                          )}
                        </Field>
                        <ErrMsg name="endDate" />
                      </div> */}
                    </div>

                    {/* Info note */}
                    <div className="flex items-start gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Month code will be auto-generated from the name. Only one month can be{" "}
                        <span className="text-emerald-400 font-bold">OPEN</span> at a time.
                      </p>
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
                        ) : "Create Month"}
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonthModal;
