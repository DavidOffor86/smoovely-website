import Link from "next/link";
import QuoteButton from "./QuoteButton";

/* ---------------------------------------------------------------------------
 * Full guide/article renderer for /resources/[slug].
 * Renders the intro, structured sections (heading + paragraphs + optional
 * list) and key takeaways. Mirrors the CaseStudy layout for visual consistency.
 * ------------------------------------------------------------------------- */

export default function ResourceArticle({ post }) {
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
              href="/resources"
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
              All resources
            </Link>
            <div className="mt-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-green">
              <span>{post.tag}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{post.readTime}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
              {post.excerpt}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          {post.intro && (
            <p className="text-lg leading-relaxed text-slate-700">
              {post.intro}
            </p>
          )}

          {post.sections?.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((para, i) => (
                <p
                  key={i}
                  className="mt-4 text-base leading-relaxed text-slate-600"
                >
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-base leading-relaxed text-slate-600"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-1 h-4 w-4 shrink-0 text-green"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Key takeaways */}
          {post.takeaways?.length > 0 && (
            <div className="mt-12 rounded-2xl border border-green/30 bg-green/5 p-8">
              <h2 className="text-lg font-semibold text-navy">Key takeaways</h2>
              <ul className="mt-5 space-y-3">
                {post.takeaways.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-navy"
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
          )}
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
              Ready to plan your move?
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
