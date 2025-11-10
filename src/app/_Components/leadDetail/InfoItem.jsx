import React from "react";

const InfoItem = ({ icon: Icon, label, value, link }) => {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-4 h-4 text-[#5f2781] mt-1 flex-shrink-0" />
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider">
          {label}
        </p>
        {link ? (
          <a
            href={link}
            className="text-indigo-600 hover:text-indigo-800 transition underline font-medium"
          >
            {value || "N/A"}
          </a>
        ) : (
          <p className="font-semibold text-gray-900">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(InfoItem);
