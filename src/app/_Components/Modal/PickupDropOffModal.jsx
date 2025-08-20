"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { X, Calendar, Clock, Truck } from "lucide-react"
import { toast } from "react-hot-toast"
import Select from "react-select";
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { formatPhoneNumber } from "@/app/utilities/phoneFormat"
import { useCreatePickDropAppointmentMutation, useUpdatePickDropAppointmentMutation } from "@/app/_Services/pickupDropoff/page"
import { useAllFilterBoxProductQuery } from "@/app/_Services/Box/page"

// Validation schemas
const pickupSchema = Yup.object().shape({
    type: Yup.string().required("Please select a appointment type"),
    appointmentDate: Yup.date().required("Appointment date is required"),
    // .min(new Date(), "Date must be in the future"),
    appointmentTime: Yup.string().required("Appointment time is required"),
    notes: Yup.string().max(500, "Notes must be less than 500 characters"),
    boxes: Yup.array()
        .min(1, "At least one box is required")
        .required("Please select at least one box"),
})

const PickupDropOffModal = ({ isOpen, closeModal, data, refetch }) => {

    const [createPickDropAppointment] = useCreatePickDropAppointmentMutation()
    const [updatePickDropAppointment] = useUpdatePickDropAppointmentMutation()
    const { data: boxes, error: isError, isLoading } = useAllFilterBoxProductQuery()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await (
                data
                    ? createPickDropAppointment({ ...values }).unwrap()
                    : updatePickDropAppointment({ ...values, id: data?._id }).unwrap()
            );

            if (response.success) {
                toast.success(
                    data
                        ? "Appointment updated successfully!"
                        : "Appointment created successfully!",
                )
            } else {
                toast.error(response.message || "Failed to process appointment")
            }
            resetForm()
            closeModal()
            refetch()
        } catch (error) {
            console.log(error, 'error')
            toast.error(error.data?.message || "Failed to submit delivery method")
        } finally {
            setSubmitting(false)
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", damping: 25, stiffness: 300 },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: { duration: 0.2 },
        },
    }

    const initialValues = {
        type: data?.type || '',
        appointmentDate: data?.appointmentDate || '',
        appointmentTime: data?.appointmentTime || '',
        notes: data?.notes || '',
        boxes: data?.boxes || []
    };

    const boxOptions = boxes?.data?.map(e => ({
        label: `${e?.note} | ${e?.note} `,
        value: e?._id
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={closeModal}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-2 md:px-8 py-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-1 md:gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg mdtext-2xl font-bold">Choose Appointment Type</h2>
                                        <p className="text-red-100 mt-1">How would you like to drop your Box?</p>
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

                        {/* Form */}
                        <div className="px-6 md:px-8 py-6 max-h-[60vh] overflow-y-auto">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={pickupSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                                    console.log(values, 'values')
                                    console.log(errors, 'errors')
                                    // if (values.type !== selectedMethod) {
                                    //     setSelectedMethod(values.type)
                                    // }

                                    return (
                                        <Form className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    <Truck className="inline w-4 h-4 mr-2" />
                                                    Appointment Type                                                </label>
                                                <Field
                                                    as="select"
                                                    name="type"
                                                    className={`w-full px-4 py-3 border-2 ${errors.type && touched.type
                                                        ? "border-red-300 focus:border-oarnge-500"
                                                        : "border-gray-200 focus:border-oarnge-500"
                                                        } rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                                                >
                                                    <option value="">Select Appointment Type...</option>
                                                    <option value="pickup">Pickup</option>
                                                    <option value="dropoff">Drop Off</option>
                                                </Field>
                                                <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Calendar className="inline w-4 h-4 mr-1" />
                                                        Appointment Date
                                                    </label>
                                                    <Field
                                                        type="date"
                                                        name="appointmentDate"
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className={`w-full px-4 py-3 border-2 ${errors.appointmentDate && touched.appointmentDate
                                                            ? "border-red-300 focus:border-oarnge-500"
                                                            : "border-gray-200 focus:border-blue-500"
                                                            } rounded-xl focus:outline-none transition-colors`}
                                                    />
                                                    <ErrorMessage
                                                        name="appointmentDate"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Clock className="inline w-4 h-4 mr-1" />
                                                        Appointment Time
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        name="appointmentTime"
                                                        className={`w-full px-4 py-3 border-2 ${errors.appointmentTime && touched.appointmentTime
                                                            ? "border-red-300 focus:border-oarnge-500"
                                                            : "border-gray-200 focus:border-blue-500"
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
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-start text-gray-700 mb-1">
                                                    Boxes
                                                </label>

                                                <Select
                                                    options={boxOptions}
                                                    isMulti
                                                    menuPortalTarget={document.body}
                                                    placeholder="Select or type to add..."
                                                    value={boxOptions?.filter(opt => values?.boxes?.includes(opt.value))}
                                                    onChange={(selected) => {
                                                        const ids = selected?.map(s => s.value);
                                                        setFieldValue("boxes", ids);
                                                    }}
                                                    className="text-sm text-start"
                                                    classNamePrefix="react-select"
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        control: (base) => ({
                                                            ...base,
                                                            borderRadius: "0.75rem",
                                                            padding: "0.25rem",
                                                            borderColor: errors.boxes && touched.boxes ? "red" : base.borderColor
                                                        })
                                                    }}
                                                    onBlur={() => setFieldTouched("boxes", true)}
                                                />

                                                {errors.boxes && touched.boxes && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.boxes}</p>
                                                )}

                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {values?.boxes?.map((id) => {
                                                        const product = boxOptions?.find(opt => opt.value === id);
                                                        return (
                                                            <span
                                                                key={id}
                                                                className="inline-flex items-center bg-green-300 text-green-800 text-sm px-3 py-1 rounded-full text-start"
                                                            >
                                                                {product?.label || id}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFieldValue("boxes", values?.boxes?.filter(p => p !== id))
                                                                    }
                                                                    className="ml-2 text-white/80 hover:text-white"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                                <Field
                                                    as="textarea"
                                                    name="notes"
                                                    rows="3"
                                                    placeholder="Any special instructions or notes..."
                                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors resize-none"
                                                />
                                                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <div className="flex gap-2 md:gap-4 pt-2">
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={closeModal}
                                                    className="flex-1 px-3 md:px-6 py-4 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </motion.button>

                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 px-3 md:px-6 py-4 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Processing...
                                                        </div>
                                                    ) : values?.type === "pickup" ? (
                                                        "Submit Pickup"
                                                    ) : values?.type === "drop off" ? (
                                                        "Schedule  Drop Off"
                                                    ) : (
                                                        "Continue"
                                                    )}
                                                </motion.button>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PickupDropOffModal
