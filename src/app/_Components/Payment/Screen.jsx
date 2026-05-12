import { memo } from "react";

const Screen = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

export default memo(Screen)
