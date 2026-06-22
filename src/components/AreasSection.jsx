import Link from "next/link";
import QuoteButton from "./QuoteButton";

const regions = [
  {
    name: "South-East Region",
    towns: ["Greenwich", "Woolwich", "Bexley", "Dartford", "Bromley", "Sidcup"],
  },
  {
    name: "West Region",
    towns: ["Reading", "Slough", "Hounslow", "Ealing", "Uxbridge"],
  },
  {
    name: "South West Region",
    towns: ["Bristol", "Bath", "Wimbledon", "Kingston", "Richmond"],
  },
  {
    name: "North West Region",
    towns: ["Watford", "Harrow", "Wembley", "St Albans", "Hemel Hempstead"],
  },
  {
    name: "North East Region",
    towns: ["Enfield", "Edmonton", "Walthamstow", "Romford", "Ilford"],
  },
];

export default function AreasSection() {
  return (
    <section id="areas" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Coverage
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Areas we serve
          </h2>
          <p className="mt-4 text-slate-600">
            We cover towns and cities across five regions, with same-day options
            available throughout. Find your area below.
          </p>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {/* Map */}
          <div className="lg:col-span-1">
            <div className="relative h-full overflow-hidden rounded-2xl bg-navy/5 shadow-xl ring-1 ring-slate-200">
              <img
                src="/images/Map of Europe -pexels-lara-J.jpg"
                alt="Map of regions served by Smoovely QuickMove"
                loading="lazy"
                className="h-full min-h-[280px] w-full object-cover"
              />
              {/* Overlay the detailed coverage map (local) to replace metro lines; hidden on small screens */}
              <img
                src="/images/Logistics World Map coverage.png"
                alt="Local coverage overlay"
                loading="lazy"
                className="pointer-events-none absolute right-6 bottom-6 hidden sm:block w-1/3 max-w-[260px] object-contain"
              />
            </div>
          </div>

          {/* Region cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {regions.map((region) => (
              <div
                key={region.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-xl"
              >
                <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-green"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {region.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {region.towns.map((town) => (
                    <li key={town}>
                      <Link
                        href="/quote#postcode"
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-navy transition hover:border-green hover:bg-green hover:text-white"
                      >
                        {town}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <QuoteButton variant="navy" href="/quote#postcode">
            Check your area
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}
