'use client'
import ContactTab from "@/app/_Components/Tab/ContactTab";
import { useCreateContactFormMutation } from "@/app/_Services/contactform/page";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

const page = () => {


    const [createContact, { isLoading }] = useCreateContactFormMutation();

    const contactFormSchema = Yup.object({
        subject: Yup.string()
            .required("subject is required"),
        message: Yup.string()
            .required("message is required"),
    });

    const initialValues = {
        subject: "",
        message: "",
    };

    const formik = useFormik({
        initialValues,
        validationSchema: contactFormSchema,
        onSubmit: async (values,{resetForm }) => {
            try {
                const response = await createContact(values).unwrap();
                resetForm();
                toast.success(response?.message || "Form Submitted successfully");
            } catch (error) {
                toast.error(error?.data?.message || "Failed to Form Submitted");
            }
        },
    });



    return (
        <div className='flex justify-start gap-4 mt-4 flex-wrap w-full'>
<ContactTab/>
        <div className="w-full px-8 py-10 bg-white">

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#242424] text-[24px] font-bold">Contact Us Form</h3>

            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="gap-6 ">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 pl-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            onChange={formik.handleChange}
                            value={formik.values.subject}
                            className="w-full p-3 pl-4 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Subject"
                        />
                    </div>
                    {formik.errors.oldPassword && formik.touched.oldPassword && (
                        <span className="text-red-500 text-sm pl-2">{formik.errors.oldPassword}</span>
                    )}
                    <div className="pt-4">
                        <label className="block text-gray-700 font-medium mb-1 pl-2">Message</label>
                        <textarea
                            name="message"
                            onChange={formik.handleChange}
                            value={formik.values.message}
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your message"
                        />
                    </div>
                    {formik.errors.message && formik.touched.message && (
                        <span className="text-red-500 text-sm pl-2">{formik.errors.message}</span>
                    )}
                </div>


                <button
                    type="submit"
                    className="w-[30%] cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full mt-4"
                >
                    {isLoading ? "Submitting..." : "SUBMIT"}
                </button>

            </form>
        </div>
        </div>
    );
};

export default page;
