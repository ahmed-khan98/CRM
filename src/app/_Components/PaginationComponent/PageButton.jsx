import React from 'react'

function PageButton({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 min-w-8 px-3 rounded-md text-sm border transition cursor-pointer
        ${
          active
            ? "bg-[#5f2781] text-white border-[#5f2781]"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {children}
    </button>
  );
}

export default PageButton
