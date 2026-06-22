"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const properties = [
  { label: "1 Bedroom Flat", image: "/images/1Bedroom.png" },
  { label: "3 Bedroom House", image: "/images/3Bedroom.png" },
  { label: "4 Bedroom House", image: "/images/4Bedroom.png" },
  { label: "6 Bedroom House", image: "/images/6Bedroom.PNG" },
  { label: "Luxury Property", image: "/images/Luxury Mansion.PNG" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function QuoteEntrySection() {
  return (
    <section id="quote-entry" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Start your instant quote
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            What are you moving?
          </h2>
          <p className="mt-4 text-slate-600">
            Pick your property type to jump straight into our quote builder — it
            takes less than 90 seconds.
          </p>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
        >
          {properties.map((property) => (
            <motion.div key={property.label} variants={card}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={{
                    pathname: "/quote",
                    query: { property: property.label },
                  }}
                  className="group relative block overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-xl"
                >
                  <img
                    src={property.image}
                    alt={property.label}
                    className="h-56 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-base font-semibold text-white">
                      {property.label}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-white/90">
                      Select & continue
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
