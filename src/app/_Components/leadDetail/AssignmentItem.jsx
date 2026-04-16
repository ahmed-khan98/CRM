import React from "react";

const AssignmentItem = ({ icon: Icon, label, value }) => {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.1)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "#818cf8" }}>
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold capitalize text-white/80">{value || "N/A"}</p>
    </div>
  );
};

export default React.memo(AssignmentItem);
