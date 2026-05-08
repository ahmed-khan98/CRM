"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, ChartBar } from "lucide-react";
import { toast } from "react-hot-toast";
import { BreakSchema } from "@/app/schema/break";
import FormikBreakSelect from "./formikBreakSelect";
import { useBreakInMutation } from "@/app/_Services/employee/page";
import { useDispatch, useSelector } from "react-redux";
import { setActivity } from "@/redux/filterSlice";

const BreakTypeModal = memo(({ isOpen, closeModal }) => {
    const dispatch = useDispatch();
  
  const [breakIn, { isLoading: isBreakLoading }] = useBreakInMutation();
    const { attendence } = useSelector((state) => state.filter);
  

  const handleSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    try {
      const res = await breakIn({ attendanceId: attendence?._id,...data }).unwrap();
      if (res.success) {
        closeModal();
        dispatch(
          setActivity({
            activityStatus: res?.data?.activityStatus,
            breakInTime: res?.data?.breakRecord?.breakIn,
            type: res?.data?.breakRecord?.type,
            reason: res?.data?.breakRecord?.reason,
          }),
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "break in failed");
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      y: 24,
      transition: { duration: 0.18 },
    },
  };

  const initialValues = {
    reason: "",
    type: "",
  };

  const typeOptions = ["MEAL", "REST ROOM", "SMOKING","TEA","PRAYER","OFFICIAL"].map((b) => ({
    value: b,
    label: b,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={closeModal}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl overflow-hidden bg-[#0d0d0f] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
          >
            {/* Top accent line */}
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/10">
                  <ChartBar className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                    Attendance
                  </p>
                  <h2 className="text-sm font-black text-zinc-100">Break Type</h2>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 bg-white/[0.05] border border-white/[0.08] text-zinc-500 hover:bg-white/10 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Form body */}
            <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
              <Formik
                initialValues={initialValues}
                validationSchema={BreakSchema}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting, values, setFieldValue, setFieldTouched }) => (
                  <Form className="flex flex-col gap-3">

                    {/* Select */}
                    <div>
                      <FormikBreakSelect
                        name="type"
                        label="Select Type"
                        options={typeOptions}
                        value={values.type}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.type}
                        touched={touched.type}
                        placeholder="Select Action"
                      />
                    </div>

                    {/* Official reason textarea */}
                    {values?.type === "OFFICIAL" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                          Reason for Official Break
                          <span className="text-red-400 ml-1">*</span>
                        </label>
                        <Field
                          as="textarea"
                          name="reason"
                          rows="4"
                          placeholder="Leave your reason..."
                          className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all duration-150 bg-white/[0.04] border border-white/[0.08] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.06]"
                        />
                        <ErrorMessage
                          name="reason"
                          component="div"
                          className="text-red-400 text-xs mt-0.5"
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"
                      >
                        Cancel
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12" cy="12" r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          "Submit"
                        )}
                      </motion.button>
                    </div>

                  </Form>
                )}
              </Formik>
            </div>

            {/* Bottom accent line */}
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default BreakTypeModal;
