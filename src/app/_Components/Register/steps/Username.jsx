"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormik } from "formik"
import * as Yup from "yup"
import { User, Eye, EyeOff, Lock ,Hash} from "lucide-react"
import {  useSearchParams } from "next/navigation";
import Link from "next/link";
import Main from "../../../../app/Assets/Main.png";
import Image from "next/image";

export default function Username({ onSubmit, isLoading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
      const searchParams = useSearchParams();
      const ref = searchParams.get("ref");

  const formik = useFormik({
    initialValues: {
      username: ""
    },
    validationSchema: Yup.object({
      username:Yup.string().required("username is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values?.username)
    },
  })


  return (
    <div className="p-6 pt-4">
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-30 h-30 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center"
        >
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo" />
          </Link>        </motion.div>
        <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Create Username</h2>
        <p className="text-gray-500">Tell us a unique username</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-3">
      <div className="space-y-1">
            <div
              className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "username"
                  ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                  : formik.touched.username && formik.errors.username
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
            >
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                className="w-full px-4 py-2 rounded-xl focus:outline-none text-gray-700"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e)
                  setFocusedField(null)
                }}
                onFocus={() => setFocusedField("username")}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs ml-2"
              >
                {formik.errors.username}
              </motion.p>
            )}
          </div>
       
       

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            "Continue"
          )}
        </motion.button>
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FB3B11] font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
