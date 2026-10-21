import React from "react";

const SkeletonRow = ({cols}) => {
  return (
    <tr className="border-b border-zinc-200">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-zinc-50 rounded-full animate-pulse w-20" />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
