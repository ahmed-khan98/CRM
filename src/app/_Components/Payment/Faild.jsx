"use client";

import { AlertCircle,  } from "lucide-react";

export default function Faild() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Failed Icon with Animation */}

        {/* Main Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl animate-slide-up">
          {/* Headline */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full p-3 animate-bounce-in shadow-sm">
              <AlertCircle className="w-14 h-14 text-white stroke-[2]" />
            </div>
          </div>
        </div>
          <h2 className="text-2xl font-bold text-center mb-3 text-balance">
            Payment Failed!
          </h2>

          {/* Subheading */}
          <p className="text-center text-gray-600 mb-8 text-pretty">
            Unfortunately, your payment could not be processed. Please try again
            or contact support.
          </p>
        </div>
      </div>
    </main>
  );
}
