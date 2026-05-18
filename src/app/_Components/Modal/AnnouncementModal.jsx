"use client";

import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, MegaphoneIcon, Megaphone } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/app/_Services/announcement/page";

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
const announcementSchema = Yup.object().shape({
  title: Yup.string()
    .required("Announcement title is required")
    .min(3, "Title must be at least 3 characters"),
    
  message: Yup.string()
    .required("Announcement message is required")
    .min(10, "Message should be at least 10 characters long")
    .max(1000, "Message cannot exceed 1000 characters"),
});

const AnnouncementModal = ({ isOpen, closeModal, data, refetch }) => {
  const isEdit = !!data;
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateAnnouncement({ id: data?._id, ...values }).unwrap()
        : createAnnouncement({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process announcement");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to create announcement";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  const initialValues = {
    title: data?.title || "",
    message: data?.message || "",
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
            className="w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden rounded-[20px] bg-zinc-950 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/25 to-white/[0.06]" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/10 flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase text-zinc-600">
                    {isEdit ? "Edit Record" : "New Record"}
                  </p>
                  <h2 className="text-base font-black text-zinc-100">
                    {isEdit ? "Edit Announcement" : "Add New Announcement"}
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

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              <Formik
                initialValues={initialValues}
                validationSchema={announcementSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">

                    {/* Title */}
                    <div>
                      <FieldLabel>Title</FieldLabel>
                      <Field name="title">
                        {({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="e.g. Company Picnic 2025"
                            className={inputClass(errors.title && touched.title)}
                          />
                        )}
                      </Field>
                      <ErrMsg name="title" />
                    </div>

                    {/* Message */}
                    <div>
                      <FieldLabel>Message</FieldLabel>
                      <Field name="message">
                        {({ field }) => (
                          <textarea
                            {...field}
                            rows={8}
                            placeholder="Write your announcement here..."
                            className={`${inputClass(errors.message && touched.message)} resize-none leading-relaxed`}
                          />
                        )}
                      </Field>
                      <ErrMsg name="message" />
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
                        ) : isEdit ? "Save Changes" : "Add Announcement"}
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

export default AnnouncementModal;
