export const metadata = {
  title: "Under Construction",
  description: "We're currently making improvements. Please check back shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-white px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-green/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-green">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Under construction
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          We&apos;re making improvements
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          We&apos;re currently making improvements. Please check back shortly.
        </p>

        <div className="mt-8">
          <a
            href="tel:02045795520"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green/25 transition hover:bg-green/90"
          >
            Need us now? Call the team
          </a>
        </div>
      </div>
    </section>
  );
}
