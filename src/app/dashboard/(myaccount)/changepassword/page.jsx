"use client";
import { useFormik } from "formik";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";

// Placeholder mutation hook - replace with your actual reset mutation
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
        <div className='flex justify-start gap-4 mt-4 flex-wrap w-full'>
            <MyAccountTab/>
        <div className="w-full px-8 py-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#242424] text-[24px] font-bold">Change Password</h3>
                <div className="flex gap-2">
                </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="max-w-md items-center py-4">
              
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Current Password *</label>
                    <input
                        type="Password"
                        name="oldPassword"
                        onChange={formik.handleChange}
                        value={formik.values.oldPassword}
                        className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {formik.errors.oldPassword && formik.touched.oldPassword && (
                        <span className="text-red-500 text-sm pl-2">{formik.errors.oldPassword}</span>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Confirm Password *</label>
                    <input
                        type="password"
                        name="newPassword"
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                        className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {formik.errors.newPassword && formik.touched.newPassword && (
                        <span className="text-red-500 text-sm pl-2">{formik.errors.newPassword}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-[50%] cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full"
                >
                    {isSubmitting ? "Submitting..." : "Change password"}
                </button>

              
            </form>
        </div>
        </div>
    );
}
