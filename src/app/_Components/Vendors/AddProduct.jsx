"use client";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


import React, { useState, useRef, useMemo } from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useAddProductMutation } from "@/app/_Services/vendorproduct/page";
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "@/app/_Services/categories/page";

const AddProduct = () => {

    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const [selectedCategory, setSelectedCategory] = useState("");
    const { data: subCategories, isLoading: subCategoryLoading, error: subCategoryError } =
        useGetSubCategoriesQuery(selectedCategory, {
            skip: !selectedCategory
        });
    const [addProduct, { isLoading: isSubmitting, isError: isFormError }] = useAddProductMutation();


    const fileInputRef = useRef(null);
    const editor = useRef(null);
    const [content, setContent] = useState('');


    const config = useMemo(() => ({
        readonly: false,

    }),
        []
    );

    const handleClick = () => {
        fileInputRef.current.click();
    };


    const addProductSchema = Yup.object({
        name: Yup.string().required("Product name  is required "),
        price: Yup.string().required("Price is required "),
        description: Yup.string().required("description is required "),
        shortDescription: Yup.string().required("Short Description is required "),
        images: Yup.mixed().required("Product Image is required"),
        categoryId: Yup.mixed().required("Category  is required"),
    })

    const addProductInitialValue = {
        name: "",       
        price: "",
        images: "",
        description: "",
        shortDescription: "",
        categoryId: "",
        subcategoryId: "",
    }

    const formik = useFormik({

        initialValues: addProductInitialValue,
        enableReinitialize: true,
        validationSchema: addProductSchema,

        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("images", values.images);
            formData.append("description", values.description);
            formData.append("shortDescription", values.shortDescription)
            formData.append("categoryId", values.categoryId);
            formData.append("subcategoryId", values.subcategoryId);

            console.log(values, "values");

            try {
                const response = await addProduct(formData).unwrap();
                toast.success(response.message);
            } catch (error) {
                toast.error(error.data.message);
            }
        }
    })

    return (
        <div className="w-full pbg-zinc-800   ">
            <form onSubmit={formik.handleSubmit}>
                <div className=" px-10 ">
                    <h2 className="text-3xl font-bold mbg-zinc-800 border-b border-[#EDEDED] pbg-zinc-800 text-[#242424] ">Add New Product</h2>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Section (Inputs) */}
                        <div className="col-span-2 space-y-4">


                            <label className="font-bold text-[#242424]  " >Product Name</label>
                            <div>
                                {
                                    formik.errors.name && formik.touched.name ?
                                        <span className="text-red-500 text-sm ">{formik.errors.name}</span>
                                        : null
                                }
                            </div>
                            <input
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                type="text" name="name" className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Product Name" />

                            <label className="font-bold text-[#242424]  " >Product type</label>
                            <input type="text" name="producttype" className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Product type" />

                            <div className="flex flex-col space-y-3">
                                {/* Auction Checkbox */}
                                <div className="flex items-center space-x-2 my-4">
                                    <input
                                        type="checkbox" name="auction" id="auction" className="w-4 h-4" />
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
                                        <div>
                                            {
                                                formik.errors.price && formik.touched.price ?
                                                    <span className="text-red-500 text-sm ">{formik.errors.price}</span>
                                                    : null
                                            }
                                        </div>
                                        <div className="flex  border border-gray-300 rounded-lg overflow-hidden">
                                            <span className="px-3 bg-gray-100 text-[#242424] items-center pt-2">$</span>
                                            <input
                                                onChange={formik.handleChange}
                                                value={formik.values.price}
                                                type="number"
                                                name="price"
                                                className="w-full p-2 focus:outline-none"
                                                placeholder="0.00"
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
                                                name="discountprice"
                                                className="w-full p-2 focus:outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {/* Schedule Link */}
                                    <span className="text-[#F33E0A] cursor-pointer text-sm font-semibold">Schedule</span>
                                </div>

                            </div>

                            {/* Category */}
                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-[#242424] ">Category</label>
                                <div>
                                    {
                                        formik.errors.categoryId && formik.touched.categoryId ?
                                            <span className="text-red-500 text-sm ">{formik.errors.categoryId}</span>
                                            : null
                                    }
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden px-3 py-2 bg-white">
                                    <select onChange={(e) => {
                                        formik.setFieldValue("categoryId", e?.target?.value)
                                        setSelectedCategory(e.target.value)
                                    }} name="categoryId" className="w-full text-gray-700 bg-white outline-none cursor-pointer">
                                        <option value="">Select Category</option>
                                        {categories?.data?.map((category) => (
                                            <option value={category?._id} key={category.id} >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2 mt-4">
                                <label className="font-bold text-[#242424] ">Sub-Category</label>
                                <div>
                                    {
                                        formik.errors.subcategoryId && formik.touched.subcategoryId ?
                                            <span className="text-red-500 text-sm ">{formik.errors.subcategoryId}</span>
                                            : null
                                    }
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden px-3 py-2 bg-white">
                                    <select onChange={(e) => {
                                        formik.setFieldValue("subcategoryId", e?.target?.value)
                                    }} name="subcategoryId" className="w-full text-gray-700 bg-white outline-none cursor-pointer">
                                        <option value="">Select Sub-Category</option>
                                        {subCategories?.data?.map((subCategory) => (
                                            <option key={subCategory.id} value={subCategory._id}>
                                                {subCategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <label className="font-bold text-[#242424]  " >Tags</label>
                            <input
                                type="text" name="tags" className="w-full  p-2 border border-[#DDDDDD] rounded-full" placeholder="Select product tags" />
                        </div>


                        {/* Right Section (Image Upload) */}
                        <div className=" p-4 flex flex-col  rounded">
                            <div
                                className="border-2 border-dashed border-[#DDDDDD] w-full h-60 flex justify-center rounded mb-2 cursor-pointer"
                                onClick={handleClick}
                            >
                                <div className="mt-3 h-10 flex justify-center items-center text-[#8F8F8F] bg-[#F0F0F0] text-center w-full mx-5">
                                    Upload Image
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => formik.setFieldValue('images', e.target.files[0])}
                                />
                            </div>
                            {
                                formik.errors.images && formik.touched.images ?
                                    <span className="text-red-500 text-sm ">{formik.errors.images}</span>
                                    : null
                            }
                            {/* <div className="border-2 cursor-pointer border-dashed border-[#DDDDDD] w-20 mt-3 h-20 flex justify-center items-center rounded mb-2">
                            <FaPlus className="text-[#DDDDDD] text-lg" />
                        </div> */}

                        </div>
                    </div>

                    {/* Jodit */}
                    <div className=" w-full  mt-3">
                        <label className="font-bold text-[#242424] " >Short Description</label>
                        {
                            formik.errors.shortDescription && formik.touched.shortDescription ?
                                <span className="text-red-500 text-sm pl-4">{formik.errors.shortDescription}</span>
                                : null
                        }
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1}
                            onChange={newContent => formik.setFieldValue("shortDescription", newContent)}
                        />
                    </div>

                    <div className=" w-full  mt-3">
                        <label className="font-bold text-[#242424] " >Description</label>
                        {
                            formik.errors.description && formik.touched.description ?
                                <span className="text-red-500 text-sm pl-4">{formik.errors.description}</span>
                                : null
                        }
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1}
                            onChange={newContent => formik.setFieldValue("description", newContent)}
                        />
                    </div>

                    {/* Inventory Section */}
                    <div className="border border-[#EBEBEB] rounded-lg p-4 mt-3">
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b-2 border-[#EBEBEB] pb-2 ">
                            <span className="text-lg font-bold text-[#242424]"> Inventory</span>
                            <span className="text-[#888888] text-sm italic">Manage inventory for this product.</span>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* SKU Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#242424] ">SKU (Stock Keeping Unit)</label>
                                <input
                                    type="text"
                                    name="sku"
                                    className="w-full border border-[#DDDDDD] rounded-full p-2 mt-1 focus:ring focus:ring-indigo-200"
                                />
                            </div>

                            {/* Stock Status Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#242424] ">Stock Status</label>
                                <input
                                    type="text"
                                    name="stockstatus"
                                    placeholder="In Stock"
                                    className="w-full border  border-[#DDDDDD] rounded-full p-2 mt-1 "
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-4 space-y-2">
                            <label className="flex items-center gap-2 text-sm text-[#242424] ">
                                <input
                                    type="checkbox"
                                    name="enalbleproduct"
                                    className="w-4 h-4 text-[#242424] border-gray-300 rounded "
                                />
                                Enable product stock management
                            </label>

                            {/* <label className="flex items-center gap-2 text-sm mt-4 text-[#242424] ">
                                <input
                                    type="checkbox"
                                    onChange={ formik.values.}
                                    className="w-4 h-4 text-[#242424] border-gray-300 rounded "
                                />
                                Allow only one quantity of this product to be bought in a single order
                            </label> */}
                        </div>
                    </div>

                    {/* Other Options */}
                    <div className="border border-[#EBEBEB] rounded-lg p-4 mt-3">
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b-2 border-[#EBEBEB] pb-2 ">
                            <span className="text-lg font-extrabold text-[#242424] ">  Other Options</span>
                            <span className="text-[#888888] text-sm  italic">Set your extra product options</span>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* SKU Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#242424] ">Product status</label>
                                <input
                                    placeholder="pending review"
                                    type="text"
                                    name="productstatus"
                                    className="w-full border border-[#DDDDDD] rounded-full p-2 mt-1 focus:ring focus:ring-indigo-200"
                                />
                            </div>

                            {/* Stock Status Input */}
                            <div>
                                <label className="block text-sm font-semibold  text-[#242424]">Visibility</label>
                                <input
                                    type="text"
                                    name="visibility"
                                    placeholder="visible"
                                    className="w-full border  border-[#DDDDDD] rounded-full p-2 mt-1 "
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-[#242424] ">Purchase Note</label>
                            <textarea
                                type="text"
                                name="purchasenote"
                                placeholder="Customer will get this info in their order email"
                                className="w-full border h-30  border-[#DDDDDD] rounded-2xl pl-4 pt-3 mt-1 "
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-4 space-y-2">
                            <label className="flex items-center gap-2 text-sm ">
                                <input
                                    type="checkbox"
                                    name="enableproductrevies"
                                    className="w-4 h-4 text-[#242424] border-gray-300 rounded "
                                />
                                Enable product reviews
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex  justify-end">
                        <button type="submit" className="w-[200px] cursor-pointer bg-[#F33E0A] font-semibold text-white p-3 rounded-lg mt-4 hover:bg-[#d6300b]">{isSubmitting ? "Loading..." : "Save Product"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
