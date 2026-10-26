import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import { DESTINATION_COUNTRIES } from "../../lib/relocationRecord";

/* ---------------------------------------------------------------------------
 * International Relocation — lightweight service page (Phase 1).
 *
 * Part of Smoovely Relocation & Mobility Services. Static marketing content;
 * the enquiry itself runs through the Relocation configurator on /quote.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "International Relocation",
  description:
    "International relocation from the UK — packing, shipping, storage, destination delivery and property setup. Part of Smoovely Relocation & Mobility Services.",
  alternates: { canonical: "/international-relocation" },
};

const INCLUDED = [
  "Export packing & inventory",
  "Sea & air freight coordination",
  "Storage & temporary storage",
  "Destination delivery & unpacking",
  "Furniture assembly",
  "Property setup support",
];

export default function InternationalRelocationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relocation & Mobility"
        title="International Relocation"
        subtitle="A single trusted partner for moving your home or team abroad — planned, packed and delivered with care, door to door."
      />

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-slate-600">
                  Smoovely is expanding from UK removals into full relocation and
                  mobility services. For international moves we coordinate every stage
                  — from packing your belongings in the UK to setting up your new home
                  overseas — so you have one point of contact throughout.
                </p>
              </div>
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/images/international-relocation-hero.jpg"
                  alt="International relocation and shipping services"
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
              What&apos;s included
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="grid gap-4 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <div
                    key={item}
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
                    <span className="text-sm font-semibold text-navy">{item}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="/images/international-relocation-services.jpg"
                  alt="Packing and coordinating international relocation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Popular destinations
            </h2>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
              {DESTINATION_COUNTRIES.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-navy"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Planning a move abroad?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Tell us where you&apos;re heading and what you need moved — we&apos;ll
              put together a tailored relocation proposal.
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
