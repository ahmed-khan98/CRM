"use client";

import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import { useCreateEmailTemplateMutation, useUpdateEmailTemplateMutation } from "@/app/_Services/emailTemplate/page";
import TinyEditor from "../TinyEditor";
import InputField from "../Form/InputField";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const emailTemplateSchema = Yup.object().shape({
  name: Yup.string().required("Template name is required"),
  content: Yup.string().required("Content is required"),
});

function CreateTemplateModal({ isOpen, closeModal, data, refetch }) {
  const [createEmailTemplate] = useCreateEmailTemplateMutation();
  const [updateEmailTemplate] = useUpdateEmailTemplateMutation();

  const initialValues = {
    name: data?.name || "",
    content: data?.content || "",
    subject: data?.subject || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateEmailTemplate({ id: data?._id, ...values }).unwrap()
        : createEmailTemplate({ ...values }).unwrap());

      if (response?.success) {
        toast.success(data ? "Email Template updated!" : "Email Template created!");
        resetForm();
        closeModal();
        refetch?.();
      } else {
        toast.error(response?.message || "Failed to process template");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to save template";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={data ? "Edit Template" : "Add New Template"}
      maxWidthClass="max-w-4xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={emailTemplateSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <InputField
              label="Template Name"
              name="name"
              variant="dark"
              required
              placeholder="e.g. Welcome Email"
              errors={errors.name}
              touched={touched.name}
            />

            <InputField
              label="Template Subject"
              name="subject"
              variant="dark"
              placeholder="e.g. Hi"
              errors={errors.subject}
              touched={touched.subject}
            />

            <div>
              <label className={fleet.modalLabel}>
                Template Content
                <span className="text-white"> *</span>
              </label>
              <div className="rounded-xl overflow-hidden border border-white/[0.1]">
                <TinyEditor
                  value={values.content}
                  onChange={(html) => setFieldValue("content", html)}
                />
              </div>
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-400 text-[11px] mt-1.5"
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
        )}
      </Formik>
    </ModalShell>
  );
}

export default CreateTemplateModal;
