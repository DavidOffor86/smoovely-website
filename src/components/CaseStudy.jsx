import Link from "next/link";
import QuoteButton from "./QuoteButton";

function Block({ label, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wider text-green">
        {label}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

export default function CaseStudy({ study }) {
  return (
    <article>
      {/* Header */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute right-[-10%] top-[-40%] h-[420px] w-[420px] rounded-full bg-green blur-[140px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              All case studies
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green">
              {study.client}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {study.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
              {study.summary}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/10">
            <img
              src={study.image}
              alt={study.title}
              className={`h-64 w-full sm:h-80 ${
                study.imageFit === "contain"
                  ? "bg-white object-contain p-2"
                  : "object-cover"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Challenge / Solution / Outcome */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Block label="Challenge">{study.challenge}</Block>
            <Block label="Solution">{study.solution}</Block>
            <Block label="Outcome">{study.outcome}</Block>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Before &amp; after
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Before
              </span>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {study.before}
              </p>
            </div>
            <div className="rounded-2xl border border-green/30 bg-green/5 p-8">
              <span className="inline-flex rounded-full bg-green/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green">
                After
              </span>
              <p className="mt-4 text-base leading-relaxed text-navy">
                {study.after}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="text-lg font-semibold text-navy">
              What we delivered
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {study.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-green"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 pb-20 lg:pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-green blur-[120px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Planning a move like this?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Get a free, no-obligation quote in under 90 seconds.
            </p>
            <QuoteButton variant="primary" className="mt-8">
              Get your quote
            </QuoteButton>
          </div>
        </div>
      </section>
    </article>
  );
}
