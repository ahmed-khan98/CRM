"use client";

import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateLeadMutation } from "@/app/_Services/lead/page";
import { leadActionSchema } from "@/app/schema/Lead";
import FormikSelect from "./formikSelect";
import { formatDate } from "@/app/utilities/date";
import ModalShell from "./ModalShell";
import InputField from "../Form/InputField";
import { fleet } from "../fleet/fleetTheme";

const LeadActionModal = ({ isOpen, data, closeModal, refetch }) => {
  const [updateLead] = useUpdateLeadMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await updateLead({ id: data?._id, ...values }).unwrap();
      if (response.success) {
        toast.success("Lead Action Update successfully!");
      } else {
        toast.error(response.message || "Failed to process Lead Action");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to Lead Action Update");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    lastComment: "",
    lastAction: "",
    scheduleDate: "",
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Lead Action"
      maxWidthClass="max-w-3xl"
    >
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#161b22] border-b border-white/[0.08]">
              <tr>
                <th className="px-2 py-3 text-start text-[12px] font-semibold text-zinc-300 capitalize">
                  Last Action Date{" "}
                </th>
                <th className="px-2 py-3 text-start text-[12px] font-semibold text-zinc-300 capitalize">
                  Action{" "}
                </th>
                <th className="px-2 py-3 text-start text-[12px] font-semibold text-zinc-300 capitalize">
                  Agent{" "}
                </th>
                <th className="px-2 py-3 text-start text-[12px] font-semibold text-zinc-300 capitalize">
                  Comment{" "}
                </th>
                {data?.lastAction === "schedule" && (
                  <th className="px-2 py-3 text-start text-[12px] font-semibold text-zinc-300 capitalize">
                    Schedule Date{" "}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-[#0f1419] divide-y divide-white/[0.06]">
              <motion.tr
                key={data?._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 * 0.1 }}
                className="transition-colors"
              >
                <td className="px-2 py-3 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-1">
                    {data?.lastActionCreateAt ? (
                      <span className="text-[12px] text-zinc-400">
                        {formatDate(data.lastActionCreateAt)}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </td>

                <td className="px-2 py-3 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[12px] text-zinc-400 capitalize">
                      {data?.lastAction ? data?.lastAction : "-"}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap capitalize">
                  {data?.userId ? (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium text-zinc-300`}
                    >
                      {data?.userId}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 w-[340px] min-w-[280px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-zinc-400 capitalize">
                      {data?.lastComment ? data?.lastComment : "-"}
                    </span>
                  </div>
                </td>
                {data?.lastAction === "schedule" && (
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      {data?.scheduleDate ? (
                        <span className="text-[12px] text-zinc-400">
                          {formatDate(data.scheduleDate)}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            </tbody>
          </table>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={leadActionSchema}
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
          const actionOptions =
            [
              "no action",
              "no answer",
              "interested",
              "not interested",
              "in loop",
              "invalid",
              "schedule",
              "general",
            ]?.map((b) => ({
              value: b,
              label: b,
            })) ?? [];

          return (
            <Form className="space-y-4">
              <FormikSelect
                name="lastAction"
                label="Select Action"
                options={actionOptions}
                value={values.lastAction}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                error={errors.lastAction}
                touched={touched.lastAction}
                placeholder="Select Action"
                variant="dark"
              />
              {values?.lastAction === "schedule" && (
                <InputField
                  type="date"
                  name="scheduleDate"
                  label="Schedule Date"
                  icon={Calendar}
                  errors={errors.scheduleDate}
                  touched={touched.scheduleDate}
                  variant="dark"
                />
              )}
              <InputField
                as="textarea"
                name="lastComment"
                label="Comment"
                rows={4}
                placeholder="leave your comment..."
                errors={errors.lastComment}
                touched={touched.lastComment}
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
                  {isSubmitting ? "Processing..." : "Continue"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ModalShell>
  );
};

export default LeadActionModal;
