import Link from "next/link";
import QuoteButton from "./QuoteButton";

const solutions = [
  {
    title: "Home Removals",
    desc: "Stress-free house moves with expert packing, careful handling and same-day options.",
    image: "/images/Lanfing Page Smoovely Van.png",
  },
  {
    title: "Office Moves",
    desc: "Relocate your business with minimal downtime and full IT and equipment care.",
    image: "/images/Main Office Move image.jpeg",
  },
  {
    title: "Logistics & Parcel Delivery",
    desc: "Scheduled and same-day delivery for parcels, pallets and bulk goods UK-wide.",
    image: "/images/Logistics Unloading.jpeg",
  },
  {
    title: "Storage Solutions",
    desc: "Secure, flexible short and long-term storage with 24/7 protection and easy access.",
    image: "/images/3-4 Bedroom Storage - 100sqft - image2.jpeg",
  },
  {
    title: "Clearance & Disposal",
    desc: "Fast, responsible clearances with eco-friendly recycling and certified disposal.",
    image: "/images/Home Clearance Image.jpeg",
  },
];

const Arrow = (
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
);

export default function SolutionsSection({
  eyebrow = "Our Solutions",
  title = "Everything you need to move",
  subtitle = "From a single room to a full office relocation — handled end to end, with one transparent price.",
}) {
  return (
    <section id="solutions" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-600">{subtitle}</p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.title}
              href="/quote"
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green/40 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navy">
                  {solution.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {solution.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green">
                  Get a quote {Arrow}
                </span>
              </div>
            </Link>
          ))}

          {/* Bespoke CTA card */}
          <div className="flex flex-col justify-center rounded-2xl border border-navy/10 bg-navy p-8 text-center">
            <h3 className="text-xl font-semibold text-white">
              Need something bespoke?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Tell us about your move and get a tailored, transparent quote in
              under a minute.
            </p>
            <QuoteButton variant="primary" className="mt-6 self-center">
              Build your quote
            </QuoteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
