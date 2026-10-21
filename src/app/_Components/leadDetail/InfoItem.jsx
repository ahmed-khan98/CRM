import React from "react";

const InfoItem = ({ icon: Icon, label, value, link }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
        <Icon className="h-3.5 w-3.5 text-zinc-300" />
      </div>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </p>
        {link ? (
          <a
            href={link}
            className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
          >
            {value || "N/A"}
          </a>
        ) : (
          <p className="text-sm font-semibold text-zinc-200">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(InfoItem);
