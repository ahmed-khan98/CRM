"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormik } from "formik"
import {  Phone} from "lucide-react"
import Link from "next/link";
import Main from "../../../../app/Assets/Main.png";
import Image from "next/image";

export default function PhoneNo({ onSubmit, isLoading }) {

  const [focusedField, setFocusedField] = useState(null)

  const formik = useFormik({
    initialValues: {
      phone: ""
    },
    onSubmit: (values) => {
      onSubmit(values.phone)
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
        <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Phone No.</h2>
        {/* <p className="text-gray-500">Optional?</p> */}
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-3">

          <div className="space-y-1">
          <div
            className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "phone"
                ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                : formik.touched.phone && formik.errors.phone
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
          >
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="03001234567"
              className="w-full pl-10 pr-10 py-2 rounded-xl focus:outline-none text-gray-700"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e)
                setFocusedField(null)
              }}
              onFocus={() => setFocusedField("phone")}
            />
           
          </div>
       
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
              Create Account...
            </div>
          ) : (
            "Create Account"
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
