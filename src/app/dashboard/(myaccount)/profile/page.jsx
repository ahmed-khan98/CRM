"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useUpdateProfileMutation } from "@/app/_Services/authentication/page";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  CheckCircle,
  Loader2,
  Calendar,
  Building,
  IdCard,
  ShieldUser,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tab from "@/app/_Components/Tab/page";
import { myAccountTabs } from "@/app/utilities/tabs/page";
import { formatPhoneNumber } from "@/app/utilities/phoneFormat";
import { useDispatch, useSelector } from "react-redux";
import { setActivity } from "@/redux/filterSlice";
import { useBreakInMutation } from "@/app/_Services/employee/page";

const ProfilePage = () => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [breakIn, { isLoading: isBreakLoading }] = useBreakInMutation();
  const [isEditable, setIsEditable] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
      const { attendence } = useSelector((state) => state.filter);

  
  const dispatch = useDispatch();


  const handleBreakIn = async () => {
    try {
      const res = await breakIn({attendanceId:attendence?._id}).unwrap();
      if (res.success) {
        console.log(res, "-------->>>res");
        dispatch(
          setActivity({
            activityStatus: res?.data?.activityStatus,
            lastBreakInTime: res?.data?.lastBreakInTime
          }),
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    CNIC: "",
    designation: "",
    department: "",
    joiningDate: "",
  });

  useEffect(() => {
    const data = Cookies.get("currentuser");
    if (data) {
      const user = JSON.parse(data);
      setFormData({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        CNIC: user?.CNIC || "",
        designation: user?.designation || "",
        department: user?.departmentId?.name || "",
        joiningDate: user?.joiningDate.split("T")[0] || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        const user = res?.data;
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setIsEditable(false);
        Cookies.set("currentuser", JSON.stringify(user), {
          expires: 7,
          secure: true,
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const name = formData?.fullName?.split(" ");
  return (
    <div className="min-h-screen  py-1 mx-1 ">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <Tab tabs={myAccountTabs} />
        <div className="my-4 mx-2">
          <h1 className="text-lg md:text-lg font-bold text-gray-800">
            My Account
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your personal information and preferences
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-2 "
        >
          <div className="relative overflow-hidden">
            <div className="h-18 bg-gradient-to-r from-[#5f2781] to-[#a945fc]"></div>

            <div className="relative px-1 md:px-4  pb-6 -mt-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                <div className="flex items-end gap-4 mx-4 md:mx-0">
                  <div className="h-18 w-18 rounded-full bg-white shadow-md flex items-center justify-center border-3 border-white">
                    <div className="h-full w-full rounded-full bg-[#5f2781] flex items-center justify-center text-white text-xl font-bold capitalize">
                      {name?.map((e) => `${e?.charAt(0)}`) || (
                        <User size={30} />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white capitalize">
                      {formData.fullName}
                    </h2>
                    <p className="text-gray-500">{formData.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`cursor-pointer flex items-center mx-4 gap-2 px-5 py-2.5 rounded-full transition-all ${
                    isEditable
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-white text-[#5f2781] border border-[#5f2781] hover:bg-[#a945fc] hover:text-white"
                  }`}
                >
                  {isEditable ? (
                    <>Cancel Editing</>
                  ) : (
                    <>
                      <Edit2 size={18} /> Edit Profile
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleBreakIn()}
                  className={`cursor-pointer flex items-center mx-4 gap-2 px-5 py-2.5 rounded-full transition-all ${"bg-white text-[#5f2781] border border-[#5f2781] hover:bg-[#a945fc] hover:text-white"}`}
                >
                  Break In
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 border-l-4 border-green-500 p-4 mx-8"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-700">
                    Your profile has been updated successfully!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-2 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <User size={16} className="text-[#5f2781]" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    placeholder="Your first name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <IdCard size={18} className="text-[#5f2781]" />
                  CNIC
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="CNIC"
                    value={formData.CNIC}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <Mail size={16} className="text-[#5f2781]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <Phone size={16} className="text-[#5f2781]" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    // onChange={handleChange}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        phoneNo: formattedValue,
                      }));
                    }}
                    placeholder="+1 (555) 123-4567"
                    disabled={!isEditable}
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    // placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <ShieldUser size={16} className="text-[#5f2781]" />
                  Designation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        designation: e.target.value,
                      }));
                    }}
                    disabled
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    // placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <Building size={16} className="text-[#5f2781]" />
                  Department
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }));
                    }}
                    disabled
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    // placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4 text-sm">
                  <Calendar size={16} className="text-[#5f2781]" />
                  Joining Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        joiningDate: e.target.value,
                      }));
                    }}
                    disabled
                    className={`w-full p-4  border ${
                      isEditable
                        ? "bg-white  focus:ring-red-500"
                        : "bg-gray-50  focus:ring-[#5f2781]"
                    } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200 p-1`}
                    // placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-4 flex justify-center"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group cursor-pointer relative overflow-hidden p-2 bg-[#5f2781] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70 min-w-[180px]"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          Save Changes
                          <Save className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
