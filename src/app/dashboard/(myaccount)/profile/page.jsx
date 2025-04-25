'use client'
import React, { useEffect, useState } from "react"
import Cookies from "js-cookie";
import { useUpdateProfileMutation } from "@/app/_Services/authentication/page";
import toast from "react-hot-toast";
import MyAccountTab from "@/app/_Components/Tab/MyAccountTab";

const page = () => {

  
  useEffect(() => {
    const data=Cookies.get("currentuser")
    const user = JSON.parse(data)
    if (user) {
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      });
    }
  }, []);
  

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditable, setIsEditable] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  console.log(isLoading, 'isLoading')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        const user = res?.data;
        toast.success(res.message);
        setIsEditable(false)
        Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };


  return (
    <div className='flex justify-start gap-4 mt-4 flex-wrap w-full'>
<MyAccountTab/>

    <div className="w-full px-8 py-10 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#242424] text-[24px] font-bold">Profile Detail</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            {isEditable ? "Cancel" : "Edit Profile"}
          </button>
        
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 pl-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Phone Number"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditable}
              className="w-full p-5 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Address"
            />
          </div>
        </div>

        {isEditable && (
          <button
            type="submit"
            className="w-[50%] cursor-pointer bg-[#F33E0A] text-white font-semibold py-2 rounded-full mt-4"
          >
            {isLoading ? "Updating..." : "Update"}       </button>
        )}
      </form>
    </div>
    </div>
  );
};

export default page;
