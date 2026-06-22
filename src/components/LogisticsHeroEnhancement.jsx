"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import QuoteButton from "./QuoteButton";

const benefits = [
  "Tracking on every job, end to end",
  "Reliable, on-time delivery you can plan around",
  "Scale capacity up or down without hiring",
  "Tailored logistics for businesses of any size",
];

// Floating "network node" icons positioned around the image.
const nodes = [
  {
    label: "Home",
    pos: "left-[-4%] top-[12%]",
    delay: 0,
    icon: (
      <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
    ),
  },
  {
    label: "Office",
    pos: "right-[-3%] top-[8%]",
    delay: 0.6,
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <line x1="9" y1="7" x2="9" y2="7.01" />
        <line x1="15" y1="7" x2="15" y2="7.01" />
        <line x1="9" y1="12" x2="9" y2="12.01" />
        <line x1="15" y1="12" x2="15" y2="12.01" />
      </>
    ),
  },
  {
    label: "Parcel",
    pos: "left-[-2%] bottom-[14%]",
    delay: 1.2,
    icon: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
  },
  {
    label: "Van",
    pos: "right-[-4%] bottom-[10%]",
    delay: 1.8,
    icon: (
      <>
        <path d="M1 3h13v13H1z" />
        <path d="M14 8h4l3 3v5h-7z" />
        <circle cx="5.5" cy="18.5" r="1.5" />
        <circle cx="17.5" cy="18.5" r="1.5" />
      </>
    ),
  },
];

export default function LogisticsHeroEnhancement() {
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  // Feature 4 — dot drifts vertically with scroll.
  const dotY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section id="logistics-network" className="bg-navy py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* LEFT — copy */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Intelligent delivery network
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Scale Your Logistics with Smoovely&apos;s Intelligent Delivery
            Network
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
            Move more without adding overhead. Track every delivery in real
            time, hit your windows consistently, and flex capacity on demand —
            all from one connected logistics partner.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 text-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-5 w-5 shrink-0 text-green"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <QuoteButton variant="primary" className="mt-9">
            Scale your deliveries
          </QuoteButton>
        </div>

        {/* RIGHT — image with floating nodes + scroll dot */}
        <div ref={imageRef} className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <img
              src="/images/Logistics World Map coverage.png"
              alt="Smoovely intelligent delivery network"
              loading="lazy"
              className="h-[340px] w-full object-cover sm:h-[440px] filter brightness-75"
            />
            <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-navy/60 to-transparent" />
          </div>

          {/* Scroll-reactive dot (Feature 4) */}
          <motion.span
            style={{ y: dotY }}
            className="absolute right-10 top-10 h-3.5 w-3.5 rounded-full bg-green shadow-[0_0_14px_4px_rgba(31,168,74,0.6)]"
          />

          {/* Floating network nodes (Feature 1) */}
          {nodes.map((node) => (
            <motion.div
              key={node.label}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.delay,
              }}
              className={`absolute ${node.pos} flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-green shadow-[0_0_18px_2px_rgba(31,168,74,0.45)] ring-1 ring-green/30 backdrop-blur`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                {node.icon}
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
