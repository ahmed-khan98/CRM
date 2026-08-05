"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Calendar, Clock, MapPin, Truck, Package } from "lucide-react"
import { toast } from "react-hot-toast"
import Cookies from "js-cookie";
import { useCreateAppointmentMutation } from "@/app/_Services/appointment/page"
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { useCreateShippingRequestMutation } from "@/app/_Services/shippingRequest/page"
import { formatPhoneNumber } from "@/app/utilities/phoneFormat"
import ModalShell from "./ModalShell"
import { fleet } from "../fleet/fleetTheme"

// Validation schemas
const pickupSchema = Yup.object().shape({
    deliveryMethod: Yup.string().required("Please select a delivery method"),
    appointmentDate: Yup.date().required("Appointment date is required"),
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
    contactPhone: Yup.string().required("Mobile Number is required"),
})

const fieldError = (errors, touched, name) =>
    errors[name] && touched[name] ? "border-red-500/50" : ""

const PickupScheduleModal = ({ isOpen, onClose, auctionWin }) => {

    const [selectedMethod, setSelectedMethod] = useState("")
    const [createAppointment] = useCreateAppointmentMutation()
    const [createShippingRequest] = useCreateShippingRequestMutation()

    const getValidationSchema = (method) => {
        return method === "pickup" ? pickupSchema : shippingSchema
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
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

    const user = Cookies.get("currentuser")
      ? JSON.parse(Cookies.get("currentuser"))
      : null;
    
    const initialValues = {
      deliveryMethod: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: "",
      contactPhone: user?.phone || "",
    };

    return (
        <ModalShell
            isOpen={isOpen}
            onClose={onClose}
            title="Choose Delivery Method"
            maxWidthClass="max-w-2xl"
            zClass="z-50"
        >
            {auctionWin && (
                <div className="mb-4 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#1c2330] rounded-2xl flex items-center justify-center border border-white/10">
                            <img
                                src={auctionWin?.product?.images?.[0]}
                                alt="Product-img"
                                className="w-12 h-12 object-cover rounded-lg"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{auctionWin.product?.name}</h3>
                            <p className="text-zinc-400 font-semibold">Won for ${auctionWin.product.highestBid}</p>
                        </div>
                    </div>
                </div>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={getValidationSchema(selectedMethod)}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                    if (values.deliveryMethod !== selectedMethod) {
                        setSelectedMethod(values.deliveryMethod)
                    }

                    return (
                        <Form className="space-y-6">
                            <div>
                                <label className={fleet.modalLabel}>
                                    <Truck className="inline w-4 h-4 mr-2" />
                                    Delivery Method
                                </label>
                                <Field
                                    as="select"
                                    name="deliveryMethod"
                                    className={`${fleet.modalSelect} ${fieldError(errors, touched, "deliveryMethod")}`}
                                >
                                    <option value="">Select delivery method...</option>
                                    <option value="pickup">🏪 Pickup from Store</option>
                                    <option value="shipping">🚚 Home Delivery (Request Shipping)</option>
                                </Field>
                                <ErrorMessage name="deliveryMethod" component="div" className="text-red-400 text-sm mt-2" />
                            </div>

                            <AnimatePresence>
                                {selectedMethod === "pickup" && (
                                    <motion.div
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#161b22]/80 space-y-4">
                                            <h3 className="font-bold text-zinc-200 flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                Schedule Pickup Appointment
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={fleet.modalLabel}>
                                                        <Calendar className="inline w-4 h-4 mr-1" />
                                                        Appointment Date
                                                    </label>
                                                    <Field
                                                        type="date"
                                                        name="appointmentDate"
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className={`${fleet.modalInput} ${fieldError(errors, touched, "appointmentDate")}`}
                                                    />
                                                    <ErrorMessage name="appointmentDate" component="div" className="text-red-400 text-sm mt-1" />
                                                </div>

                                                <div>
                                                    <label className={fleet.modalLabel}>
                                                        <Clock className="inline w-4 h-4 mr-1" />
                                                        Appointment Time
                                                    </label>
                                                    <Field
                                                        as="select"
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
                                                </div>
                                            </div>

                                            <div>
                                                <label className={fleet.modalLabel}>Notes (Optional)</label>
                                                <Field
                                                    as="textarea"
                                                    name="notes"
                                                    rows="3"
                                                    placeholder="Any special instructions or notes..."
                                                    className={fleet.modalTextarea}
                                                />
                                                <ErrorMessage name="notes" component="div" className="text-red-400 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {selectedMethod === "shipping" && (
                                    <motion.div
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#161b22]/80 space-y-4">
                                            <h3 className="font-bold text-zinc-200 flex items-center gap-2">
                                                <MapPin className="w-5 h-5" />
                                                Shipping Address
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className={fleet.modalLabel}>Street Address</label>
                                                    <Field
                                                        type="text"
                                                        name="street"
                                                        placeholder="Enter your street address"
                                                        className={`${fleet.modalInput} ${fieldError(errors, touched, "street")}`}
                                                    />
                                                    <ErrorMessage name="street" component="div" className="text-red-400 text-sm mt-1" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={fleet.modalLabel}>City</label>
                                                        <Field
                                                            type="text"
                                                            name="city"
                                                            placeholder="Enter city"
                                                            className={`${fleet.modalInput} ${fieldError(errors, touched, "city")}`}
                                                        />
                                                        <ErrorMessage name="city" component="div" className="text-red-400 text-sm mt-1" />
                                                    </div>

                                                    <div>
                                                        <label className={fleet.modalLabel}>State</label>
                                                        <Field
                                                            type="text"
                                                            name="state"
                                                            placeholder="Enter state"
                                                            className={`${fleet.modalInput} ${fieldError(errors, touched, "state")}`}
                                                        />
                                                        <ErrorMessage name="state" component="div" className="text-red-400 text-sm mt-1" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={fleet.modalLabel}>ZIP Code</label>
                                                        <Field
                                                            type="text"
                                                            name="zipCode"
                                                            placeholder="12345"
                                                            className={`${fleet.modalInput} ${fieldError(errors, touched, "zipCode")}`}
                                                        />
                                                        <ErrorMessage name="zipCode" component="div" className="text-red-400 text-sm mt-1" />
                                                    </div>
                                                    <div>
                                                        <label className={fleet.modalLabel}>Contact Number</label>
                                                        <Field
                                                            type="tel"
                                                            name="contactPhone"
                                                            onChange={(e) => {
                                                                const formattedValue = formatPhoneNumber(e.target.value);
                                                                setFieldValue('contactPhone', formattedValue);
                                                            }}
                                                            placeholder="+1 (555) 123-4567"
                                                            className={`${fleet.modalInput} ${fieldError(errors, touched, "contactPhone")}`}
                                                        />
                                                        <ErrorMessage name="contactPhone" component="div" className="text-red-400 text-sm mt-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                                <button type="button" onClick={onClose} className={fleet.modalCancelBtn}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedMethod}
                                    className={fleet.modalPrimaryBtn}
                                >
                                    {isSubmitting ? "Processing..." : selectedMethod === "pickup" ? "Schedule Pickup" : selectedMethod === "shipping" ? "Submit Request" : "Continue"}
                                </button>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </ModalShell>
    )
}

export default PickupScheduleModal
