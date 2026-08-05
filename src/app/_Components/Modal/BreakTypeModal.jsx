"use client";

import React, { memo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import { BreakSchema } from "@/app/schema/break";
import FormikBreakSelect from "./formikBreakSelect";
import { useBreakInMutation } from "@/app/_Services/employee/page";
import { useDispatch, useSelector } from "react-redux";
import { setActivity } from "@/redux/filterSlice";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const BreakTypeModal = memo(({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const [breakIn] = useBreakInMutation();
  const { attendence } = useSelector((state) => state.filter);

  const handleSubmit = async (data) => {
    try {
      const res = await breakIn({
        shiftDate: attendence?.shiftDate,
        ...data,
      }).unwrap();
      if (res.success) {
        closeModal();
        dispatch(
          setActivity({
            activityStatus: res?.data?.activityStatus,
            breakInTime: res?.data?.breakRecord?.breakIn,
            type: res?.data?.breakRecord?.type,
            reason: res?.data?.breakRecord?.reason,
          })
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "break in failed");
    }
  };

  const initialValues = {
    reason: "",
    type: "",
  };

  const typeOptions = ["MEAL", "REST ROOM", "SMOKING", "TEA", "PRAYER"].map(
    (b) => ({
      value: b,
      label: b,
    })
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Select Break Type"
      maxWidthClass="max-w-md"
      zClass="z-[100]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={BreakSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, setFieldValue, setFieldTouched }) => (
          <Form className="space-y-5">
            <div>
              <label className={fleet.modalLabel}>Break Type</label>
              <FormikBreakSelect
                name="type"
                options={typeOptions}
                value={values.type}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                error={errors.type}
                touched={touched.type}
                placeholder="Select break type"
              />
            </div>

            <div>
              <label className={fleet.modalLabel}>
                Reason <span className="text-zinc-600 normal-case tracking-normal font-medium">(optional)</span>
              </label>
              <Field
                as="textarea"
                name="reason"
                rows={3}
                placeholder="Why are you taking this break?"
                className={`${fleet.modalInput} resize-none ${
                  errors.reason && touched.reason ? "border-red-500/50" : ""
                }`}
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="text-red-400 text-xs mt-1.5 font-medium"
              />
            </div>

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
                {isSubmitting ? "Processing..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
});

export default BreakTypeModal;
