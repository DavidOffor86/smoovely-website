"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "How much does fleet washing cost?",
    a: "Fleet washing costs depend on your fleet size, vehicle types, service scope and frequency. EcoFleet Wash provides tailored quotations based on your specific requirements. Submit an assessment to receive a custom quote.",
  },
  {
    q: "Do you clean HGV fleets?",
    a: "Yes. EcoFleet Wash specializes in commercial vehicle cleaning, including HGV tractor units, trailers, large vans, small vans and all commercial fleet types. Your assessment form lets you specify your exact fleet composition.",
  },
  {
    q: "Can vehicles be cleaned on-site?",
    a: "Yes. EcoFleet Wash offers on-site cleaning at your depot, customer sites, driver homes or other locations. Site access and any specific requirements are discussed during your assessment.",
  },
  {
    q: "Do you offer one-off cleans?",
    a: "Yes. In addition to regular maintenance schedules (weekly, fortnightly, monthly), EcoFleet Wash offers one-off cleaning services for one-time deep cleans or seasonal refreshes.",
  },
  {
    q: "Is Fleet Washing delivered by Smoovely or EcoFleet Wash?",
    a: "EcoFleet Wash is the professional fleet cleaning partner. Smoovely connects you and handles your initial assessment; EcoFleet Wash owns the customer relationship, provides quotations, manages contracts and delivers the service directly.",
  },
];

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <Reveal>
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-100 transition font-semibold text-navy text-sm"
                >
                  {faq.q}
                  <span
                    className={`text-xl transition ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                  >
                    ⊕
                  </span>
                </button>

                {openIdx === idx && (
                  <div className="px-6 pb-4 border-t border-slate-200 bg-white">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
