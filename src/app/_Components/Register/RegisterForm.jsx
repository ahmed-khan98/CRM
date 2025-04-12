"use client";
// import { useEmailVerificationCodeMutation, useRegisterMutation } from "@/app/_Services/authentication/page";
// import { useFormik } from "formik";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import * as Yup from "yup";
// import Main from "../../../app/Assets/Main.png";

// export default function RegisterForm() {
//   const navigation = useRouter();

//   const [registerForm, { isLoading: isSubmitting }] = useRegisterMutation();
//   const [emailVerificationCode, { isLoading }] = useEmailVerificationCodeMutation();

//   const registerSchema = Yup.object({
//     firstName: Yup.string().required("firstName is required"),
//     lastName: Yup.string().required("lastName is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     code: Yup.string()
//       .length(6, "Verification code must be 6 digits")
//       .required("Verification code is required"),
//     password: Yup.string()
//       .min(8, "Password must be at least 8 characters")
//       .required("Password is required"),
//     cpassword: Yup.string()
//       .min(8, "Confirm Password must be at least 8 characters")
//       .oneOf([Yup.ref("password")], "Confirm Password  must match")
//       .required("Confirm Password is required"),
//   });

//   const registerInitialValue = {
//     firstName: "",
//     lastName: "",
//     code: "",
//     email: "",
//     password: "",
//     cpassword: "",
//   };

//   const formik = useFormik({
//     initialValues: registerInitialValue,
//     enableReinitialize: true,
//     validationSchema: registerSchema,

//     onSubmit: async (values) => {
//       let formData;
//       if (values?.avatar) {
//         formData = new FormData();
//         formData.append("firstName", values.firstName);
//         formData.append("lastName", values.lastName);
//         formData.append("email", values.email);
//         formData.append("password", values.password);
//         formData.append("avatar", values.avatar);
//       } else {
//         formData = {
//           firstName: values.firstName,
//           lastName: values.lastName,
//           code: values.code,
//           role: "USER",
//           email: values.email,
//           password: values.password,
//         };
//       }

//       try {
//         const response = await registerForm(formData).unwrap();
//         toast.success(response?.message);
//         navigation.push('/login')
//       } catch (error) {
//         toast.error(error?.data?.message || "Registration failed");
//       }
//     },
//   });

//   // Handler for sending the verification code
//   const handleResendCode = async () => {
//     if (!formik.values.email) {
//       toast.error("Please enter your email to receive a verification code.");
//       return;
//     }

//     try {
//       const response = await emailVerificationCode({ email: formik.values.email }).unwrap();
//       toast.success(response?.message || "Verification code sent to your email.");
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to send verification code.");
//     }
//   };

//   // Optional: Send code when user leaves email input
//   const handleEmailBlur = async () => {
//     if (!formik.values.email) return;
//     try {
//       const response =  await emailVerificationCode({ email: formik.values.email }).unwrap();
//       toast.success(response?.message || "Verification code sent to your email.");
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to send verification code.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="max-w-md w-full px-6 py-2  bg-white shadow-md rounded-lg">
//         <div className="flex py-3">
//           <Link href="/" className="mx-auto">
//             <Image src={Main} alt="Logo" height={50} />
//           </Link>
//         </div>
//         <h2 className="text-2xl font-semibold mb-2 text-center">Register</h2>
//         <form onSubmit={formik.handleSubmit}>
//           {/* First Name */}
//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">First Name *</label>
//             <input
//               type="text"
//               name="firstName"
//               onChange={formik.handleChange}
//               value={formik.values.firstName}
//               className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {formik.errors.firstName && formik.touched.firstName && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.firstName}</span>
//             )}
//           </div>

//           {/* Last Name */}
//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">Last Name *</label>
//             <input
//               type="text"
//               name="lastName"
//               onChange={formik.handleChange}
//               value={formik.values.lastName}
//               className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {formik.errors.lastName && formik.touched.lastName && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.lastName}</span>
//             )}
//           </div>

