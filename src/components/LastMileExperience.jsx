const points = [
  {
    title: "Accurate ETAs",
    desc: "Customers get realistic arrival windows, not vague all-day waits.",
  },
  {
    title: "Real-time notifications",
    desc: "Automatic updates at dispatch, en route and on arrival.",
  },
  {
    title: "Professional drivers",
    desc: "Vetted, uniformed drivers who represent your brand well.",
  },
  {
    title: "Fewer failed deliveries",
    desc: "Live tracking and contact details mean more first-time successes.",
  },
];

export default function LastMileExperience() {
  return (
    <section id="last-mile" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Visual */}
        <div className="order-1">
          <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-200">
            <img
              src="/images/Medical Deliveries.jpg"
              alt="Last-mile delivery to a customer's door"
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="order-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Last-mile experience
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Delivering exceptional last-mile experiences
          </h2>
          <p className="mt-4 max-w-lg text-slate-600">
            The final mile is where your customer forms their lasting
            impression. We make every drop reliable, transparent and on time.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-green"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
