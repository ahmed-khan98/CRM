"use client"
import React, { useState } from "react";

const page = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
   <div className="w-2/2">
     <div className="max-w-md mx-auto p-6  bg ">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <hr className="mb-4" />

   
      <div className="mb-4">
        <label className="block font-medium mb-2">Pay With:</label>
        <div className="flex gap-4">
          {["card", "bank", "transfer"].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="accent-blue-500 focus:outline-none"
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>
      </div>

    
      <div className="mb-4">
        <label className="block font-medium mb-2">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9101 1121"
          className="w-full p-3 border focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-medium mb-2">Expiration Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            className="w-full p-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="w-1/2">
          <label className="block font-medium mb-2">CVV</label>
          <input
            type="text"
            placeholder="123"
            className="w-full p-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>


      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" className="accent-green-500" />
        <label className="text-gray-600">Save card details</label>
      </div>

  
      <button className="w-full bg-green-500 text-white font-medium py-3 rounded-lg mt-6 hover:bg-green-600">
        Add Card
      </button>

   
      <p className="text-sm text-gray-500 mt-4">
        Your personal data will be used to process your order, support your
        experience throughout this website, and for other purposes described in
        our privacy policy.
      </p>
    </div>
   </div>
  );
};

export default page;
