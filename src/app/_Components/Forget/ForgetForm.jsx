"use client"
import { useForgetMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Main from "../../../app/Assets/Main.png";
import Image from "next/image";


export default function ForgotForm() {
  const navigation = useRouter()
  const [ForgotForm, { isLoading: isSubmitting, isError: isFormError }] = useForgetMutation();


  const forgetSchema = Yup.object({
    email: Yup.string().email().required("Email is required"),
  })

  const ForgetInitialValue = {
    email: "",
  }

  const formik = useFormik({
    initialValues: ForgetInitialValue,
    enableReinitialize: true,
    validationSchema: forgetSchema,
    onSubmit: async (values) => {
      try {
        const response = await ForgotForm({ email: values?.email  }).unwrap();
        if (response.statusCode === 200) {
            toast.success(response.message);
            navigation.push("/reset");
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <div className="flex py-6">
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo" height={50} />
          </Link>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Forget Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email address *
            </label>
            <input
              type="text"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.email && formik.touched.email ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.email}</span>
                : null
            }
          </div>

        

          <button className="w-full cursor-pointer orange-bg text-white font-semibold py-2 rounded-full">
            {isSubmitting ? "Loading...." : "SUBMIT"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className=" hover:underline cursor-pointer">
            Back to <Link className="text-[#F33E0A]" href={"/login"}>Login</Link>
          </p>
        </div>
       
      </div>
    </div>
  );
}
