import React from 'react'
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Calendar, Clock, Edit, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useUpdateAppointmentMutation } from '@/app/_Services/appointment/page'


const appointmentSchema = Yup.object().shape({
  appointmentDate: Yup.date().required("Date is required"),
  appointmentTime: Yup.string().required("Time is required"),
  notes: Yup.string(),
})

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const EditAppointmentModal = ({isModalOpen,editingAppointment,closeModal,refetch}) => {
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

  return (
    <AnimatePresence>
          {isModalOpen && editingAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
           
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Edit className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Edit Appointment</h2>
                                        <p className="text-red-100 mt-1">Update your appointment details</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>

                <div className="p-6">
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
                            <label htmlFor="appointmentDate" className="block text-sm font-semibold text-gray-700 mb-2">
                              <Calendar className="inline h-4 w-4 mr-2 text-red-600" />
                              Appointment Date
                            </label>
                            <Field
                              id="appointmentDate"
                              name="appointmentDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              className={`w-full px-4 py-3 border-2 ${
                                errors.appointmentDate && touched.appointmentDate
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-red-500"
                              } rounded-xl focus:outline-none transition-colors`}
                              onChange={(e) => {
                                setFieldValue("appointmentDate", e.target.value)
                                // Reset time when date changes
                                setFieldValue("appointmentTime", "")
                              }}
                            />
                            <ErrorMessage
                              name="appointmentDate"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="appointmentTime" className="block text-sm font-semibold text-gray-700 mb-2">
                              <Clock className="inline h-4 w-4 mr-2 text-red-600" />
                              Appointment Time
                            </label>
                            <Field
                              as="select"
                              id="appointmentTime"
                              name="appointmentTime"
                              className={`w-full px-4 py-3 border-2 ${
                                errors.appointmentTime && touched.appointmentTime
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-red-500"
                              } rounded-xl focus:outline-none transition-colors`}
                            >
                              <option value="">Select Time</option>
                              {getAvailableTimeSlots(values.appointmentDate).map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="appointmentTime"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                            {values.appointmentDate && getAvailableTimeSlots(values.appointmentDate).length === 0 && (
                              <p className="text-amber-600 text-sm mt-1">
                                ⚠️ No available time slots for today. Please select a future date.
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                            Notes (Optional)
                          </label>
                          <Field
                            as="textarea"
                            id="notes"
                            name="notes"
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-500 rounded-xl focus:outline-none transition-colors resize-none"
                            placeholder="Any additional notes for the appointment..."
                          />
                          <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={updateLoading}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 transition-all"
                          >
                            {updateLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                              </div>
                            ) : (
                              "Update Appointment"
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={closeModal}
                            className="px-3 py-3 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Cancel
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
  )
}

export default EditAppointmentModal