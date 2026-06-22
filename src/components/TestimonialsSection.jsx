"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Keya",
    service: "Office Move",
    poster: "/videos/reviews/client1.png",
    video: "/images/Office Relocation video.mp4",
  },
  {
    name: "Daniel",
    service: "Home Removal",
    poster: "/videos/reviews/client2.png",
    video: "/images/Home removals video.mp4",
  },
  {
    name: "Amara",
    service: "Storage & Move",
    poster: "/videos/reviews/client3.png",
    video: "/images/Video Project - Storage .mp4",
  },
];

function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.79-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape + lock body scroll while the modal is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [active]);

  return (
    <section id="testimonials" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Moves Completed Smoovely
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Real customers. Real moves. Real results.
          </p>
        </header>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActive(i)}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-md ring-1 ring-slate-200/80 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-2xl hover:ring-green/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green/40 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              aria-label={`Play ${t.name}'s ${t.service} testimonial`}
            >
              <img
                src={t.poster}
                alt={`${t.name} — ${t.service}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/10 transition-opacity duration-500 group-hover:from-navy/95" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-green opacity-90 shadow-lg backdrop-blur transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-white group-hover:opacity-100">
                  <PlayIcon className="ml-0.5 h-7 w-7" />
                </span>
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {t.name}
                </h3>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-green/90 transition-colors duration-300 group-hover:text-green">
                  {t.service}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <div
        onClick={() => setActive(null)}
        aria-hidden={active === null}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          active !== null
            ? "pointer-events-auto bg-navy/80 opacity-100 backdrop-blur-sm"
            : "pointer-events-none bg-navy/0 opacity-0"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-3xl overflow-hidden rounded-3xl bg-black shadow-2xl transition-all duration-300 ease-out ${
            active !== null ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close video"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {active !== null && (
            <video
              ref={videoRef}
              key={testimonials[active].video}
              src={testimonials[active].video}
              poster={testimonials[active].poster}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-black"
            />
          )}
        </div>
      </div>
    </section>
  );
}
