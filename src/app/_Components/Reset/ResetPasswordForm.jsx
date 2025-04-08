"use client";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Main from "../../../app/Assets/Main.png";

// Placeholder mutation hook - replace with your actual reset mutation
import { useResetMutation } from "@/app/_Services/authentication/page";

export default function ResetPasswordForm() {
  const navigation = useRouter();

  const [resetPassword, { isLoading: isSubmitting }] = useResetMutation();

  const resetSchema = Yup.object({
    code: Yup.string().required("Reset code is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues = {
    code: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      try {
        const response = await resetPassword(values).unwrap();
        toast.success(response?.message || "Password reset successful");
        navigation.push("/login");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to reset password");
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <div className="flex py-6">
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo" height={50} />
          </Link>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Code Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Reset Code *</label>
            <input
              type="text"
              name="code"
              onChange={formik.handleChange}
              value={formik.values.code}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {formik.errors.code && formik.touched.code && (
              <span className="text-red-500 text-sm pl-2">{formik.errors.code}</span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">New Password *</label>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500 text-sm pl-2">{formik.errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <span className="text-red-500 text-sm pl-2">{formik.errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full"
          >
            {isSubmitting ? "Submitting..." : "RESET PASSWORD"}
          </button>

          <div className="mt-4 text-center">
            <p className="hover:underline cursor-pointer">
              Back to <Link className="text-[#F33E0A]" href={"/login"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