//           {/* Email */}
//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
//             <input
//               type="email"
//               name="email"
//               onChange={formik.handleChange}
//               onBlur={handleEmailBlur}
//               value={formik.values.email}
//               className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {formik.errors.email && formik.touched.email && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.email}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">
//               Verification Code
//             </label>

//             {/* Row layout for input and button */}
//             <div className="flex items-center gap-2">
//               {/* Verification Code Input */}
//               <input
//                 type="text"
//                 name="code"
//                 onChange={formik.handleChange}
//                 value={formik.values.code}
//                 className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               {/* RE-SEND Code Button */}
//               <button
//                 type="button"
//                 onClick={handleResendCode}
//                 className="px-4 py-2 cursor-pointer border border-[#F33E0A] text-[#F33E0A] rounded-full hover:bg-[#F33E0A]/10 transition-all"
//               >
//                 {isLoading ? "Sending..." : "RE-SEND"}
//               </button>
//             </div>

//             {/* Error Message */}
//             {formik.errors.code && formik.touched.code && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.code}</span>
//             )}
//           </div>


//           {/* Password */}
//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">Password *</label>
//             <input
//               type="password"
//               name="password"
//               onChange={formik.handleChange}
//               value={formik.values.password}
//               className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {formik.errors.password && formik.touched.password && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.password}</span>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-3">
//             <label className="block text-gray-700 font-medium mb-1">Confirm Password *</label>
//             <input
//               type="password"
//               name="cpassword"
//               onChange={formik.handleChange}
//               value={formik.values.cpassword}
//               className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {formik.errors.cpassword && formik.touched.cpassword && (
//               <span className="text-red-500 text-sm pl-2">{formik.errors.cpassword}</span>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full"
//           >
//             {isSubmitting ? "Loading..." : "REGISTER"}
//           </button>

//           <div className="mt-4 text-center">
//             <p className="hover:underline cursor-pointer">
//               Already have an account?{" "}
//               <Link className="text-[#F33E0A]" href="/login">
//                 Login
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useEmailVerificationCodeMutation, useRegisterMutation } from "@/app/_Services/authentication/page";
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

    // const [emailVerificationCode, { isLoading, isError }] = useEmailVerificationCodeMutation();

  const registerSchema = Yup.object({
    firstName: Yup.string().required("firstName is required"),
    lastName: Yup.string().required("lastName is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    // code: Yup.string()
    //   .length(6, "Verification code must be 6 digits")
    //   .required("Verification code is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),

    cpassword: Yup.string()
      .min(8, "Confirm Password must be at least 8 characters")
      .oneOf([Yup.ref("password")], "Confirm Password  must match")
      .required("Confirm Password is required"),
  });

  const registerInitialValue = {
    firstName: "",
    lastName: "",
    // code: "",
    email: "",
    password: "",
    cpassword: "",
  }

  const formik = useFormik({
    initialValues: registerInitialValue,
    enableReinitialize: true,
    validationSchema: registerSchema,

    onSubmit: async (values) => {

      let formData
      if (values?.avatar) {
        formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        // formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("avatar", values.avatar);
      } else {
        formData = {
          "firstName": values.firstName,
          "lastName": values.lastName,
          // "code": values.code,
          "role": 'USER',
          "email": values.email,
          "password": values.password
        }
      }

      try {
        const response = await registerForm(formData).unwrap();
        toast.success(response?.message);
        navigation.push(`/verifyemail?email=${values?.email}`)
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
          {/* firstName */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">first name *</label>
            <input
              type="text"
              name="firstName"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.firstName && formik.touched.firstName ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.firstName}</span>
                : null
            }
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Last name *</label>
            <input
              type="text"
              name="lastName"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.lastName && formik.touched.lastName ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.lastName}</span>
                : null
            }
          </div>

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
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              name="cpassword"
              onChange={formik.handleChange}
              value={formik.values.cpassword}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {
              formik.errors.cpassword && formik.touched.cpassword ?
                <span className="text-red-500 text-sm pl-2">{formik.errors.cpassword}</span>
                : null
            }
          </div>

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

{/* Image Upload */ }
{/* <div className="mb-3">
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
          </div> */}

{/* Role Selection */ }
{/* <div className="mb-3">
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

{/* Submit Button */ }