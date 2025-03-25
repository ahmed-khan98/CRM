"use client"
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearFilteredProducts, filterByCategory, filterBySubCategory } from "@/redux/filterSlice";
import { useGetallsubCategoriesQuery, useGetCategoriesQuery } from "@/app/_Services/categories/page";

const SortMenu = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Featured");

  const handleSelect = (label, value) => {
    setSelected(label);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };

  return (
    <div className="relative text-left">
      <button
        className="flex items-center justify-between min-w-[200px] border border-solid border-gray-400 rounded-xl px-3 py-2 bg-white hover:border-gray-700 focus:outline-secondary"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col text-left">
          <p className="cursor-pointer text-label-sm">{title}</p>
          {/* <p className="font-semibold text-title-xs pr-2">{selected}</p> */}
        </div>
        <FaChevronDown className="text-orange-500" size={20} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 w-full mt-1 bg-white rounded-xl ring-2 ring-neutral-400 shadow-lg focus:outline-none z-50 overflow-hidden"
          role="menu"
          tabIndex="0"
        >
          {options.map(({ label, value }) => (
            <p
              key={value}
              className="block cursor-pointer py-2 px-3 hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-none"
              onClick={() => handleSelect(label, value)}
            >
              {label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const SortDropdowns = () => {
  const dispatch = useDispatch();
  const { data: categories } = useGetCategoriesQuery();
  const { data: subcategories } = useGetallsubCategoriesQuery();

  const categoryOptions = categories?.data?.map((category) => ({
    label: category.name,
    value: category._id,
  })) || [];

  const subcategoryOptions = subcategories?.data?.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  })) || [];

  const sortOptions = [
    { label: "Current Price (Low - High)", value: "current_price_asc" },
    { label: "Current Price (High - Low)", value: "current_price_desc" },
    { label: "Ending (Earliest - Latest)", value: "time_remaining_asc" },
    { label: "Ending (Latest - Earliest)", value: "time_remaining_desc" },
    { label: "Est. Retail (Low - High)", value: "retail_price_asc" },
    { label: "Est. Retail (High - Low)", value: "retail_price_desc" },
    { label: "Bid Count (Low - High)", value: "bids_asc" },
    { label: "Bid Count (High - Low)", value: "bids_desc" },
  ];

  const handleCategoryChange = (value) => {
    if (value === "") {
      dispatch(clearFilteredProducts());
    } else {
      dispatch(filterByCategory(value));
    }
  };

  const handleSubcategoryChange = (value) => {
    if (value === "") {
      dispatch(clearFilteredProducts());
    } else {
      dispatch(filterBySubCategory(value));
    }
  };

  return (
    <div className="flex gap-3 flex-wrap justify-start ml-18 my-3 container mx-auto">
      <SortMenu title="Sort By" options={sortOptions} />
      <SortMenu title="Category" options={categoryOptions} onSelect={handleCategoryChange} />
      <SortMenu title="Subcategory" options={subcategoryOptions} onSelect={handleSubcategoryChange} />
    </div>
  );
};

export default SortDropdowns;
