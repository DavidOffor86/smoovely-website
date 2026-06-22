"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "../data/faqs";

// FAQPage structured data — lets Google show these Q&As as rich results.
// Rendered into the initial HTML (Next.js SSRs client components), so crawlers
// see it without executing the accordion JS.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Got questions?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Removals, Logistics & Storage — Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Everything you need to know about our home removals, office moves,
            man and van, logistics, clearance and storage services across the
            UK. Can&apos;t find your answer? Build an instant quote or call our
            team.
          </p>
        </header>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="text-base font-semibold text-navy">
                    {faq.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 shrink-0 text-green transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-slate-600">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
