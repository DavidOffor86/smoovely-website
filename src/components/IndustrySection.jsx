import Link from "next/link";
import QuoteButton from "./QuoteButton";

const industries = [
  {
    name: "Estate Agents",
    image: "/images/Estate Agent image.jpg",
    description:
      "Fast, dependable moving support for letting and estate agencies working to tight deadlines.",
    useCases: [
      "Last-minute evictions",
      "Quick tenant move-ins and move-outs",
      "Flexible storage between tenancies",
    ],
  },
  {
    name: "High Net Worth & Luxury Clients",
    image: "/images/Luxury Home image1.jpg",
    description:
      "Discreet, white-glove relocations for clients who expect absolute care and confidentiality.",
    useCases: [
      "Sports professionals",
      "Music artists and performers",
      "Executive and international relocations",
    ],
  },
];

export default function IndustrySection({ preview = false }) {
  if (preview) {
    return (
      <section id="industries" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              Industries
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Built for demanding sectors
            </h2>
            <p className="mt-4 text-slate-600">
              Specialist moving and logistics support tailored to the way you
              work.
            </p>
          </header>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {industries.map((industry) => (
              <article
                key={industry.name}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 text-xl font-semibold text-white">
                    {industry.name}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {industry.description}
                  </p>
                  <Link
                    href="/industries"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green"
                  >
                    Explore industry
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="industries" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-20 px-6">
        {industries.map((industry, index) => (
          <div
            key={industry.name}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <div className="overflow-hidden rounded-2xl bg-navy/5 shadow-xl ring-1 ring-slate-200">
                <img
                  src={industry.image}
                  alt={industry.name}
                  className="h-72 w-full object-cover sm:h-96"
                />
              </div>
            </div>
            <div className={index % 2 === 1 ? "lg:order-1" : ""}>
              <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {industry.name}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                {industry.description}
              </p>
              <ul className="mt-8 space-y-3">
                {industry.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="flex items-center gap-3 text-base font-medium text-navy"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green/15 text-green">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {useCase}
                  </li>
                ))}
              </ul>
              <QuoteButton variant="primary" className="mt-8">
                Get a Quote
              </QuoteButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
