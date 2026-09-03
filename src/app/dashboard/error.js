"use client";

export default function DashboardError({ reset }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
      <p className="text-sm font-semibold text-zinc-800">
        This page could not be loaded
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
