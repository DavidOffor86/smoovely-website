import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";

/* ---------------------------------------------------------------------------
 * Sports Relocation — lightweight service page (Phase 1).
 *
 * Part of Smoovely Relocation & Mobility Services. Supports athletes, clubs and
 * staff relocating for transfers. Enquiries run through the Relocation
 * configurator on /quote.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Sports Relocation",
  description:
    "Relocation for athletes, clubs and sporting staff — transfers, family moves and partial shipments handled discreetly. Part of Smoovely Relocation & Mobility Services.",
  alternates: { canonical: "/sports-relocation" },
};

const FOR_WHO = [
  {
    title: "Athletes on transfer",
    body: "Quick, discreet moves timed around signings, pre-season and deadline day.",
  },
  {
    title: "Clubs & academies",
    body: "Coordinated relocation support for incoming players and coaching staff.",
  },
  {
    title: "Families & partners",
    body: "Full household moves so families settle in alongside the athlete.",
  },
  {
    title: "Partial shipments",
    body: "Just the essentials moved fast, with the rest to follow or into storage.",
  },
];

export default function SportsRelocationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relocation & Mobility"
        title="Sports Relocation"
        subtitle="Discreet, deadline-aware relocation for athletes, clubs and sporting staff — at home and internationally."
      />

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-slate-600">
                  Transfers move fast. Smoovely handles the logistics of a sporting
                  relocation — packing, shipping, storage and destination setup — so
                  players and staff can focus on performance, not moving boxes.
                </p>
              </div>
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/images/sports-relocation-hero.jpg"
                  alt="Premium household relocation services"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Who we support
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="grid gap-5 sm:grid-cols-2">
                {FOR_WHO.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/images/sports-relocation-support.jpg"
                  alt="Professional relocation support services"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Managing a transfer or move?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Send us the details and timescales — we&apos;ll arrange a fast,
              confidential relocation plan.
            </p>
            <div className="mt-8">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
              >
                Start your relocation enquiry
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
