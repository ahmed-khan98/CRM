"use client";

import { useState } from "react";
import { useForgetMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AtSign, KeyRound, ArrowLeft } from "lucide-react";
import Main from "../../../app/Assets/logo-ppi.png";

export default function GenZForgetForm() {
  const navigation = useRouter();
  const [forgotForm, { isLoading: isSubmitting }] = useForgetMutation();
  const [focusedField, setFocusedField] = useState(null);

  const forgetSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const ForgetInitialValue = {
    email: "",
  };

  const formik = useFormik({
    initialValues: ForgetInitialValue,
    enableReinitialize: true,
    validationSchema: forgetSchema,
    onSubmit: async (values) => {
      try {
        const response = await forgotForm({ email: values?.email }).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message);
          navigation.push("/reset");
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 mx-4"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-64 h-24 mx-auto mb-2 rounded-full bg-[#3C3360] flex items-center justify-center"
              >
                <Link href="/login" className="mx-auto">
                  <Image src={Main} alt="Logo" width={270} height={60} />
                </Link>
              </motion.div>
              {/* <h2 className="text-2xl font-bold mb-1 text-[#5f2781]">
                Forgot Password?
              </h2> */}
              <p className="text-gray-500 font-normal">
                Forgot Password?
                {/* Enter your email to reset your password */}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <div
                  className={`relative border-1 rounded-xl transition-all duration-300 ${
                    focusedField === "email"
                      ? "border-[#5f2781] shadow-sm shadow-orange-100"
                      : formik.touched.email && formik.errors.email
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl focus:outline-none text-gray-700"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField("email")}
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
                disabled={isSubmitting}
                className="w-full bg-[#5f2781] hover:bg-[#4f1f6d] cursor-pointer text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 border-1 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "SUBMIT"
                )}
              </motion.button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-[#5f2781] text-sm font-medium flex items-center justify-center mx-auto hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
