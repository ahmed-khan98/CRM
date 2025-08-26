"use client"
import { useEffect, useRef, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { Filter, X, SortAsc } from "lucide-react"
import { useDispatch } from "react-redux"
import { clearFilteredProducts, filterByCategory, filterBySubCategory, sortProducts } from "@/redux/filterSlice"
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "@/app/_Services/categories/page"
import { useGetSortTitleQuery } from "@/app/_Services/products/page"

const SortMenu = ({ title, options, onSelect, width = 120, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const dropdownRef = useRef(null)

  const handleSelect = (title, value) => {
    setSelected(title)
    setIsOpen(false)
    if (onSelect) onSelect(value)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (isMobile) {
    return (
      <div className="relative text-left capitalize w-full">
        <button
          className="flex items-center cursor-pointer justify-between border border-gray-300 rounded-lg px-3 py-2.5 bg-white hover:border-orange-500 focus:outline-none focus:border-orange-500 transition-colors w-full"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{selected ? selected : title}</span>
          </div>
          <FaChevronDown className={`text-orange-500 transition-transform ${isOpen ? "rotate-180" : ""}`} size={14} />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 cursor-pointer w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg focus:outline-none z-[999] overflow-y-auto max-h-64"
            role="menu"
            tabIndex="0"
          >
            {options?.map(({ title, value }) => (
              <div
                key={value}
                className="capitalize block cursor-pointer py-3 px-4 hover:bg-orange-50 hover:text-orange-600 focus-visible:bg-orange-50 focus-visible:outline-none text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => handleSelect(title, value)}
              >
                {title}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative text-left capitalize">
      <button
        style={{ minWidth: `${width}px` }}
        className="flex items-center cursor-pointer justify-between border border-solid border-gray-400 rounded-xl px-2 py-2 bg-white hover:border-gray-700 focus:outline-secondary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col text-left">
          <p className="cursor-pointer text-label-sm capitalize">{selected ? selected : title}</p>
        </div>
        <FaChevronDown className="text-orange-500" size={16} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 cursor-pointer w-full mt-1 bg-white rounded-xl ring-1 ring-neutral-400 shadow-lg focus:outline-none z-[999] overflow-y-auto max-h-80"
          style={{ overflowY: "scroll", scrollbarWidth: "thin" }}
          role="menu"
          tabIndex="0"
        >
          {options?.map(({ title, value }) => (
            <p
              key={value}
              className="border border-gray-100 capitalize block cursor-pointer py-2 px-2 pl-3 hover:bg-gray-200 hover:font-semibold focus-visible:bg-gray-200 focus-visible:outline-none text-gray-700"
              onClick={() => handleSelect(title, value)}
            >
              {title}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

const SortDropdowns = () => {
  const dispatch = useDispatch()
  const { data: categories } = useGetCategoriesQuery()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const { data: sortTitle, error, isLoading } = useGetSortTitleQuery()

  const { data: subcategories } = useGetSubCategoriesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  })

  const categoryOptions =
    categories?.data
      ?.map((category) => ({
        title: category.name,
        value: category._id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)) || []

  const subcategoryOptions =
    subcategories?.data
      ?.map((subcategory) => ({
        title: subcategory.name,
        value: subcategory._id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)) || []

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId)
    dispatch(filterByCategory(categoryId))
  }

  const handleSubcategoryChange = (subCategoryId) => {
    dispatch(filterBySubCategory(subCategoryId))
  }

  const handleClearFilters = () => {
    setSelectedCategoryId("")
    dispatch(clearFilteredProducts())
    setIsMobileFiltersOpen(false)
  }

  return (
    <>
      {/* Desktop Filters */}
      <div className="mt-[55px] md:mt-[58px] bg-white w-full fixed z-10 hidden md:block">
        <div className="flex gap-3 flex-wrap justify-center my-1 sticky top-0 z-20 bg-white py-2 shadow-lg w-full">
          <SortMenu
            width={220}
            title="Sort By"
            options={sortTitle?.data || []}
            onSelect={(value) => dispatch(sortProducts(value))}
          />
          <SortMenu width={220} title="Category" options={categoryOptions} onSelect={handleCategoryChange} />
          {selectedCategoryId && subcategoryOptions.length > 0 && (
            <SortMenu width={220} title="Subcategory" options={subcategoryOptions} onSelect={handleSubcategoryChange} />
          )}

          <button
            className="px-6 py-1 cursor-pointer bg-gray-700 text-white rounded-xl hover:bg-gray-900 transition-colors"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="mt-[56px] md:mt-[58px] bg-white w-full fixed z-10 md:hidden">
        <div className="px-4 py-2 border-b border-gray-200">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Filter size={18} />
            <span className="font-medium">Filters & Sort</span>
            <FaChevronDown className={`transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""}`} size={14} />
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {isMobileFiltersOpen && (
          <div className="bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <SortAsc size={20} />
                  <span>Filter & Sort</span>
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <SortMenu
                  title="Sort By"
                  options={sortTitle?.data || []}
                  onSelect={(value) => dispatch(sortProducts(value))}
                  isMobile={true}
                />

                <SortMenu title="Category" options={categoryOptions} onSelect={handleCategoryChange} isMobile={true} />

                {selectedCategoryId && subcategoryOptions.length > 0 && (
                  <SortMenu
                    title="Subcategory"
                    options={subcategoryOptions}
                    onSelect={handleSubcategoryChange}
                    isMobile={true}
                  />
                )}
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  className="flex-1 py-2.5 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  onClick={handleClearFilters}
                >
                  Clear All
                </button>
                <button
                  className="flex-1 py-2.5 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SortDropdowns
