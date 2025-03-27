"use client"
import { useRegisterMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Main from "../../../app/Assets/Main.png";


export default function RegisterForm() {
  const navigation = useRouter()

  const [registerForm, { isLoading: isSubmitting, isError: isFormError }] = useRegisterMutation();


  const registerSchema = Yup.object({
    fname: Yup.string().required("fisrt name is required "),
    lname: Yup.string().required("last name is required "),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    // avatar: Yup.mixed().required("Profile Image is required"),
  })

  const registerInitialValue = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    avatar: '',
  }

  const formik = useFormik({
    initialValues: registerInitialValue,
    enableReinitialize: true,
    validationSchema: registerSchema,

    onSubmit: async (values) => {
    
      let formData
      if(values?.avatar){
        formData = new FormData();
        formData.append("fname", values.fname);
        formData.append("lname", values.lname);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("avatar", values.avatar);
      }else{
        formData={
        "fname":values.fname,
        "lname": values.lname,
        "email": values.email,
        "password": values.password}
      }

      try {
        const response = await registerForm(formData).unwrap();
        console.log("Form submitted successfully:", response);
        console.log(response.message,"response meaage");
        
        toast.success(response?.message);
        navigation.push("/login")
      } catch (error) {
        toast.error(error.data.message);
      }
    }
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
      <div className="flex py-6">
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo" height={50} />
          </Link>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* fname */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">first name *</label>
            <input
              type="text"
              name="fname"
              onChange={formik.handleChange}
              value={formik.values.fname}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.fname && formik.touched.fname ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.fname}</span>
                : null
            }

          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Last name *</label>
            <input
              type="text"
              name="lname"
              onChange={formik.handleChange}
              value={formik.values.lname}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.lname && formik.touched.lname ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.lname}</span>
                : null
            }

          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email address *</label>
            <input
              type="email"
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

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password *</label>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.password && formik.touched.password ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.password}</span>
                : null
            }
          </div>



          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Upload Profile Image</label>
            <input
              type="file"
              name="avatar"
              onChange={(e) => formik.setFieldValue('avatar', e.target.files[0])}
              className="w-full border border-gray-300 rounded-full p-2 cursor-pointer focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.avatar && formik.touched.avatar ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.avatar}</span>
                : null
            }
          </div>

          {/* Role Selection */}
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <div className="items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  onChange={formik.handleChange}
                  value="USER"
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">I am a customer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="VENDOR"

                  onChange={formik.handleChange}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">I am a vendor</span>
              </label>
              {
                formik.errors.role && formik.touched.role ?
                  <span className="text-red-500 text-sm pl-2">{formik.errors.role}</span>
                  : null
              }
            </div>
          </div> */}

          {/* Submit Button */}
          <button
            className="w-full cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full"
          >
            {isSubmitting ? "Loading...." : "REGISTER"}
          </button>
          <div className="mt-4 text-center">
            <p className=" hover:underline cursor-pointer">
              Already have an account ? <Link className="text-[#F33E0A]" href={"/login"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
