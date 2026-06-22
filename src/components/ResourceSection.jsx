import Link from "next/link";
import { resources } from "../data/resources";

export default function ResourceSection({ preview = false }) {
  const items = preview ? resources.slice(0, 3) : resources;

  return (
    <section id="resources" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Resources
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Guides &amp; insights
          </h2>
          <p className="mt-4 text-slate-600">
            Expert tips to help you plan a faster, smoother, stress-free move.
          </p>
        </header>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                  {post.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-medium text-slate-400">
                  {post.readTime}
                </span>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-navy">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green">
                  Read more
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
              href="/resources"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/20 px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-navy/5"
            >
              View all resources
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
