"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { X, Calendar, Clock, MapPin, Phone, Truck, Package } from "lucide-react"
import { toast } from "react-hot-toast"
import { useCreateAppointmentMutation } from "@/app/_Services/appointment/page"
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { useCreateShippingRequestMutation } from "@/app/_Services/shippingRequest/page"

// Validation schemas
const pickupSchema = Yup.object().shape({
    deliveryMethod: Yup.string().required("Please select a delivery method"),
    appointmentDate: Yup.date().required("Appointment date is required").min(new Date(), "Date must be in the future"),
    appointmentTime: Yup.string().required("Appointment time is required"),
    notes: Yup.string().max(500, "Notes must be less than 500 characters"),
})

const shippingSchema = Yup.object().shape({
    deliveryMethod: Yup.string().required("Please select a delivery method"),
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string()
        .required("ZIP code is required")
        .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
    country: Yup.string().required("Country is required"),
    contactPhone: Yup.string().required("Mobile Number is required"),

    // contactPhone: Yup.string()
    //     .required("Contact number is required")
    //     .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
    // contactPhone: Yup.string()
    // .required("Contact number is required")
    // .matches(
    //   /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/,
    //   "Enter a valid US phone number"
    // )


})

function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 1) {
        return cleaned; // "1"
    } else if (cleaned.length <= 4) {
        return `${cleaned[0]}-(${cleaned.slice(1)}`; // "1-(234"
    } else if (cleaned.length <= 7) {
        return `${cleaned[0]}-(${cleaned.slice(1, 4)})-${cleaned.slice(4)}`; // "1-(234)-567"
    } else {
        return `${cleaned[0]}-(${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`; // "1-(234)-567-8901"
    }
}

