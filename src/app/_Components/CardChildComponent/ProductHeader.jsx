import Link from "next/link";
import React from "react";

const ProductHeader = ({ name, id }) => {
  const truncatedName = name?.length > 70 ? `${name.slice(0, 70)}...` : name;

  return (
    <Link
      href={`/detailproduct/${id}`}
      className="text-[#242424] text-[17px]  py-2 px-3 h-14 bg-white rounded-t-3xl  cursor-pointer block"
    >
      <p className="line-clamp-2 overflow-hidden text-ellipsis underline">
  {truncatedName}
</p>

    </Link>
  );
};

export default React.memo(ProductHeader);
