import QuoteButton from "./QuoteButton";

/* ---------------------------------------------------------------------------
 * Council & Public Sector Services section.
 * Mirrors the structure/styling of the existing Industries sections, with a
 * featured Graffiti Removal block and an autoplaying (muted) video asset.
 * Self-contained — added to the Industries page; nothing else is touched.
 * ------------------------------------------------------------------------- */

const services = [
  {
    name: "Graffiti Removal",
    desc: "Rapid, surface-safe removal from walls, shutters, signage and street furniture.",
  },
  {
    name: "Fly-tipping Clearance",
    desc: "Fast response to illegally dumped waste on public and private land.",
  },
  {
    name: "Housing Clearance",
    desc: "Void property, tenancy and estate clearances for housing teams.",
  },
  {
    name: "Site Clearance",
    desc: "Full site strip-outs, grounds and communal area clearances.",
  },
  {
    name: "Emergency Cleanups",
    desc: "Priority call-outs for hazards, flood, eviction and incident sites.",
  },
];

const capabilities = [
  "External wall, shutter and street-furniture cleaning",
  "Sensitive-surface cleaning — brick, stone, render and metal",
  "Rapid-response call-outs for offensive or priority graffiti",
  "Eco-friendly, low-pressure treatments where appropriate",
];

const compliance = [
  "Licensed waste carrier — registered transfer & disposal",
  "Full health & safety method statements and RAMS",
  "Correct handling and storage of cleaning chemicals (COSHH)",
];

const Tick = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 h-5 w-5 shrink-0 text-green"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CouncilServices() {
  return (
    <section id="council" className="scroll-mt-24 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Public sector
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Council &amp; Public Sector Services
          </h2>
          <p className="mt-4 text-slate-600">
            Reliable, fully compliant clearance and cleaning support for
            councils, housing associations, landlords and commercial property
            managers — delivered on schedule and to specification.
          </p>
        </header>

        {/* Service grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-lg"
            >
              <h3 className="text-base font-semibold text-navy">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Featured: Graffiti Removal — video + detailed content */}
        <div
          id="graffiti-removal"
          className="mt-16 grid scroll-mt-24 items-center gap-10 lg:grid-cols-2"
        >
          {/* Video asset — autoplay muted (hero-style), responsive, with fallback */}
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl ring-1 ring-slate-200">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/logistics.jpg"
              aria-label="Smoovely graffiti removal service in action"
            >
              <source
                src="/images/Graffiti removal service.mp4"
                type="video/mp4"
              />
              {/* Fallback for browsers without video support */}
              <img
                src="/images/logistics.jpg"
                alt="Smoovely graffiti removal service"
                className="h-full w-full object-cover"
              />
            </video>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              Featured service
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy">
              Graffiti Removal
            </h3>
            <p className="mt-3 text-slate-600">
              Professional graffiti removal for councils, landlords and
              commercial properties — restoring frontages quickly while
              protecting the underlying surface.
            </p>

            <h4 className="mt-6 text-sm font-bold uppercase tracking-wide text-navy">
              Capabilities
            </h4>
            <ul className="mt-3 space-y-2">
              {capabilities.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-600">
                  {Tick}
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 text-sm font-bold uppercase tracking-wide text-navy">
              Licensing &amp; Compliance
            </h4>
            <ul className="mt-3 space-y-2">
              {compliance.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-600">
                  {Tick}
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <QuoteButton variant="primary">
                Request a Council Services Quote
              </QuoteButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
