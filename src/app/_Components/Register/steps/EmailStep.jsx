"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormik } from "formik"
import * as Yup from "yup"
import Link from "next/link";
import { ArrowRight } from "lucide-react"
import Main from "../../../../app/Assets/Main.png";
import Image from "next/image";


export default function GenZEmailStep({ onSubmit, isLoading, initialEmail = "" }) {
  const [focused, setFocused] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: initialEmail,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("That doesn't look right 🤔").required("We need your email to continue"),
    }),
    onSubmit: (values) => {
      onSubmit(values.email)
    },
  })

  return (
    <div className="p-6 pt-4">
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-30 h-30 mx-auto mbg-zinc-800 rounded-full bg-orange-100 flex items-center justify-center"
        >
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo"  />
          </Link>
        </motion.div>
        <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Let's get started</h2>
        <p className="text-gray-500">Enter your email to create an account</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div
            className={`relative border-2 rounded-xl transition-all duration-300 ${
              focused
                ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                : formik.touched.email && formik.errors.email
                  ? "border-red-300"
                  : "border-gray-200"
            }`}
          >
            <input
              type="email"
              name="email"
              id="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-3.5 rounded-xl focus:outline-none text-gray-700"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e)
                setFocused(false)
              }}
              onFocus={() => setFocused(true)}
              autoComplete="email"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm ml-2"
            >
              {formik.errors.email}
            </motion.p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center">
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          )}
        </motion.button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#FB3B11] font-medium hover:underline">
            Sign in
          </a>
        </div>
      </form>
    </div>
  )
}
