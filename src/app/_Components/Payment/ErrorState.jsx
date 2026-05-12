import { Info } from "lucide-react";
import { memo } from "react";

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
    <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-zinc-200 max-w-sm">
      <div className="bg-red-50 text-red-500 p-3 rounded-full inline-block mb-4">
        <Info size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Payment Link Error</h2>
      <p className="text-zinc-500 text-sm mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-zinc-900 text-white py-2 rounded-lg font-bold"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default memo(ErrorState)
