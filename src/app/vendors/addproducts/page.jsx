"use client";
import React, { useState } from "react";
import { FaExternalLinkAlt, FaPlus } from "react-icons/fa";

const page = () => {
    const [product, setProduct] = useState({
        title: "",
        type: "",
        price: "",
        discountedPrice: "",
        category: "",
        tags: "",
        shortDescription: "",
        description: "",
        sku: "",
        stockStatus: "In Stock",
        productStatus: "Pending Review",
        visibility: "Visible",
        purchaseNote: "",
        enableReviews: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({
            ...product,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    return (
        <div className="w-full pb-5   ">
            <div className=" px-10 ">
                <h2 className="text-3xl font-bold mb-4 border-b border-[#EDEDED] pb-4 text-[#242424] montserrat">Add New Product</h2>
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Section (Inputs) */}
                    <div className="col-span-2 space-y-4">

                        <label className="font-bold text-[#242424] montserrat " >Title</label>
                        <input type="text" name="title" value={product.title} onChange={handleChange} className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Product Name" />

                        <label className="font-bold text-[#242424] montserrat " >Product type</label>
                        <input type="text" name="type" value={product.type} onChange={handleChange} className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Product type" />

                        <div className="flex flex-col space-y-3">
                            {/* Auction Checkbox */}
                            <div className="flex items-center space-x-2 my-4">
                                <input type="checkbox" id="auction" className="w-4 h-4" />
                                <label htmlFor="auction" className="text-[#242424] font-bold flex items-center space-x-1">
                                    <span>Auction</span>
                                    <span className="text-sm text-[#242424] cursor-pointer">�</span>
                                </label>
                            </div>

                            {/* Price & Discounted Price */}
                            <div className="flex justify-between items-center my-3 space-x-6">
                                {/* Price Input */}
                                <div>
                                    <label className="block text-[#242424] font-bold text-sm">Price <span className="text-gray-500 text-xs">(You Earn: $0)</span></label>
                                    <div className="flex  border border-gray-300 rounded-lg overflow-hidden">
                                        <span className="px-3 bg-gray-100 text-[#242424] items-center pt-2">$</span>
                                        <input
                                            type="number"
                                            className="w-full p-2 focus:outline-none"
                                            defaultValue="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Discounted Price Input */}
                                <div>
                                    <label className="block text- font-bold text-sm">Discounted Price</label>
                                    <div className="flex  border border-gray-300 rounded-lg overflow-hidden">
                                        <span className="px-3 bg-gray-100 text-[#242424] items-center pt-2">$</span>
                                        <input
                                            type="number"
                                            className="w-full p-2 focus:outline-none"
                                            defaultValue="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Schedule Link */}
                                <span className="text-[#F33E0A] cursor-pointer text-sm font-semibold">Schedule</span>
                            </div>

                        </div>


                        <div className="flex flex-col space-y-2">
                            <label className="font-bold text-[#242424] montserrat " >Category</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden px-3 py-2">
                                <input
                                    type="text"
                                    value="Kids Toys"
                                    readOnly
                                    className="w-full text-gray-700 bg-white outline-none cursor-pointer"
                                />
                                <FaExternalLinkAlt className="text-gray-500 cursor-pointer" />
                            </div>
                        </div>


                        <label className="font-bold text-[#242424] montserrat " >Tags</label>
                        <input type="text" name="tags" value={product.tags} onChange={handleChange} className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Select product tags" />

                    </div>


                    {/* Right Section (Image Upload) */}
                    <div className=" p-4 flex flex-col  rounded">
                        <div className=" border-2 border-dashed border-[#DDDDDD] w-full h-60  flex  justify-center rounded mb-2">
                            <div className="mt-3 h-10 flex justify-center items-center text-[#8F8F8F] bg-[#F0F0F0] text-center w-full mx-5">
                                Upload Image
                            </div>

                        </div>
                        <div className="border-2 cursor-pointer border-dashed border-[#DDDDDD] w-20 mt-3 h-20 flex justify-center items-center rounded mb-2">
                            <FaPlus className="text-[#DDDDDD] text-lg" />
                        </div>

                    </div>

                </div>






                {/* Inventory Section */}
                <div className="bg-gray-100 p-4 rounded mt-4">
                    <h3 className="font-semibold">Inventory</h3>
                    <div className="flex gap-4">
                        <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-1/2 p-2 border rounded" placeholder="SKU" />
                        <select name="stockStatus" value={product.stockStatus} onChange={handleChange} className="w-1/2 p-2 border rounded">
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 mt-3">
                        <input type="checkbox" name="enableStock" onChange={handleChange} /> Enable product stock management
                    </label>
                </div>
                {/* Other Options */}
                <div className="bg-gray-100 p-4 rounded mt-4">
                    <h3 className="font-semibold">Other Options</h3>
                    <div className="flex gap-4">
                        <select name="productStatus" value={product.productStatus} onChange={handleChange} className="w-1/2 p-2 border rounded">
                            <option>Pending Review</option>
                            <option>Published</option>
                        </select>
                        <select name="visibility" value={product.visibility} onChange={handleChange} className="w-1/2 p-2 border rounded">
                            <option>Visible</option>
                            <option>Hidden</option>
                        </select>
                    </div>
                    <input type="text" name="purchaseNote" value={product.purchaseNote} onChange={handleChange} className="w-full p-2 border rounded mt-2" placeholder="Purchase Note" />
                    <label className="flex items-center gap-2 mt-3">
                        <input type="checkbox" name="enableReviews" checked={product.enableReviews} onChange={handleChange} /> Enable product reviews
                    </label>
                </div>
                {/* Submit Button */}
                <div className="flex  justify-end">
                    <button className="w-[200px] bg-[#F33E0A] font-semibold text-white p-3 rounded-lg mt-4 hover:bg-[#d6300b]">Save Product</button>

                </div>
            </div>
        </div>
    );
};

export default page;
