"use client";
import { useFormik } from "formik";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion"
import { SendHorizontal, Loader2 } from "lucide-react"



import { useChangePasswordMutation, useResetMutation } from "@/app/_Services/authentication/page";
import MyAccountTab from "@/app/_Components/Tab/MyAccountTab";

export default function page() {
    const navigation = useRouter();

    const [changePassword, { isLoading: isSubmitting }] = useChangePasswordMutation();

    const resetSchema = Yup.object({
        oldPassword: Yup.string()
            .min(8, "Current Password must be at least 8 characters")
            .required("Current Password is required"),

        newPassword: Yup.string()
            .min(8, "New Password must be at least 8 characters")
            .required("New Password is required")
            .notOneOf([Yup.ref('oldPassword')], 'New Password must be different from current Password'),
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
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 p-3 md:p-0">
            <div className="max-w-5xl mx-auto pt-4">
                

                <MyAccountTab />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="my-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-10 md:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-1 bg-[#F33E0A] rounded-full"></div>
                            <h1 className="text-2xl md:text-3xl font-bold text-[#F33E0A]">Change Password</h1>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="max-w-md items-center py-4">

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Current Password *</label>
                                <input
                                    type="Password"
                                    name="oldPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.oldPassword}
                                    className={`w-full p-4 bg-gray-50 border ${formik.touched.oldPassword && formik.errors.oldPassword
                                        ? "border-red-300 focus:ring-red-500"
                                        : "border-gray-200 focus:ring-[#F33E0A]"
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

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Confirm Password *</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.newPassword}
                                    className={`w-full p-4 bg-gray-50 border ${formik.touched.newPassword && formik.errors.newPassword
                                        ? "border-red-300 focus:ring-red-500"
                                        : "border-gray-200 focus:ring-[#F33E0A]"
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
                                className="group relative overflow-hidden px-8 py-4 bg-[#F33E0A] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                            >
                                <span className="relative flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Change password                          <SendHorizontal className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
