"use client";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-50 px-4">
        <p className="text-sm font-semibold text-zinc-800">
          The app failed to load
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