const PickupScheduleModal = ({ isOpen, onClose, auctionWin }) => {

    const [selectedMethod, setSelectedMethod] = useState("")
    const [createAppointment] = useCreateAppointmentMutation()
    const [createShippingRequest] = useCreateShippingRequestMutation()


    const getValidationSchema = (method) => {
        return method === "pickup" ? pickupSchema : shippingSchema
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log( values?.deliveryMethod,'----->>>>>>>>>method')
        try {
            const response = await (
                values?.deliveryMethod === "pickup"
                    ? createAppointment({ ...values, auctionWin: auctionWin?._id }).unwrap()
                    : createShippingRequest({ ...values, auctionWin: auctionWin?._id }).unwrap()
            );
            if (response.success) {
                toast.success(
                    selectedMethod === "pickup"
                        ? "Pickup appointment scheduled successfully!"
                        : "Shipping request submitted successfully!",
                )
            } else {
                toast.error(response.message || "Failed to process appointment")
            }
            resetForm()
            setSelectedMethod("")
            onClose()
        } catch (error) {
            console.log(error,'error')
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

    const fieldVariants = {
        hidden: { opacity: 0, y: 20, height: 0 },
        visible: {
            opacity: 1,
            y: 0,
            height: "auto",
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -20,
            height: 0,
            transition: { duration: 0.2 },
        },
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={onClose}
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
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Choose Delivery Method</h2>
                                        <p className="text-red-100 mt-1">How would you like to receive your product?</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Product Info */}
                        {auctionWin && (
                            <div className="px-8 py-3 bg-red-50 border-b border-red-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                        {/* <Package className="w-8 h-8 text-red-600" /> */}
                                        <img
                                            src={auctionWin?.product?.images?.[0]}
                                            alt="Product-img"
                                            className="w-12 h-12"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{auctionWin.product?.name}</h3>
                                        <p className="text-red-600 font-semibold">Won for ${auctionWin.product.highestBid}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                            <Formik
                                initialValues={{
                                    deliveryMethod: "",
                                    // Pickup fields
                                    appointmentDate: "",
                                    appointmentTime: "",
                                    notes: "",
                                    // Shipping fields
                                    street: "",
                                    city: "",
                                    state: "",
                                    zipCode: "",
                                    country: "",
                                    contactPhone: "",
                                }}
                                validationSchema={getValidationSchema(selectedMethod)}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                                    // Update selected method when form value changes
                                    console.log(values, 'values')
                                    console.log(errors, 'errors')
                                    if (values.deliveryMethod !== selectedMethod) {
                                        setSelectedMethod(values.deliveryMethod)
                                    }

                                    return (
                                        <Form className="space-y-6">
                                            {/* Delivery Method Dropdown */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    <Truck className="inline w-4 h-4 mr-2" />
                                                    Delivery Method
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="deliveryMethod"
                                                    className={`w-full px-4 py-3 border-2 ${errors.deliveryMethod && touched.deliveryMethod
                                                        ? "border-red-300 focus:border-oarnge-500"
                                                        : "border-gray-200 focus:border-oarnge-500"
                                                        } rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                                                >
                                                    <option value="">Select delivery method...</option>
                                                    <option value="pickup">🏪 Pickup from Store</option>
                                                    <option value="shipping">🚚 Home Delivery (Request Shipping)</option>
                                                </Field>
                                                <ErrorMessage name="deliveryMethod" component="div" className="text-oarnge-500 text-sm mt-2" />
                                            </div>

                                            {/* Pickup Fields */}
                                            <AnimatePresence>
                                                {selectedMethod === "pickup" && (
                                                    <motion.div
                                                        variants={fieldVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="space-y-6"
                                                    >
                                                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                                            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                                                <Calendar className="w-5 h-5" />
                                                                Schedule Pickup Appointment
                                                            </h3>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                                                        className="text-oarnge-500 text-sm mt-1"
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
                                                                        className="text-oarnge-500 text-sm mt-1"
                                                                    />
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
                                                                <ErrorMessage name="notes" component="div" className="text-oarnge-500 text-sm mt-1" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Shipping Fields */}
                                            <AnimatePresence>
                                                {selectedMethod === "shipping" && (
                                                    <motion.div
                                                        variants={fieldVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="space-y-6"
                                                    >
                                                        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                                            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                                                                <MapPin className="w-5 h-5" />
                                                                Shipping Address
                                                            </h3>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                                                    <Field
                                                                        type="text"
                                                                        name="street"
                                                                        placeholder="Enter your street address"
                                                                        className={`w-full px-4 py-3 border-2 ${errors.street && touched.street
                                                                            ? "border-red-300 focus:border-oarnge-500"
                                                                            : "border-gray-200 focus:border-green-500"
                                                                            } rounded-xl focus:outline-none transition-colors`}
                                                                    />
                                                                    <ErrorMessage name="street" component="div" className="text-oarnge-500 text-sm mt-1" />
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                                        <Field
                                                                            type="text"
                                                                            name="city"
                                                                            placeholder="Enter city"
                                                                            className={`w-full px-4 py-3 border-2 ${errors.city && touched.city
                                                                                ? "border-red-300 focus:border-oarnge-500"
                                                                                : "border-gray-200 focus:border-green-500"
                                                                                } rounded-xl focus:outline-none transition-colors`}
                                                                        />
                                                                        <ErrorMessage name="city" component="div" className="text-oarnge-500 text-sm mt-1" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                                        <Field
                                                                            type="text"
                                                                            name="state"
                                                                            placeholder="Enter state"
                                                                            className={`w-full px-4 py-3 border-2 ${errors.state && touched.state
                                                                                ? "border-red-300 focus:border-oarnge-500"
                                                                                : "border-gray-200 focus:border-green-500"
                                                                                } rounded-xl focus:outline-none transition-colors`}
                                                                        />
                                                                        <ErrorMessage name="state" component="div" className="text-oarnge-500 text-sm mt-1" />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                                                        <Field
                                                                            type="text"
                                                                            name="zipCode"
                                                                            placeholder="12345"
                                                                            className={`w-full px-4 py-3 border-2 ${errors.zipCode && touched.zipCode
                                                                                ? "border-red-300 focus:border-oarnge-500"
                                                                                : "border-gray-200 focus:border-green-500"
                                                                                } rounded-xl focus:outline-none transition-colors`}
                                                                        />
                                                                        <ErrorMessage
                                                                            name="zipCode"
                                                                            component="div"
                                                                            className="text-oarnge-500 text-sm mt-1"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                                                        <Field
                                                                            as="select"
                                                                            name="country"
                                                                            className={`w-full px-4 py-3 border-2 ${errors.country && touched.country
                                                                                ? "border-red-300 focus:border-oarnge-500"
                                                                                : "border-gray-200 focus:border-green-500"
                                                                                } rounded-xl focus:outline-none transition-colors`}
                                                                        >
                                                                            <option value="">Select country...</option>
                                                                            <option value="US">United States</option>
                                                                            <option value="CA">Canada</option>
                                                                            <option value="UK">United Kingdom</option>
                                                                            <option value="AU">Australia</option>
                                                                            <option value="PK">Pakistan</option>
                                                                            <option value="IN">India</option>
                                                                        </Field>
                                                                        <ErrorMessage
                                                                            name="country"
                                                                            component="div"
                                                                            className="text-oarnge-500 text-sm mt-1"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        <Phone className="inline w-4 h-4 mr-1" />
                                                                        Contact Number
                                                                    </label>
                                                                    <Field
                                                                        type="tel"
                                                                        name="contactPhone"
                                                                        onChange={(e) => {
                                                                            const formattedValue = formatPhoneNumber(e.target.value);
                                                                            setFieldValue('contactPhone', formattedValue); // Update Formik's state
                                                                        }}
                                                                        placeholder="+1 (555) 123-4567"
                                                                        className={`w-full px-4 py-3 border-2 ${errors.contactPhone && touched.contactPhone
                                                                            ? "border-red-300 focus:border-oarnge-500"
                                                                            : "border-gray-200 focus:border-green-500"
                                                                            } rounded-xl focus:outline-none transition-colors`}
                                                                    />
                                                                    <ErrorMessage
                                                                        name="contactPhone"
                                                                        component="div"
                                                                        className="text-oarnge-500 text-sm mt-1"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Submit Button */}
                                            <div className="flex gap-4 pt-6">
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={onClose}
                                                    className="flex-1 px-6 py-4 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </motion.button>

                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting || !selectedMethod}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 px-6 py-4 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Processing...
                                                        </div>
                                                    ) : selectedMethod === "pickup" ? (
                                                        "Schedule Pickup"
                                                    ) : selectedMethod === "shipping" ? (
                                                        "Submit Shipping Request"
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

export default PickupScheduleModal
