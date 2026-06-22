import QuoteButton from "./QuoteButton";

// Sector groups that extend the existing Industries section.
const groups = [
  {
    title: "Home Removals & Clearance",
    sectors: [
      {
        id: "private-landlords",
        name: "Private Landlords",
        desc: "Tenant moves and end-of-tenancy clearances.",
      },
      {
        id: "local-councils",
        name: "Local Councils",
        desc: "Housing clearances and tenant relocations.",
      },
    ],
  },
  {
    title: "B2B Logistics & Office Moves",
    sectors: [
      {
        id: "retail",
        name: "Retailers",
        desc: "Stock delivery and multi-drop logistics.",
      },
      {
        id: "construction",
        name: "Construction",
        desc: "Site delivery and material transport.",
      },
      {
        id: "medical",
        name: "Medical",
        desc: "Regulated and sensitive transport.",
      },
      {
        id: "corporate",
        name: "Corporate",
        desc: "Office relocation and internal logistics.",
      },
    ],
  },
];

const PinIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0 text-green"
  >
    <path d="M20 7h-7L9 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
  </svg>
);

export default function IndustrySectors() {
  return (
    <section id="sectors" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Who we serve
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Sectors we support
          </h2>
          <p className="mt-4 text-slate-600">
            Tailored removals, clearance and logistics across the sectors that
            rely on us most.
          </p>
        </header>

        <div className="mt-14 space-y-12">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 text-lg font-semibold text-navy">
                {group.title}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.sectors.map((sector) => (
                  <article
                    key={sector.id}
                    id={sector.id}
                    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10">
                        {PinIcon}
                      </span>
                      <h4 className="text-base font-semibold text-navy">
                        {sector.name}
                      </h4>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {sector.desc}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <QuoteButton variant="primary">Get a Quote</QuoteButton>
        </div>
      </div>
    </section>
  );
}
