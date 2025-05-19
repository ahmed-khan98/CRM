import Link from "next/link";
import React from "react";

const ProductHeader = ({ name, id }) => {
  const truncatedName = name?.length > 75 ? `${name.slice(0, 75)}...` : name;

  return (
    <Link
      href={`/detailproduct/${id}`}
      className="text-[18px] font-semibold pt-3 px-3 h-16 rounded-t-3xl  cursor-pointer block"
    >
      <p className="line-clamp-2 overflow-hidden text-ellipsis underline capitalize">
  {truncatedName}
</p>

    </Link>
  );
};

export default React.memo(ProductHeader);
