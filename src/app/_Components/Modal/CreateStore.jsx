"use client"
import { useState } from "react"
import { DollarSign, Check } from "lucide-react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import ModalShell from "./ModalShell"
import { fleet } from "../fleet/fleetTheme"

const phoneRegExp = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/;

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be less than 50 characters")
    .required("Store name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  ein: Yup.string().required("EIN is required"),
  ownerName: Yup.string().required("Owner name is required"),
  businessPhone: Yup.string()
    .matches(phoneRegExp, "Business phone must be a valid US phone number")
    .required("Business phone is required"),
  ownerPhone: Yup.string()
    .matches(phoneRegExp, "Owner phone must be a valid US phone number")
    .required("Owner phone is required"),
  storeStreet: Yup.string().required("Store street address is required"),
  storeCity: Yup.string().required("Store city is required"),
  storeState: Yup.string().required("Store state is required"),
  storeZipCode: Yup.string().required("Store ZIP code is required"),
  storeCountry: Yup.string().required("Store country is required"),
  ownerStreet: Yup.string().required("Owner street address is required"),
  ownerCity: Yup.string().required("Owner city is required"),
  ownerState: Yup.string().required("Owner state is required"),
  ownerZipCode: Yup.string().required("Owner ZIP code is required"),
  ownerCountry: Yup.string().required("Owner country is required"),
})

const initialValues = {
  name: "",
  description: "",
  ein: "",
  ownerName: "",
  businessPhone: "",
  ownerPhone: "",
  storeStreet: "",
  storeCity: "",
  storeState: "",
  storeZipCode: "",
  storeCountry: "",
  ownerStreet: "",
  ownerCity: "",
  ownerState: "",
  ownerZipCode: "",
  ownerCountry: "",
  sellerPremium: '20%',
  listingFee: '$0.35',
  advertisingFee: '$5',
  JunkItemFee: '$5',
  packagingFee: '$5',
}

const fieldError = (errors, touched, name) =>
  errors[name] && touched[name] ? "border-red-500/50" : ""

