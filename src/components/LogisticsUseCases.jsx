const useCases = [
  {
    title: "Sensitive & Medical-Grade Deliveries",
    desc: "Careful, time-critical handling for sensitive items with chain-of-custody tracking.",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z" />
        <line x1="12" y1="9" x2="12" y2="15" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </>
    ),
  },
  {
    title: "Prepared Meal Delivery",
    desc: "Fast, scheduled drops that keep food fresh and customers happy.",
    icon: (
      <>
        <path d="M3 11h18l-1.5 9a1 1 0 0 1-1 .85H5.5a1 1 0 0 1-1-.85z" />
        <path d="M12 11V7a3 3 0 0 1 6 0" />
        <line x1="3" y1="11" x2="3" y2="9" />
      </>
    ),
  },
  {
    title: "Business Logistics",
    desc: "Ongoing B2B routes, pallet moves and bulk distribution on contract.",
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
    title: "Same-Day Urgent Delivery",
    desc: "Book in the morning, delivered by evening — across all major regions.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </>
    ),
  },
  {
    title: "Multi-Stop Distribution",
    desc: "Optimised routing for dozens of drops with live proof of delivery.",
    icon: (
      <>
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

export default function LogisticsUseCases() {
  return (
    <section id="logistics-use-cases" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Built for every route
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Logistics use cases
          </h2>
          <p className="mt-4 text-slate-600">
            One delivery network, flexible enough for whatever your business
            ships.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <article
              key={uc.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green transition-colors duration-300 group-hover:bg-green group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {uc.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">
                {uc.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {uc.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
