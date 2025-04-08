"use client"
import { useResendMutation, useVerifyMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Main from "../../../app/Assets/Main.png";
import Image from "next/image";
import Link from "next/link";
function VerifyEmailForm() {
    const navigation = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [verifyEmail, { isLoading: isSubmitting, isError: isFormError }] = useVerifyMutation();
    const [resendcode, { isLoading, isError }] = useResendMutation();

    const verifySchema = Yup.object({
        code: Yup.string()
            .length(6, "Verification code must be 6 digits")
            .required("Verification code is required"),
    });

    const verifyInitialValue = {
        code: "",
    };

    const formik = useFormik({
        initialValues: verifyInitialValue,
        enableReinitialize: true,
        validationSchema: verifySchema,
        onSubmit: async (values) => {
            try {
                const response = await verifyEmail({ email: email, code: values.code }).unwrap();
                if (response.statusCode === 200) {
                    toast.success(response.message);
                    navigation.push("/login");
                }
            } catch (error) {
                toast.error(error?.data?.message || "Something went wrong");
            }
        },
    });


    const handleResendCode = async () => {
        try {
            const response = await resendcode({ email: email }).unwrap();
            if (response.statusCode === 200) {
                toast.success(response.message);
            }
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
                <div className="flex py-6">
                    <Link href="/" className="mx-auto">
                        <Image src={Main} alt="Logo" height={50} />
                    </Link>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Email</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            Enter the Verification Code sent to your email
                        </label>
                        <input
                            type="text"
                            name="code"
                            onChange={formik.handleChange}
                            value={formik.values.code}
                            className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {formik.errors.code && formik.touched.code ? (
                            <span className="text-red-500 text-sm pl-2">{formik.errors.code}</span>
                        ) : null}
                    </div>

                    <button className="w-full cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full">
                        {isSubmitting ? "Verifying..." : "VERIFY EMAIL"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="hover:underline cursor-pointer">
                        Didn't receive the code?{" "}
                        <button className="text-[#F33E0A] cursor-pointer" onClick={() => handleResendCode()}>
                        {isLoading ? "Sending..." : "Resend Code"} 
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default function VerifyForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