export default function CreateStoreModal({ isOpen, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error("Error creating store:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Store"
      maxWidthClass="max-w-2xl"
      zClass="z-50"
    >
      <div className="rounded-2xl p-4 mb-6 border border-white/[0.08] bg-[#161b22]">
        <div className="flex items-center justify-center gap-2 mb-1">
          <DollarSign className="h-5 w-5 text-zinc-300" />
          <span className="font-semibold text-zinc-200">One-Time Setup Fee: $50</span>
        </div>
        <p className="text-sm text-zinc-500 text-center">
          This covers store verification, lifetime access, and premium features
        </p>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, isValid }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className={fleet.modalLabel}>Store Name *</label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter your store name (e.g., John's Electronics)"
                className={`${fleet.modalInput} ${fieldError(errors, touched, "name")}`}
              />
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-400 flex items-center gap-1" />
              {values.name && !errors.name && (
                <div className="mt-1 text-sm text-green-400 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Looks good!
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className={fleet.modalLabel}>Store Description *</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={3}
                placeholder="Describe your store, what you sell, and what makes you unique..."
                className={fleet.modalTextarea}
              />
              <div className="flex justify-between items-center mt-1">
                <ErrorMessage name="description" component="div" className="text-sm text-red-400" />
                <span className={`text-sm ${values.description.length > 500 ? "text-red-400" : "text-zinc-500"}`}>
                  {values.description.length}/500
                </span>
              </div>
              {values.description && !errors.description && (
                <div className="mt-1 text-sm text-green-400 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Great description!
                </div>
              )}
            </div>

            <div>
              <label htmlFor="ein" className={fleet.modalLabel}>EIN *</label>
              <Field
                type="text"
                id="ein"
                name="ein"
                placeholder="Employer Identification Number"
                className={`${fleet.modalInput} ${fieldError(errors, touched, "ein")}`}
              />
              <ErrorMessage name="ein" component="div" className="mt-1 text-sm text-red-400" />
            </div>

            <div>
              <label htmlFor="ownerName" className={fleet.modalLabel}>Owner Name *</label>
              <Field
                type="text"
                id="ownerName"
                name="ownerName"
                placeholder="Enter owner's full name"
                className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerName")}`}
              />
              <ErrorMessage name="ownerName" component="div" className="mt-1 text-sm text-red-400" />
            </div>

            <hr className="my-2 border-t border-white/[0.06]" />
            <h3 className="text-md text-zinc-300 mb-2">Store Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="storeStreet" className={fleet.modalLabel}>Street *</label>
                <Field name="storeStreet" className={`${fleet.modalInput} ${fieldError(errors, touched, "storeStreet")}`} />
                <ErrorMessage name="storeStreet" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="storeCity" className={fleet.modalLabel}>City *</label>
                <Field name="storeCity" className={`${fleet.modalInput} ${fieldError(errors, touched, "storeCity")}`} />
                <ErrorMessage name="storeCity" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="storeState" className={fleet.modalLabel}>State *</label>
                <Field name="storeState" className={`${fleet.modalInput} ${fieldError(errors, touched, "storeState")}`} />
                <ErrorMessage name="storeState" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="storeZipCode" className={fleet.modalLabel}>ZIP Code *</label>
                <Field name="storeZipCode" className={`${fleet.modalInput} ${fieldError(errors, touched, "storeZipCode")}`} />
                <ErrorMessage name="storeZipCode" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="storeCountry" className={fleet.modalLabel}>Country *</label>
                <Field name="storeCountry" className={`${fleet.modalInput} ${fieldError(errors, touched, "storeCountry")}`} />
                <ErrorMessage name="storeCountry" component="div" className="text-sm text-red-400 mt-1" />
              </div>
            </div>

            <hr className="my-2 border-t border-white/[0.06]" />
            <h3 className="text-md text-zinc-300 mb-2">Owner Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownerStreet" className={fleet.modalLabel}>Street *</label>
                <Field name="ownerStreet" className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerStreet")}`} />
                <ErrorMessage name="ownerStreet" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="ownerCity" className={fleet.modalLabel}>City *</label>
                <Field name="ownerCity" className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerCity")}`} />
                <ErrorMessage name="ownerCity" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="ownerState" className={fleet.modalLabel}>State *</label>
                <Field name="ownerState" className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerState")}`} />
                <ErrorMessage name="ownerState" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div>
                <label htmlFor="ownerZipCode" className={fleet.modalLabel}>ZIP Code *</label>
                <Field name="ownerZipCode" className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerZipCode")}`} />
                <ErrorMessage name="ownerZipCode" component="div" className="text-sm text-red-400 mt-1" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ownerCountry" className={fleet.modalLabel}>Country *</label>
                <Field name="ownerCountry" className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerCountry")}`} />
                <ErrorMessage name="ownerCountry" component="div" className="text-sm text-red-400 mt-1" />
              </div>
            </div>

            <hr className="my-2 border-t border-white/[0.06]" />

            <div>
              <label htmlFor="businessPhone" className={fleet.modalLabel}>Business Phone *</label>
              <Field
                type="text"
                id="businessPhone"
                name="businessPhone"
                placeholder="(123) 456-7890"
                className={`${fleet.modalInput} ${fieldError(errors, touched, "businessPhone")}`}
              />
              <ErrorMessage name="businessPhone" component="div" className="mt-1 text-sm text-red-400" />
            </div>

            <div>
              <label htmlFor="ownerPhone" className={fleet.modalLabel}>Owner Phone *</label>
              <Field
                type="text"
                id="ownerPhone"
                name="ownerPhone"
                placeholder="(123) 456-7890"
                className={`${fleet.modalInput} ${fieldError(errors, touched, "ownerPhone")}`}
              />
              <ErrorMessage name="ownerPhone" component="div" className="mt-1 text-sm text-red-400" />
            </div>

            <hr className="my-2 border-t border-white/[0.06]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="sellerPremium" className={fleet.modalLabel}>Seller Premium</label>
                <Field name="sellerPremium" disabled className={`${fleet.modalInput} opacity-60 cursor-not-allowed`} />
              </div>
              <div>
                <label htmlFor="listingFee" className={fleet.modalLabel}>Listing Fee</label>
                <Field name="listingFee" disabled className={`${fleet.modalInput} opacity-60 cursor-not-allowed`} />
              </div>
              <div>
                <label htmlFor="advertisingFee" className={fleet.modalLabel}>Advertising Fee</label>
                <Field name="advertisingFee" disabled className={`${fleet.modalInput} opacity-60 cursor-not-allowed`} />
              </div>
              <div>
                <label htmlFor="JunkItemFee" className={fleet.modalLabel}>Junk Item Fee</label>
                <Field name="JunkItemFee" disabled className={`${fleet.modalInput} opacity-60 cursor-not-allowed`} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="packagingFee" className={fleet.modalLabel}>Packaging Fee</label>
                <Field name="packagingFee" disabled className={`${fleet.modalInput} opacity-60 cursor-not-allowed`} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button type="button" disabled={isSubmitting} onClick={onClose} className={fleet.modalCancelBtn}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={fleet.modalPrimaryBtn}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Create Store - $50
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  )
}
