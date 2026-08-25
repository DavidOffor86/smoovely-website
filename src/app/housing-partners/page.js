import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";

/* ---------------------------------------------------------------------------
 * Housing & Property Services — strategic service line landing page.
 *
 * Positions Smoovely as a technology-led relocation, property support and
 * logistics partner for housing associations, local authorities, property
 * managers, agents and developers. Static marketing content; the proposal
 * request itself runs through the Housing configurator on /quote.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Housing & Property Services",
  description:
    "A technology-led relocation, property support and logistics partner for housing associations, local authorities, property managers, agents and developers.",
  alternates: { canonical: "/housing-partners" },
};

const SERVICES = [
  {
    title: "Tenant Relocations",
    body: "Coordinated, respectful moves for tenants — planned and managed end to end.",
  },
  {
    title: "Emergency Moves",
    body: "Rapid response for urgent rehousing, often within 24 hours.",
  },
  {
    title: "Property Clearance",
    body: "Full or partial clearance with responsible, documented disposal.",
  },
  {
    title: "Storage Coordination",
    body: "Short or long-term storage arranged around the move schedule.",
  },
  {
    title: "Vulnerable Resident Support",
    body: "Sensitive, patient handling for residents who need extra care.",
  },
  {
    title: "Packing Services",
    body: "Professional packing, labelling and unpacking to reduce disruption.",
  },
  {
    title: "Void Property Support",
    body: "Turnaround support to get void properties ready for re-letting.",
  },
  {
    title: "Graffiti Removal",
    body: "Fast, discreet removal to keep properties presentable and safe.",
  },
];

const WHY = [
  {
    title: "Dedicated Coordination",
    body: "A single point of contact managing every move from referral to completion.",
  },
  {
    title: "Customer Updates",
    body: "Proactive updates keep your teams and residents informed at each stage.",
  },
  {
    title: "Technology-Driven Processes",
    body: "Digital capture, scheduling and tracking replace paperwork and phone tag.",
  },
  {
    title: "Move Documentation",
    body: "Records and photos captured for auditing, compliance and peace of mind.",
  },
  {
    title: "Flexible Scheduling",
    body: "From emergency call-outs to planned programmes, we work to your timescales.",
  },
  {
    title: "Trusted Partner Network",
    body: "Vetted specialists for clearance, storage, packing and property support.",
  },
  {
    title: "Feedback Monitoring",
    body: "Every move is followed up so quality is measured, not assumed.",
  },
];

const SUITABLE_FOR = [
  "Housing Associations",
  "Local Authorities",
  "Property Managers",
  "Estate Agents",
  "Letting Agents",
  "Developers",
];

const JOURNEY = [
  "Referral",
  "Assessment",
  "Move Plan",
  "Execution",
  "Completion",
  "Feedback",
  "Reporting",
];

const FRAMEWORK_BENEFITS = [
  "Dedicated Coordinator",
  "Priority Response",
  "Preferred Rates",
  "Multi-Service Coverage",
  "Escalation Support",
  "Quarterly Reviews",
  "Reporting & Insights",
];

const EMERGENCY_SUPPORT = [
  "Emergency Relocations",
  "Temporary Accommodation Moves",
  "Flood Support",
  "Fire Relocation Support",
  "Emergency Storage",
  "Urgent Property Clearance",
];

const CORE_SERVICES = [
  "Tenant Relocations",
  "Home Removals",
  "Office Moves",
  "Storage",
  "Property Clearance",
  "Graffiti Removal",
  "Packing Services",
  "Logistics",
];

const PARTNER_SERVICES = [
  "Deep Cleaning",
  "Locksmith Services",
  "Property Maintenance",
  "Painting & Decorating",
  "Pest Control",
  "Flooring",
  "Utilities Coordination",
];

const SERVICE_TIERS = [
  {
    name: "Bronze",
    tagline: "Move Only",
    items: ["Vehicle", "Crew", "Insurance"],
  },
  {
    name: "Silver",
    tagline: "Relocation Support",
    items: ["Move", "Packing", "Resident Updates", "Documentation"],
  },
  {
    name: "Gold",
    tagline: "Managed Relocation",
    items: [
      "Move",
      "Packing",
      "Storage",
      "Tenant Liaison",
      "Progress Updates",
      "Reporting",
      "Partner Coordination",
    ],
  },
];

const TECH_DIFFERENTIATORS = [
  "Quote Configurator",
  "Move Packs",
  "Structured Customer Journey",
  "Feedback Capture",
  "Review Collection",
  "Lead Attribution",
  "Reporting",
  "Communication Workflows",
];

const REPORTING_ITEMS = [
  "Jobs Completed",
  "Service Types",
  "Resident Feedback",
  "Response Times",
  "Resolution Tracking",
];

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-green">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-slate-600">{subtitle}</p>}
    </header>
  );
}

export default function HousingPartnersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Housing & Property Services"
        title="Your relocation & property support partner"
        subtitle="A technology-led relocation, property support and logistics partner for housing associations, local authorities, property managers, agents and developers."
      />

      {/* SERVICES */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Our Services"
              title="Support across the property lifecycle"
              subtitle="One coordinated partner for moves, clearance, storage and resident support."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* WHY SMOOVELY */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Why Smoovely"
              title="Built for partners who expect more"
              subtitle="Reliability, communication and accountability at every stage."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {w.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SUITABLE FOR */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Suitable For"
              title="Who we partner with"
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUITABLE_FOR.map((org) => (
                <div
                  key={org}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-navy">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* RECURRING REVENUE POSITIONING */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              A Relocation Partner, not a Removal Contractor
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Built for ongoing relationships
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Smoovely works as a long-term relocation partner — supporting
              framework agreements, property support, resident support and
              end-to-end relocation management — rather than delivering one-off
              removals. We plan around your programmes, not just single jobs.
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
              {[
                "Ongoing Relationships",
                "Framework Agreements",
                "Property Support",
                "Resident Support",
                "Relocation Management",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* EMERGENCY RESPONSE */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Rapid Response"
              title="Emergency Relocation & Property Support"
              subtitle="When something goes wrong, we mobilise quickly — supporting residents and properties at short notice."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EMERGENCY_SUPPORT.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/40 p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-navy">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SERVICE DELIVERY MODEL */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Service Delivery Model"
              title="One point of contact, complete coverage"
              subtitle="Smoovely delivers core services directly and coordinates approved partners for everything else — so you manage a single relationship."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-navy">Core Services</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Delivered directly by Smoovely.
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CORE_SERVICES.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm font-medium text-navy"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-navy">Partner Services</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Delivered through approved partners, coordinated by Smoovely.
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PARTNER_SERVICES.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm font-medium text-navy"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-medium text-slate-600">
              Smoovely acts as your coordinator and single point of contact —
              managing both core and partner services on your behalf.
            </p>
          </div>
        </section>
      </Reveal>

      {/* SERVICE TIERS */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Service Tiers"
              title="Choose the level of support you need"
              subtitle="From a straightforward move to a fully managed relocation programme."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {SERVICE_TIERS.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border bg-white p-6 shadow-sm ${
                    i === 2 ? "border-green ring-1 ring-green/30" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-navy">{tier.name}</h3>
                    {i === 2 && (
                      <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                        Most complete
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-green">
                    {tier.tagline}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {tier.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FRAMEWORK & PARTNERSHIP AGREEMENTS */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow="Framework & Partnership Agreements"
              title="Ongoing service relationships, not one-off transactions"
              subtitle="Smoovely supports organisations through ongoing service relationships rather than one-off transactions — with clear benefits built in."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FRAMEWORK_BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-navy">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* CUSTOMER JOURNEY */}
      <Reveal>
        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green">
                Customer Journey
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How a move runs, end to end
              </h2>
            </header>
            <ol className="mx-auto mt-12 flex max-w-4xl flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              {JOURNEY.map((stage, i) => (
                <li key={stage} className="flex items-center gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{stage}</span>
                  </div>
                  {i < JOURNEY.length - 1 && (
                    <span className="hidden text-green sm:inline" aria-hidden="true">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* TECHNOLOGY & COMMUNICATION */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green">
                Technology & Communication
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                Digital by default, human where it matters
              </h2>
              <p className="mt-4 text-slate-600">
                Enquiries, scheduling and updates are handled through structured
                digital processes — so nothing is lost, everything is auditable,
                and your teams and residents stay informed. Behind the technology
                is a dedicated coordinator who owns each move.
              </p>
              <p className="mt-4 text-slate-600">
                This is what sets us apart from traditional movers: a connected
                platform spanning quoting, delivery, feedback and reporting —
                not a phone number and a van.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {TECH_DIFFERENTIATORS.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-navy"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* FUTURE REPORTING */}
      <Reveal>
        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green">
                Reporting & Insight
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Monthly reporting for accountable partners
              </h2>
              <p className="mt-4 text-slate-300">
                Housing associations and local authorities receive regular
                reporting so performance is visible, measurable and easy to share
                with stakeholders.
              </p>
            </header>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {REPORTING_ITEMS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/15 bg-white/5 p-5 text-center text-sm font-semibold text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* REQUEST DISCUSSION CTA */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Let&apos;s discuss your requirements
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Tell us about your properties and residents, and we&apos;ll put
              together a tailored proposal. No obligation, no pricing pressure —
              just a conversation about how we can help.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
              >
                Request a Discussion
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-lg border border-green px-6 py-3.5 text-sm font-semibold text-green transition hover:bg-green/5"
              >
                Start a Proposal Request
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
