import React from "react";

const InfoItem = ({ icon: Icon, label, value, link }) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-[0.15em] text-white/35 uppercase mb-1">
          {label}
        </p>
        {link ? (
          <a
            href={link}
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: "#818cf8" }}
            onMouseEnter={e => e.target.style.color = "#c4b5fd"}
            onMouseLeave={e => e.target.style.color = "#818cf8"}
          >
            {value || "N/A"}
          </a>
        ) : (
          <p className="text-sm font-semibold text-white/75">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(InfoItem);
