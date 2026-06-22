"use client";

import { useState } from "react";

// Per-service "What to Expect" (premium standards) + concise pre-move tips.
const services = [
  {
    title: "Home Removals",
    image: "/images/Lanfing Page Smoovely Van.png",
    expect: [
      "Real-time arrival and progress updates",
      "Careful packing of fragile and high-value items",
      "Full goods-in-transit insurance as standard",
      "Trained, uniformed handlers and clean Luton vans",
    ],
    tips: [
      "Label boxes clearly by room",
      "Separate valuables and documents to carry yourself",
      "Plan and reserve parking access at both ends",
    ],
  },
  {
    title: "Office Moves",
    image: "/images/Main Office Move image.jpeg",
    expect: [
      "Dedicated move manager and phased schedule",
      "Secure IT disconnection, transport and reinstallation",
      "Out-of-hours and weekend slots to avoid downtime",
      "Colour-coded, desk-to-desk asset tracking",
    ],
    tips: [
      "Plan downtime around your busiest hours",
      "Photograph and document IT setups before unplugging",
      "Inform staff and assign a single point of contact",
    ],
  },
  {
    title: "Logistics & Parcel Delivery",
    image: "/images/Logistics Unloading.jpeg",
    expect: [
      "Live tracking and proof of delivery",
      "Optimised multi-drop routing for speed",
      "Same-day and scheduled delivery windows",
      "Pallet, parcel and bulk goods handling",
    ],
    tips: [
      "Confirm delivery windows and access in advance",
      "Package and label items securely for transit",
      "Share contact details for each drop point",
    ],
  },
  {
    title: "Clearance & Disposal",
    image: "/images/Home Clearance Image.jpeg",
    expect: [
      "Licensed waste carriers and certified disposal",
      "Eco-friendly recycling and donation routing",
      "Fast mobilisation for urgent clearances",
      "Full PPE and protective handling on site",
    ],
    tips: [
      "Set aside items to keep before we arrive",
      "Flag hazardous or electrical waste in advance",
      "Confirm access for larger waste bins",
    ],
  },
  {
    title: "Storage Solutions",
    image: "/images/3-4 Bedroom Storage - 100sqft - image2.jpeg",
    expect: [
      "CCTV-monitored, access-controlled facilities",
      "Flexible short- and long-term contracts",
      "Clean, dry units with climate-safe options",
      "Easy combined storage-and-move pricing",
    ],
    tips: [
      "Choose the correct unit size for your load",
      "Consider climate-sensitive items (wood, electronics)",
      "Label every stored box and keep an inventory",
    ],
  },
];

const Check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 h-4 w-4 shrink-0 text-green"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ServiceExpectations() {
  const [open, setOpen] = useState(0);

  return (
    <section id="what-to-expect" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Top Class Service
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            What to expect from every move
          </h2>
          <p className="mt-4 text-slate-600">
            Modern standards, premium handling and practical tips — for each of
            our core services.
          </p>
        </header>

        <div className="mt-12 space-y-4">
          {services.map((service, i) => {
            const isOpen = open === i;
            return (
              <div
                key={service.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <span className="flex-1 text-lg font-semibold text-navy">
                    {service.title}
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

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-8 border-t border-slate-100 px-5 py-6 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">
                          Top class service — what to expect
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                          {service.expect.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-relaxed text-slate-600"
                            >
                              {Check}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-green">
                          Tips before your move
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                          {service.tips.map((tip) => (
                            <li
                              key={tip}
                              className="flex gap-2 text-sm leading-relaxed text-slate-700"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
