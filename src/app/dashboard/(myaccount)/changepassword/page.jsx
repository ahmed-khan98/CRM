"use client";
import { useFormik } from "formik";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { SendHorizontal, Loader2 } from "lucide-react";
import Tab from "@/app/_Components/Tab/page";
import { myAccountTabs } from "@/app/utilities/tabs/page";
import { useChangePasswordMutation } from "@/app/_Services/authentication/page";

export default function page() {
  const navigation = useRouter();

  const [changePassword, { isLoading: isSubmitting }] =
    useChangePasswordMutation();

  const resetSchema = Yup.object({
    oldPassword: Yup.string()
      .min(8, "Current Password must be at least 8 characters")
      .required("Current Password is required"),

    newPassword: Yup.string()
      .min(8, "New Password must be at least 8 characters")
      .required("New Password is required")
      .notOneOf(
        [Yup.ref("oldPassword")],
        "New Password must be different from current Password"
      ),
  });

  const initialValues = {
    oldPassword: "",
    newPassword: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      try {
        const response = await changePassword(values).unwrap();
        toast.success(response?.message || "Password Change successfully");
        navigation.push("/login");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to change password");
      }
    },
  });

  return (
    <div className="min-h-screen  py-4 p-3 md:p-0">
      <div className="max-w-5xl mx-auto pt-4">
        <Tab tabs={myAccountTabs} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="my-6 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-1 bg-[#5f2781] rounded-full"></div>
              <h1 className="text-2xl  font-semibold text-[#5f2781]">
                Change Password
              </h1>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="max-w-md items-center py-4 space-y-4"
            >
              <div className="mbg-[#5f2781]">
                <label className="block text-gray-700 font-medium mb-1">
                  Current Password *
                </label>
                <input
                  type="Password"
                  name="oldPassword"
                  onChange={formik.handleChange}
                  value={formik.values.oldPassword}
                  className={`w-full p-4 bg-gray-50 border ${
                    formik.touched.oldPassword && formik.errors.oldPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-[#5f2781]"
                  } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                  // className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 pl-4"
                  >
                    {formik.errors.oldPassword}
                  </motion.p>
                )}
              </div>

              <div className="mbg-[#5f2781]">
                <label className="block text-gray-700 font-medium mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  className={`w-full p-4 bg-gray-50 border ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-[#5f2781]"
                  } rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200`}
                  // className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 pl-4"
                  >
                    {formik.errors.newPassword}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative cursor-pointer overflow-hidden px-8 py-4 bg-[#5f2781] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Change password{" "}
                      <SendHorizontal className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
