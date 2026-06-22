"use client";

// Placeholder number — replace with the real business line.
const PHONE = "+441234567890";

export default function FloatingCallButton() {
  return (
    <a
      href={`tel:${PHONE}`}
      aria-label="Call us now"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green text-white opacity-90 shadow-lg shadow-green/30 transition duration-300 hover:scale-105 hover:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green/40"
    >
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        Call us now
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </a>
  );
}
