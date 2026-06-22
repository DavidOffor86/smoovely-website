import QuoteButton from "./QuoteButton";

const trustItems = ["Fully insured", "Same-day available", "No hidden fees"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-10%] top-[-20%] h-[480px] w-[480px] rounded-full bg-green blur-[140px]" />
        <div className="absolute left-[-5%] bottom-[-30%] h-[360px] w-[360px] rounded-full bg-green blur-[150px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-green/15 px-4 py-1.5 text-xs font-semibold text-green">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Trusted by 100+ movers across the UK
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium removals &amp; logistics, done the{" "}
            <span className="text-green">smooth</span> way.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            From luxury home moves to time-critical deliveries — get an instant,
            transparent quote in under 90 seconds. Professional, fully insured,
            available same-day, nationwide.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <QuoteButton variant="primary">Get Your Quote</QuoteButton>
            <QuoteButton href="/solutions" variant="secondary">
              View Solutions
            </QuoteButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {trustItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm text-slate-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-green"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/10">
            <img
              src="/images/Smoovely Hero Page - Van - Home Removals.jpeg"
              alt="Smoovely QuickMove team loading a removals van"
              className="h-[320px] w-full object-cover sm:h-[460px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
