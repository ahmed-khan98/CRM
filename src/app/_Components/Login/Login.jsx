"use client"
import { useLoginMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Main from "../../../app/Assets/Main.png";
import Image from "next/image";


export default function LoginForm() {
  const navigation = useRouter()
  const [loginForm, { isLoading: isSubmitting, isError: isFormError }] = useLoginMutation();


  const loginSchema = Yup.object({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const loginInitialValue = {
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues: loginInitialValue,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginForm(values).unwrap();
        console.log("Form submitted successfully:", response);

        if (response.statusCode === 200) {
          const { accessToken } = response?.data;
          const user = response?.data?.user;
          Cookies.set("token", accessToken, { expires: 7, secure: true });
          Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true });
          toast.success(response.message);
          navigation.push("/auction-product");
        }
      } catch (error) {
        console.log(error,'verify-error')
        if (error?.data.statusCode === 403 && error?.data?.data?.email) {
          navigation.push(`/verifyemail?email=${values?.email}`)
        }
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password *
            </label>
            <input
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.password && formik.touched.password ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.password}</span>
                : null
            }
          </div>

          <button className="w-full cursor-pointer orange-bg text-white font-semibold py-2 rounded-full">
            {isSubmitting ? "Loading...." : "LOG IN"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className=" hover:underline cursor-pointer">
            Don't have an account ? <Link className="text-[#F33E0A]" href={"/register"}>Register</Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className=" hover:underline cursor-pointer">
           <Link className="text-[#F33E0A]" href={"/forget"}>Forget Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
