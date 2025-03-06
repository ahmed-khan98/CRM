import React from "react";
import userImg from '../../Assets/userImg.png'
import Image from "next/image";
const page = () => {
  return (
    <div className="w-2/2 mx-auto m-auto px-20 bg-white ">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Image
          src={userImg}
          alt="User Avatar"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">Alexa Rawles</h2>
          <p className="text-gray-500">alexarawles@gmail.com</p>
        </div>
        <button className="ml-auto bg-blue-500 text-white px-6 cursor-pointer py-2 rounded-md hover:bg-blue-600">
          Edit
        </button>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Full Name */}
        <div>
          <label className="block text-[#000000]">Full Name</label>
          <input
            type="text"
            placeholder="Your First Name"
            className="w-full mt-1 p-3 bg-gray-100 focus:outline-none  rounded-lg "
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[#000000]">Email</label>
          <input
            type="email"
            placeholder="alexarawles@gmail.com"
          
            className="w-full mt-1 p-3 bg-gray-100 focus:outline-none  rounded-lg "
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[#000000]">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 mt-1 p-3  focus:outline-none rounded-lg "
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-[#000000]">Address</label>
          <input
            type="text"
            placeholder="Address"
            className="w-full mt-1  bg-gray-100 p-3 focus:outline-none  rounded-lg "
          />
        </div>
      </div>
    </div>
  );
};

export default page;
