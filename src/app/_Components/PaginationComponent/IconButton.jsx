import React from 'react'

function IconButton({ children, disabled, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 inline-flex items-center justify-center rounded-md border text-sm cursor-pointer
        ${
          disabled
            ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
        }`}
    >
      {children}
    </button>
  );
}

export default IconButton
