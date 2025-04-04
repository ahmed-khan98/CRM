"use client"
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearFilteredProducts, filterByCategory, filterBySubCategory, sortProducts } from "@/redux/filterSlice";
import { useGetallsubCategoriesQuery, useGetCategoriesQuery } from "@/app/_Services/categories/page";

const SortMenu = ({ title, options, onSelect,width=120 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dispatch=useDispatch()
  const handleSelect = (label, value) => {
    setSelected(label);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };


  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);  // Cleanup on component unmount
    // };
  }, []);
  
  return (
    <div className="relative text-left">
      <button
       style={{ minWidth: `${width}px` }}  // Apply width using inline styles
        className='flex items-center cursor-pointer justify-between  border border-solid border-gray-400 rounded-xl px-2 py-2 bg-white hover:border-gray-700 focus:outline-secondary'
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col text-left ">
          <p className="cursor-pointer text-label-sm">{selected ? selected : title}</p>
          {/* <p className="font-semibold text-title-xs pr-2">{selected}</p> */}
        </div>
        <FaChevronDown className="text-orange-500" size={20} />
      </button>

      {isOpen && (
        <div
        ref={dropdownRef}
          className="absolute left-0 cursor-pointer w-full mt-1 bg-white rounded-xl ring-2 ring-neutral-400 shadow-lg focus:outline-none z-50 overflow-hidden"
          role="menu"
          tabIndex="0"
        >
          {options.map(({ label, value }) => (
            <p
              key={value}
              className="block cursor-pointer py-2 px-3 hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-none"
              onClick={() =>{
                dispatch(sortProducts(value));
               handleSelect(label, value)}}
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
    { label: "Current Price (Low - High)", value: "low-to-high" },
    { label: "Current Price (High - Low)", value: "high-to-low" },
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
    <div className=" md:mt-[54px] mt-[30px] w-full bg-white">
    <div className="flex   gap-3 flex-wrap justify-center   pl-20 ml-4 my-3 container mx-auto  fixed z-50 bg-white  py-2">
      <SortMenu  width={170} title="Sort By" options={sortOptions} />
      <SortMenu  width={140} title="Category" options={categoryOptions} onSelect={handleCategoryChange} />
      <SortMenu   width={140} title="Subcategory" options={subcategoryOptions} onSelect={handleSubcategoryChange} />
      <button className="px-3 py-2 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-900" onClick={()=> dispatch(clearFilteredProducts())}>
        Clear Filter
      </button>
    </div>
    </div>
  );
};

export default SortDropdowns;
