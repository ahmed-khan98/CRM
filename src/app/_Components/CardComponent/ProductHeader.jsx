import Link from "next/link";
import React from "react";

const ProductHeader = ({ name, id }) => {
  const truncateWords = (str, limit = 8) => {
    if (!str) return "";
    const words = str.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : str;
  };
  
  const truncatedName = truncateWords(name, 8);
  
  return (
    <Link
      href={`/detailproduct/${id}`}
      className="text-[18px] font-semibold pt-3 px-3 h-16 rounded-t-3xl text-[#0578ff] cursor-pointer  bg-orange-50"
    >
      <p className="line-clamp-2 overflow-hidden text-ellipsis underline capitalize">
  {truncatedName}
</p>

    </Link>
  );
};

export default React.memo(ProductHeader);
