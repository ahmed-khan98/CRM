"use client";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/app/_Services/announcement/page";
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
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Announcement" : "Add Announcement"}
      maxWidthClass="max-w-xl"
      zClass="z-50"
    >
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
                        {isSubmitting
                          ? "Processing..."
                          : isEdit
                            ? "Save Changes"
                            : "Add Announcement"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
    </ModalShell>
  );
};

export default AnnouncementModal;
