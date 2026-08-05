import React from 'react'
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Calendar, Clock } from "lucide-react"
import { toast } from "react-hot-toast"
import { useUpdateAppointmentMutation } from '@/app/_Services/appointment/page'
import ModalShell from "./ModalShell"
import { fleet } from "../fleet/fleetTheme"

const appointmentSchema = Yup.object().shape({
  appointmentDate: Yup.date().required("Date is required"),
  appointmentTime: Yup.string().required("Time is required"),
  notes: Yup.string(),
})

const fieldError = (errors, touched, name) =>
  errors[name] && touched[name] ? "border-red-500/50" : ""

const EditAppointmentModal = ({ isModalOpen, editingAppointment, closeModal, refetch }) => {
  const [updateAppointment, { isLoading: updateLoading }] = useUpdateAppointmentMutation()

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await updateAppointment({
        id: editingAppointment._id,
        ...values,
      }).unwrap()

      if (response.success) {
        toast.success("Appointment updated successfully!")
        resetForm()
        closeModal()
        refetch()
      } else {
        toast.error(response.message || "Failed to process appointment")
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred")
    }
  }

  if (!isModalOpen || !editingAppointment) return null

  return (
    <ModalShell
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Edit Appointment"
      maxWidthClass="max-w-2xl"
      zClass="z-50"
    >
      <Formik
        initialValues={{
          appointmentDate: editingAppointment.appointmentDate.split("T")[0],
          appointmentTime: editingAppointment.appointmentTime,
          notes: editingAppointment.notes || "",
        }}
        validationSchema={appointmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="appointmentDate" className={fleet.modalLabel}>
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Appointment Date
                </label>
                <Field
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={`${fleet.modalInput} ${fieldError(errors, touched, "appointmentDate")}`}
                  onChange={(e) => {
                    setFieldValue("appointmentDate", e.target.value)
                    setFieldValue("appointmentTime", "")
                  }}
                />
                <ErrorMessage name="appointmentDate" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="appointmentTime" className={fleet.modalLabel}>
                  <Clock className="inline h-4 w-4 mr-2" />
                  Appointment Time
                </label>
                <Field
                  as="select"
                  id="appointmentTime"
                  name="appointmentTime"
                  className={`${fleet.modalSelect} ${fieldError(errors, touched, "appointmentTime")}`}
                >
                  <option value="">Select Time</option>
                  {getAvailableTimeSlots(values.appointmentDate).map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="appointmentTime" component="div" className="text-red-400 text-sm mt-1" />
                {values.appointmentDate && getAvailableTimeSlots(values.appointmentDate).length === 0 && (
                  <p className="text-amber-400 text-sm mt-1">
                    No available time slots for today. Please select a future date.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={fleet.modalLabel}>
                Notes (Optional)
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                rows="4"
                className={fleet.modalTextarea}
                placeholder="Any additional notes for the appointment..."
              />
              <ErrorMessage name="notes" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button type="button" onClick={closeModal} className={fleet.modalCancelBtn}>
                Cancel
              </button>
              <button type="submit" disabled={updateLoading} className={fleet.modalPrimaryBtn}>
                {updateLoading ? "Updating..." : "Update Appointment"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  )
}

export default EditAppointmentModal
