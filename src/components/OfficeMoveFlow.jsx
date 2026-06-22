const steps = [
  {
    title: "Planning & Assessment",
    desc: "Site survey, floor plans and a phased schedule built around your downtime.",
  },
  {
    title: "Inventory & Equipment Prep",
    desc: "Every asset logged, labelled and colour-coded desk-to-desk.",
  },
  {
    title: "Packing & IT Disconnection",
    desc: "Secure packing and managed disconnection of IT, servers and cabling.",
  },
  {
    title: "Transport & Logistics",
    desc: "Tracked transport in protected vans with sequenced loading.",
  },
  {
    title: "Setup & Reinstallation",
    desc: "Desks rebuilt and IT reconnected so staff start work on arrival.",
  },
];

const teamSizes = [
  { label: "Small office", team: "2–3 team members", note: "Up to ~15 desks" },
  { label: "Medium office", team: "3–6 team members", note: "~15–50 desks" },
  { label: "Large office", team: "6+ team members", note: "50+ desks / multi-floor" },
];

export default function OfficeMoveFlow() {
  return (
    <section id="office-moves" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Deep dive — Office Moves
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            A proven, five-stage relocation process
          </h2>
          <p className="mt-4 text-slate-600">
            Structured, low-risk office moves designed around zero business
            downtime.
          </p>
        </header>

        {/* Process flow */}
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green/40 hover:shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-base font-bold text-green">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
              {/* Flow arrow (desktop only) */}
              {i < steps.length - 1 && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-green/50 lg:block"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </li>
          ))}
        </ol>

        {/* Team size estimates */}
        <div className="mt-16">
          <h3 className="text-center text-lg font-semibold text-navy">
            Recommended team size
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {teamSizes.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-green">
                  {t.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-navy">{t.team}</p>
                <p className="mt-2 text-sm text-slate-500">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
