"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Loader2, Lock, KeyRound, ShieldCheck } from "lucide-react";
import Tab from "@/app/_Components/Tab/page";
import { myAccountTabs } from "@/app/utilities/tabs/page";
import { useChangePasswordMutation } from "@/app/_Services/authentication/page";

export default function page() {
  const navigation = useRouter();
  const [changePassword, { isLoading: isSubmitting }] =
    useChangePasswordMutation();

  const resetSchema = Yup.object({
    oldPassword: Yup.string()
      .min(8, "Current password must be at least 8 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "New password must be at least 8 characters")
      .required("New password is required")
      .notOneOf(
        [Yup.ref("oldPassword")],
        "New password must be different from current password"
      ),
  });

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      try {
        const response = await changePassword(values).unwrap();
        toast.success(response?.message || "Password changed successfully");
        navigation.push("/login");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to change password");
      }
    },
  });

  const fieldClass = (touched, error) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-1 ${
      touched && error
        ? "border-rose-500/50 bg-[#121212] focus:border-rose-400 focus:ring-rose-500/20"
        : "border-[#27272a] bg-[#121212] focus:border-zinc-400 focus:ring-zinc-500/30"
    }`;

  return (
    <div className="min-h-0 flex-1 pb-6">
      <div className="mx-auto max-w-5xl space-y-4 px-1 sm:px-2">
        <Tab tabs={myAccountTabs} variant="dark" />

        <div className="px-0.5">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            My Account
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Update your password to keep your account secure
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-xl"
        >
          <div className="border-b border-white/[0.06] px-4 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Change password
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Use a strong password you don&apos;t reuse elsewhere. You will
                  be signed out after updating.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="max-w-md space-y-5 px-4 py-6 sm:px-6"
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <KeyRound size={13} />
                Current password
              </label>
              <input
                type="password"
                name="oldPassword"
                autoComplete="current-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldPassword}
                className={fieldClass(
                  formik.touched.oldPassword,
                  formik.errors.oldPassword
                )}
              />
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <p className="text-xs text-rose-400">{formik.errors.oldPassword}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <ShieldCheck size={13} />
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                className={fieldClass(
                  formik.touched.newPassword,
                  formik.errors.newPassword
                )}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-xs text-rose-400">{formik.errors.newPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
