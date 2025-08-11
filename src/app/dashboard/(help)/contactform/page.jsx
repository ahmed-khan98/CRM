"use client"

import { useState } from "react"
import { useCreateContactFormMutation } from "@/app/_Services/contactform/page"
import { useFormik } from "formik"
import { Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { SendHorizontal, Loader2, HelpCircle, MessageSquare } from "lucide-react"
import confetti from "canvas-confetti"
import Tab from "@/app/_Components/Tab/page"
import { helpTabs } from "@/app/utilities/tabs/page"


const ContactPage = () => {
  const [createContact, { isLoading }] = useCreateContactFormMutation()
  const [submitted, setSubmitted] = useState(false)

  const contactFormSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  })

  const initialValues = {
    subject: "",
    message: "",
  }

  const formik = useFormik({
    initialValues,
    validationSchema: contactFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await createContact(values).unwrap()
        resetForm()
        setSubmitted(true)

        // Trigger confetti effect on successful submission
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F33E0A", "#FF6B3D", "#FF8C66"],
        })

        setTimeout(() => setSubmitted(false), 3000)
      } catch (error) {
        // Error handling is done via toast in the mutation
      }
    },
  })



  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 p-3 md:p-0">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto pt-4">
      <Tab tabs={helpTabs} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-1 bg-[#F33E0A] rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#F33E0A]">How can we help you?</h1>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-[#F33E0A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">We've received your message and will get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-[#F33E0A] text-white rounded-full hover:bg-[#E03400] transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium pl-4">What's this about?</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.subject}
                      className={`w-full p-4 bg-gray-50 border ${
                        formik.touched.subject && formik.errors.subject
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-[#F33E0A]"
                      } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="e.g., Account issue, Payment problem, etc."
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 pl-4"
                      >
                        {formik.errors.subject}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium pl-4">Tell us more</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.message}
                      rows={6}
                      className={`w-full p-4 bg-gray-50 border ${
                        formik.touched.message && formik.errors.message
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-[#F33E0A]"
                      } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Describe your issue or question in detail..."
                    />
                    {formik.touched.message && formik.errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 pl-4"
                      >
                        {formik.errors.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden px-8 py-4 bg-[#F33E0A] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <SendHorizontal className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage
