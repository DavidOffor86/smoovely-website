import Link from "next/link";
import Image from "next/image";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import FAQAccordion from "../../components/FAQAccordion";
import {
  VEHICLE_TYPES,
  EXTERIOR_SERVICES,
  INTERIOR_SERVICES,
  CLEANING_FREQUENCIES,
} from "../../lib/fleetWashingRecord";

/* ---------------------------------------------------------------------------
 * Fleet Washing Services — static marketing page (EcoFleet Wash partner).
 *
 * 13-section landing page. Powered by EcoFleet Wash. Assessment enquiries
 * route through the Fleet Washing configurator (/quote).
 * All content emphasises EcoFleet Wash partnership and dual commitment.
 * Includes Trust Bar, improved Services cards, FAQ with schema.
 * FAQAccordion is a client component for interactivity.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Fleet Washing Services UK | Commercial Vehicle Cleaning | EcoFleet Wash",
  description:
    "Professional on-site fleet washing for vans, HGVs and commercial vehicles. Flexible scheduling, nationwide coverage, fully insured. Get a tailored quotation in 48 hours.",
  keywords:
    "fleet washing, commercial vehicle cleaning, HGV washing, van cleaning, on-site fleet washing, truck washing UK",
  alternates: { canonical: "https://smoovely.com/fleet-washing" },
  openGraph: {
    title: "Professional Fleet Washing Services | EcoFleet Wash",
    description:
      "On-site fleet cleaning for vans, HGVs and commercial vehicles.",
    type: "website",
    url: "https://smoovely.com/fleet-washing",
    siteName: "Smoovely",
  },
};

// JSON-LD Structured Data
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Fleet Washing Services",
  description:
    "Professional on-site fleet cleaning for commercial vehicles including vans, HGVs and trucks",
  provider: {
    "@type": "Organization",
    name: "EcoFleet Wash",
    url: "https://smoovely.com",
  },
  areaServed: {
    "@type": "Country",
    name: "GB",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: "Contact for quote",
    description: "Tailored fleet washing quotations based on fleet size and requirements",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does fleet washing cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fleet washing costs depend on your fleet size, vehicle types, service scope and frequency. EcoFleet Wash provides tailored quotations based on your specific requirements. Submit an assessment to receive a custom quote.",
      },
    },
    {
      "@type": "Question",
      name: "Do you clean HGV fleets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. EcoFleet Wash specializes in commercial vehicle cleaning, including HGV tractor units, trailers, large vans, small vans and all commercial fleet types. Your assessment form lets you specify your exact fleet composition.",
      },
    },
    {
      "@type": "Question",
      name: "Can vehicles be cleaned on-site?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. EcoFleet Wash offers on-site cleaning at your depot, customer sites, driver homes or other locations. Site access and any specific requirements are discussed during your assessment.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer one-off cleans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In addition to regular maintenance schedules (weekly, fortnightly, monthly), EcoFleet Wash offers one-off cleaning services for one-time deep cleans or seasonal refreshes.",
      },
    },
    {
      "@type": "Question",
      name: "Is Fleet Washing delivered by Smoovely or EcoFleet Wash?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EcoFleet Wash is the professional fleet cleaning partner. Smoovely connects you and handles your initial assessment; EcoFleet Wash owns the customer relationship, provides quotations, manages contracts and delivers the service directly.",
      },
    },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Smoovely",
  url: "https://smoovely.com",
  description: "Marketing and referral partner for EcoFleet Wash fleet washing services",
  partnerOf: {
    "@type": "Organization",
    name: "EcoFleet Wash",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://smoovely.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Fleet Washing Services",
      item: "https://smoovely.com/fleet-washing",
    },
  ],
};

export default function FleetWashingPage() {

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHeader
        eyebrow="Fleet Management"
        title="Fleet Washing Services"
        subtitle="Keep your commercial vehicles spotless — flexible cleaning schedules tailored to your operations. Powered by EcoFleet Wash."
      />

      {/* POWERED BY ECOFLEET WASH — Enhanced Branding */}
      <Reveal>
        <section className="bg-slate-50 py-8 lg:py-10 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="space-y-6">
              {/* Primary: EcoFleet Wash */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Powered By</span>
                <div className="relative h-8 w-auto">
                  <Image
                    src="/images/fleet-washing/Eco_Fleet_Wash_Logo_1.png"
                    alt="EcoFleet Wash logo - Professional fleet washing specialist"
                    height={32}
                    width={140}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Secondary: Smoovely Partnership */}
              <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-300">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">In Strategic Partnership With</span>
                <div className="relative h-5 w-auto">
                  <Image
                    src="/images/Hero Smoovely Logo Main.jpg"
                    alt="Smoovely - Assessment platform partner"
                    height={20}
                    width={70}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* TRUST BAR — NEW */}
      <Reveal>
        <section className="bg-gradient-to-r from-blue-50 to-slate-50 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "✓", title: "Fully Insured" },
                { icon: "🌍", title: "Nationwide Coverage" },
                { icon: "📋", title: "Flexible Fleet Contracts" },
                { icon: "⚡", title: "Fast Quotations" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg bg-white p-5 shadow-sm"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 1: Hero Context — Already covered by PageHeader */}

      {/* SECTION 2: About EcoFleet Wash + Hero Image */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-slate-600">
                  EcoFleet Wash is the UK&apos;s trusted partner for professional fleet
                  cleaning. With years of experience managing commercial fleets of all
                  sizes, they deliver high-quality cleaning on your schedule — keeping
                  your vehicles in top condition while you focus on operations.
                </p>
                <p className="mt-4 text-slate-600">
                  Smoovely partners with EcoFleet Wash to bring you convenient fleet
                  assessment and quotation. We handle the initial enquiry; EcoFleet Wash
                  manages your contract, invoicing and ongoing service.
                </p>
              </div>
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/fleet-washing/fleet-washing-hero.jpg"
                  alt="Professional fleet washing operation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 3: Fleet Washing Services (Exterior & Interior) */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Our Fleet Washing Services
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Exterior Services */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-6">Exterior Services</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {EXTERIOR_SERVICES.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-slate-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interior Services */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-6">Interior Services</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {INTERIOR_SERVICES.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-slate-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 4: Vehicle Types Supported */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Vehicle Types Supported
            </h2>
            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
              {VEHICLE_TYPES.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-semibold text-navy"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-xl text-slate-600">
              From small cars to large HGVs and trailers, EcoFleet Wash handles all
              commercial vehicle types with professional care.
            </p>
          </div>
        </section>
      </Reveal>

      {/* SECTION 5: Cleaning Frequencies */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cleaning Frequencies
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              We work around your operational schedule.
            </p>
            <div className="mx-auto mt-8 max-w-2xl grid gap-3">
              {CLEANING_FREQUENCIES.map((freq) => (
                <div
                  key={freq}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy"
                >
                  {freq}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 6: Industries Served */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Industries We Serve
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Logistics & Haulage",
                "Construction",
                "Waste Management",
                "Delivery Services",
                "Field Services",
                "Specialist Transport",
              ].map((industry) => (
                <div
                  key={industry}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5"
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
                  <span className="text-sm font-semibold text-navy">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 7: Why EcoFleet Wash (Benefits) + Image */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                  Why Partner with EcoFleet Wash
                </h2>
                <div className="mt-10 space-y-6">
                  {[
                    {
                      title: "Professional Quality",
                      desc: "Expert cleaning tailored to your vehicle types and operational requirements.",
                    },
                    {
                      title: "Flexible Scheduling",
                      desc: "Cleaning slots arranged around your fleet availability — weekly, fortnightly, monthly or on-demand.",
                    },
                    {
                      title: "On-Site Service",
                      desc: "Vehicles cleaned at your depot, customer sites, or driver homes — whatever works for your operation.",
                    },
                    {
                      title: "Compliance Support",
                      desc: "Health & safety inductions, PPE compliance and environmental awareness included.",
                    },
                    {
                      title: "Direct Partnership",
                      desc: "You work directly with the EcoFleet Wash team — dedicated account management and responsive support.",
                    },
                    {
                      title: "Transparent Pricing",
                      desc: "Custom quotations based on your fleet size, vehicle types and service requirements.",
                    },
                  ].map((benefit) => (
                    <div key={benefit.title} className="border-l-4 border-green pl-4">
                      <h3 className="font-bold text-navy">{benefit.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/fleet-washing/fleet-washing-operator.jpg"
                  alt="Fleet washing team in action"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 8: Fleet Assessment Process */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Getting started is simple. Just tell us about your fleet, and we&apos;ll
              connect you directly with the EcoFleet Wash team.
            </p>
            <div className="mt-10 space-y-4 text-left">
              {[
                { num: "1", title: "Assessment", desc: "Submit your fleet details via our quick assessment form." },
                { num: "2", title: "Review", desc: "We verify your requirements and submit to EcoFleet Wash." },
                { num: "3", title: "Quotation", desc: "EcoFleet Wash contacts you directly with a tailored quote." },
                { num: "4", title: "Contract", desc: "Agree terms and schedule directly with EcoFleet Wash." },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green text-white font-bold text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 9: Pricing Guide */}
      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Pricing Is Tailored
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Fleet washing costs depend on your fleet size, vehicle types, service
              scope and frequency. There&apos;s no one-size-fits-all price — your
              quotation will reflect exactly what you need.
            </p>
            <div className="mt-8 inline-block rounded-lg bg-white p-6 shadow-sm border border-slate-200">
              <div className="space-y-2 text-left">
                <p className="text-sm text-slate-600">Factors that affect pricing:</p>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li>• Total number of vehicles</li>
                  <li>• Vehicle types & sizes</li>
                  <li>• Service scope (exterior, interior, or both)</li>
                  <li>• Cleaning frequency</li>
                  <li>• Site access requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 9B: FAQ — NEW */}
      <FAQAccordion />

      {/* SECTION 10: Partner Relationship Notice */}
      <Reveal>
        <section className="bg-blue-50 py-16 lg:py-20 border-l-4 border-blue-600">
          <div className="mx-auto max-w-4xl px-6">
            {/* Dual Logo Partnership Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 pb-8 border-b border-blue-200">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Service Provider</span>
                <div className="relative h-12 w-auto">
                  <Image
                    src="/images/fleet-washing/Eco_Fleet_Wash_Logo_1.png"
                    alt="EcoFleet Wash - Fleet washing service provider"
                    height={48}
                    width={160}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-2xl text-blue-400 hidden sm:block">+</div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Strategic Partner</span>
                <div className="relative h-10 w-auto">
                  <Image
                    src="/images/Hero Smoovely Logo Main.jpg"
                    alt="Smoovely - Assessment and introduction partner"
                    height={40}
                    width={90}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Partnership Heading and Description */}
            <h2 className="text-2xl font-bold text-navy text-center mb-6">
              Strategic Partnership
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6 text-sm">
              <div className="flex gap-3">
                <div className="text-xl font-bold text-blue-600 flex-shrink-0">1.</div>
                <div>
                  <p className="font-semibold text-navy mb-1">EcoFleet Wash</p>
                  <p className="text-slate-700">Delivers all professional fleet washing services, manages customer relationships, and provides tailored quotations.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl font-bold text-blue-600 flex-shrink-0">2.</div>
                <div>
                  <p className="font-semibold text-navy mb-1">Smoovely</p>
                  <p className="text-slate-700">Provides the assessment platform and introduction process, connecting you with the EcoFleet Wash team.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-navy text-center mb-4">
              About This Partnership
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Smoovely</strong> acts as a marketing and referral partner for
                EcoFleet Wash fleet washing services. We help you submit an assessment
                and connect with the EcoFleet Wash team.
              </p>
              <p>
                <strong>EcoFleet Wash</strong> owns the customer relationship, quotation,
                contract, invoicing and ongoing service delivery. You will work directly
                with them once your assessment is submitted.
              </p>
              <p>
                Both companies are committed to your success. If you have any questions
                during the assessment process, contact Smoovely support. Once you&apos;re
                working with EcoFleet Wash, they&apos;ll be your primary point of contact.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SECTION 11: Final CTA */}
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Ready to Clean Up?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Submit a quick fleet assessment and we&apos;ll put you in touch with the
              EcoFleet Wash team. No obligation, transparent pricing.
            </p>
            <div className="mt-8">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
              >
                Start Your Fleet Assessment
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
