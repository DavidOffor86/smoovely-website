import Link from "next/link";
import { caseStudies } from "../data/caseStudies";

export default function CaseStudiesSection({ preview = false }) {
  const items = preview ? caseStudies.slice(0, 3) : caseStudies;

  return (
    <section id="case-studies" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Case Studies
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Real moves, real results
          </h2>
          <p className="mt-4 text-slate-600">
            See how we handle complex, high-stakes moves — from luxury homes to
            time-critical logistics.
          </p>
        </header>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {items.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative h-52 overflow-hidden ${
                  study.imageFit === "contain" ? "bg-slate-100" : ""
                }`}
              >
                <img
                  src={study.image}
                  alt={study.title}
                  className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
                    study.imageFit === "contain"
                      ? "object-contain p-2"
                      : "object-cover"
                  }`}
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                  {study.client}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold leading-snug text-navy">
                  {study.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {study.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green">
                  Read case study
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {preview && (
          <div className="mt-12 text-center">
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/20 px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-navy/5"
            >
              View all case studies
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
