"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  clearFilteredProducts,
  filterByCategory,
  filterBySubCategory,
  sortProducts,
} from "@/redux/filterSlice";
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/app/_Services/categories/page";
import { useGetSortTitleQuery } from "@/app/_Services/products/page";

const SortMenu = ({ title, options, onSelect, width = 120 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  const handleSelect = (title, value) => {
    setSelected(title);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-left capitalize">
      <button
        style={{ minWidth: `${width}px` }}
        className="flex items-center cursor-pointer justify-between border border-solid border-gray-400 rounded-xl px-2 py-2 bg-white hover:border-gray-700 focus:outline-secondary"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col text-left">
          <p className="cursor-pointer text-label-sm capitalize">
            {selected ? selected : title}
          </p>
        </div>
        <FaChevronDown className="text-orange-500" size={16} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 cursor-pointer w-full mt-1 bg-white rounded-xl ring-1 ring-neutral-400 shadow-lg focus:outline-none z-[999] overflow-y-auto max-h-90"
          role="menu"
          tabIndex="0"
        >

          {options?.map(({ title, value }) => (
            <p
              key={value}
              className="capitalize block cursor-pointer py-2 px-2 pl-3 hover:bg-gray-100 focus-visible:bg-gray-200 focus-visible:outline-none text-gray-700"
              onClick={() => handleSelect(title, value)}
            >
              {title}
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

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { data: sortTitle, error, isLoading } = useGetSortTitleQuery();

  const {
    data: subcategories,
  } = useGetSubCategoriesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  const categoryOptions =
    categories?.data
      ?.map((category) => ({
        title: category.name,
        value: category._id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)) || [];

  const subcategoryOptions =
    subcategories?.data
      ?.map((subcategory) => ({
        title: subcategory.name,
        value: subcategory._id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)) || [];

      console.log(selectedCategoryId,'selectedCategoryId')
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    dispatch(filterByCategory(categoryId));
  };

  const handleSubcategoryChange = (subCategoryId) => {
    dispatch(filterBySubCategory(subCategoryId));
  };

  return (
    <div className="md:mt-[58px] mt-[50px] bg-white w-full fixed z-10">
      <div className="flex gap-3 flex-wrap justify-center my-1 sticky top-0 z-20 bg-white py-2 shadow-lg w-full">

        <SortMenu
          width={220}
          title="Sort By"
          options={sortTitle?.data || []}
          onSelect={(value) => dispatch(sortProducts(value))}
        />
        <SortMenu
          width={220}
          title="Category"
          options={categoryOptions}
          onSelect={handleCategoryChange}
        />
        {selectedCategoryId && subcategoryOptions.length > 0 && (
          <SortMenu
            width={220}
            title="Subcategory"
            options={subcategoryOptions}
            onSelect={handleSubcategoryChange}
          />
        )}

        <button
          className="px-6 py-1 cursor-pointer bg-gray-700 text-white rounded-xl hover:bg-gray-900"
          onClick={() => {
            setSelectedCategoryId("");
            dispatch(clearFilteredProducts());
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SortDropdowns;
